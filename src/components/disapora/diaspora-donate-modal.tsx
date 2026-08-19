import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  Loader2,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const CASH_PRESETS = [25, 50, 100, 250, 500] as const;

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "GBP", symbol: "£" },
  { code: "EUR", symbol: "€" },
  { code: "CAD", symbol: "C$" },
  { code: "NGN", symbol: "₦" },
] as const;

type CurrencyCode = (typeof CURRENCIES)[number]["code"];

const PAYMENT_PROVIDERS = [
  {
    key: "paystack",
    label: "Paystack",
    blurb: "Cards, bank transfer & USSD — trusted across Africa",
  },
  {
    key: "flutterwave",
    label: "Flutterwave",
    blurb: "Cards, mobile money & international payments",
  },
] as const;

type ProviderKey = (typeof PAYMENT_PROVIDERS)[number]["key"];

const MATERIALS = [
  "Face Caps",
  "T-Shirts",
  "Polo Shirts",
  "Wristbands",
  "Flags & Banners",
  "Posters & Flyers",
  "Megaphones",
  "Branded Umbrellas",
] as const;

const DONATIONS_KEY = "ok-movement:diaspora-donations:v1";

type DonationRecord =
  | {
      kind: "cash";
      amount: number;
      currency: CurrencyCode;
      provider: ProviderKey;
      reference: string;
      at: string;
    }
  | {
      kind: "materials";
      items: { item: string; quantity: number }[];
      note: string;
      reference: string;
      at: string;
    };

function saveDonation(record: DonationRecord) {
  try {
    const raw = window.localStorage.getItem(DONATIONS_KEY);
    const list: DonationRecord[] = raw ? JSON.parse(raw) : [];
    list.push(record);
    window.localStorage.setItem(DONATIONS_KEY, JSON.stringify(list));
  } catch {
    /* non-blocking */
  }
}

function makeReference(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.floor(
    Math.random() * 900 + 100,
  )}`;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

type Step = "choose" | "cash" | "materials" | "done";

export default function DiasporaDonateModal({
  open,
  donorName,
  onClose,
}: {
  open: boolean;
  donorName?: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("choose");
  const [processing, setProcessing] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);

  // Cash state
  const [amount, setAmount] = useState<number | "">(100);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [provider, setProvider] = useState<ProviderKey>("paystack");

  // Materials state
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [note, setNote] = useState("");

  // Done state
  const [doneSummary, setDoneSummary] = useState<{ title: string; body: string }>({
    title: "",
    body: "",
  });

  useEffect(() => {
    if (open) {
      setStep("choose");
      setProcessing(false);
      setAmount(100);
      setCurrency("USD");
      setProvider("paystack");
      setQuantities({});
      setNote("");
    } else if (timerRef.current !== null) {
      // Cancel any in-flight simulated submission when the dialog closes
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [open]);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!open) return;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panelRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      // Simple focus trap: keep Tab cycling inside the dialog panel
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (event.shiftKey) {
        if (active === first || !panel.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !panel.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  const currencySymbol = useMemo(
    () => CURRENCIES.find((c) => c.code === currency)?.symbol ?? "$",
    [currency],
  );

  const selectedMaterials = useMemo(
    () =>
      MATERIALS.filter((item) => (quantities[item] ?? 0) > 0).map((item) => ({
        item,
        quantity: quantities[item],
      })),
    [quantities],
  );

  if (!open) return null;

  const adjustQuantity = (item: string, delta: number) => {
    setQuantities((prev) => {
      const next = Math.max(0, Math.min(9999, (prev[item] ?? 0) + delta));
      return { ...prev, [item]: next };
    });
  };

  const handleCashPay = () => {
    if (!amount || amount <= 0) return;
    setProcessing(true);
    const providerLabel = PAYMENT_PROVIDERS.find((p) => p.key === provider)!.label;
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      const reference = makeReference(provider === "paystack" ? "PSK" : "FLW");
      saveDonation({
        kind: "cash",
        amount: Number(amount),
        currency,
        provider,
        reference,
        at: new Date().toISOString(),
      });
      setDoneSummary({
        title: "Donation pledge received!",
        body: `Your ${currencySymbol}${Number(amount).toLocaleString()} ${currency} donation via ${providerLabel} has been recorded (ref ${reference}). Our finance desk will email you a secure ${providerLabel} payment link to complete the transaction.`,
      });
      setProcessing(false);
      setStep("done");
    }, 1100);
  };

  const handleMaterialsSubmit = () => {
    if (selectedMaterials.length === 0) return;
    setProcessing(true);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      const reference = makeReference("MAT");
      saveDonation({
        kind: "materials",
        items: selectedMaterials,
        note: note.trim(),
        reference,
        at: new Date().toISOString(),
      });
      const summary = selectedMaterials
        .map(({ item, quantity }) => `${quantity.toLocaleString()}× ${item}`)
        .join(", ");
      setDoneSummary({
        title: "Materials donation submitted!",
        body: `Thank you for pledging ${summary} (ref ${reference}). The admin team will review your donation and contact you to arrange collection or delivery.`,
      });
      setProcessing(false);
      setStep("done");
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Donate to the OK Movement"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close donation dialog"
        onClick={onClose}
        className="absolute inset-0 bg-brand-black/70 backdrop-blur-sm"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative z-10 max-h-[92dvh] w-full overflow-y-auto rounded-t-[20px] bg-white shadow-2xl outline-none sm:max-w-lg sm:rounded-[20px]"
      >
        <span aria-hidden="true" className="sticky top-0 z-10 flex h-[3px]">
          <span className="h-full flex-1 bg-brand-green" />
          <span className="h-full flex-1 bg-brand-black" />
          <span className="h-full flex-1 bg-brand-red" />
        </span>

        <div className="flex items-center justify-between px-6 pt-5">
          <div className="flex items-center gap-2">
            {(step === "cash" || step === "materials") && (
              <button
                type="button"
                onClick={() => setStep("choose")}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-brand-black transition hover:bg-black/5"
                aria-label="Back"
              >
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-red">
              {step === "done" ? "Thank you" : "Donate to the movement"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-brand-black transition hover:bg-black/5"
            aria-label="Close"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        {/* STEP: choose ------------------------------------------- */}
        {step === "choose" && (
          <div className="px-6 pb-8 pt-4">
            <h3 className="text-2xl font-medium leading-tight text-brand-black">
              {donorName ? `${donorName.split(" ")[0]}, how` : "How"} would you like to
              give?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-black/60">
              Every contribution — cash or kind — powers mobilisation on the ground back
              home.
            </p>
            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={() => setStep("cash")}
                className="group flex items-center gap-4 rounded-[14px] border border-black/10 bg-white p-5 text-left transition hover:border-brand-green hover:bg-brand-green/5"
              >
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-green text-white">
                  <Banknote aria-hidden="true" className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-base font-medium text-brand-black">
                    Donate Cash
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-black/60">
                    Give any amount securely via Paystack or Flutterwave.
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="ml-auto h-4 w-4 shrink-0 text-black/30 transition group-hover:text-brand-green"
                />
              </button>
              <button
                type="button"
                onClick={() => setStep("materials")}
                className="group flex items-center gap-4 rounded-[14px] border border-black/10 bg-white p-5 text-left transition hover:border-brand-red hover:bg-brand-red/5"
              >
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-red text-white">
                  <Package aria-hidden="true" className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-base font-medium text-brand-black">
                    Donate Campaign Materials
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-black/60">
                    Caps, t-shirts, polos, wristbands & more — pick items and quantity.
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="ml-auto h-4 w-4 shrink-0 text-black/30 transition group-hover:text-brand-red"
                />
              </button>
            </div>
          </div>
        )}

        {/* STEP: cash --------------------------------------------- */}
        {step === "cash" && (
          <div className="px-6 pb-8 pt-4">
            <h3 className="text-2xl font-medium leading-tight text-brand-black">
              Donate cash
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-black/60">
              Choose an amount and your preferred payment channel.
            </p>

            <div className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/60">
                Amount
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {CASH_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`min-h-10 rounded-full border px-4 text-sm font-semibold transition ${
                      amount === preset
                        ? "border-brand-green bg-brand-green text-white"
                        : "border-black/12 bg-white text-brand-black hover:border-brand-green/50 hover:bg-brand-green/5"
                    }`}
                  >
                    {currencySymbol}
                    {preset}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <select
                  aria-label="Currency"
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
                  className="min-h-12 rounded-[10px] border border-black/12 bg-white px-3 text-sm font-semibold text-brand-black focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green/50"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  inputMode="decimal"
                  aria-label="Custom amount"
                  placeholder="Custom amount"
                  value={amount}
                  onChange={(event) =>
                    setAmount(event.target.value === "" ? "" : Number(event.target.value))
                  }
                  className="min-h-12 w-full rounded-[10px] border border-black/12 bg-white px-4 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green/50"
                />
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/60">
                Pay with
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {PAYMENT_PROVIDERS.map((p) => (
                  <label
                    key={p.key}
                    className={`flex cursor-pointer flex-col gap-1 rounded-[12px] border p-4 transition focus-within:ring-2 focus-within:ring-brand-green/60 ${
                      provider === p.key
                        ? "border-brand-green bg-brand-green/5"
                        : "border-black/10 bg-white hover:border-brand-green/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="provider"
                      value={p.key}
                      checked={provider === p.key}
                      onChange={() => setProvider(p.key)}
                      className="sr-only"
                    />
                    <span className="flex items-center gap-2 text-sm font-semibold text-brand-black">
                      <span
                        aria-hidden="true"
                        className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                          provider === p.key
                            ? "border-brand-green bg-brand-green"
                            : "border-black/25"
                        }`}
                      >
                        {provider === p.key && (
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </span>
                      {p.label}
                    </span>
                    <span className="text-[11px] leading-relaxed text-black/55">
                      {p.blurb}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={processing || !amount || Number(amount) <= 0}
              onClick={handleCashPay}
              className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[12px] bg-brand-green px-6 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_36px_-14px_rgb(0_166_81/0.55)] transition hover:bg-brand-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? (
                <>
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  Donate {amount ? `${currencySymbol}${Number(amount).toLocaleString()}` : ""}{" "}
                  via {PAYMENT_PROVIDERS.find((p) => p.key === provider)!.label}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </>
              )}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-black/50">
              <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-brand-green" />
              Your pledge is recorded — the finance desk follows up with a secure
              payment link
            </p>
            <p className="mt-1 text-center text-[11px] text-black/40">
              No card details are collected on this page.
            </p>
          </div>
        )}

        {/* STEP: materials ---------------------------------------- */}
        {step === "materials" && (
          <div className="px-6 pb-8 pt-4">
            <h3 className="text-2xl font-medium leading-tight text-brand-black">
              Donate campaign materials
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-black/60">
              Select the items and quantities you want to donate. The admin team will
              contact you to arrange collection or delivery.
            </p>

            <ul className="mt-5 divide-y divide-black/6 rounded-[14px] border border-black/10">
              {MATERIALS.map((item) => {
                const qty = quantities[item] ?? 0;
                return (
                  <li key={item} className="flex items-center justify-between gap-3 px-4 py-3">
                    <span
                      className={`text-sm font-medium ${
                        qty > 0 ? "text-brand-black" : "text-black/65"
                      }`}
                    >
                      {item}
                    </span>
                    <span className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => adjustQuantity(item, -1)}
                        disabled={qty === 0}
                        aria-label={`Decrease ${item} quantity`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/12 text-brand-black transition hover:border-brand-red hover:bg-brand-red/5 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus aria-hidden="true" className="h-3.5 w-3.5" />
                      </button>
                      <input
                        type="number"
                        min={0}
                        max={9999}
                        value={qty}
                        aria-label={`${item} quantity`}
                        onChange={(event) =>
                          setQuantities((prev) => ({
                            ...prev,
                            [item]: Math.max(
                              0,
                              Math.min(9999, Number(event.target.value) || 0),
                            ),
                          }))
                        }
                        className="h-9 w-16 rounded-[8px] border border-black/12 bg-white text-center text-sm font-semibold text-brand-black focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green/50"
                      />
                      <button
                        type="button"
                        onClick={() => adjustQuantity(item, 1)}
                        aria-label={`Increase ${item} quantity`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/12 text-brand-black transition hover:border-brand-green hover:bg-brand-green/5"
                      >
                        <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>

            <label className="mt-4 flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/60">
                Anything else? (optional)
              </span>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={2}
                maxLength={400}
                placeholder="e.g. other items, branding notes, where the items are located…"
                className="rounded-[10px] border border-black/12 bg-white px-4 py-3 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green/50"
              />
            </label>

            <button
              type="button"
              disabled={processing || selectedMaterials.length === 0}
              onClick={handleMaterialsSubmit}
              className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[12px] bg-brand-red px-6 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_36px_-14px_rgb(224_40_40/0.5)] transition hover:bg-brand-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? (
                <>
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit for admin processing
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </>
              )}
            </button>
            {selectedMaterials.length === 0 && (
              <p className="mt-3 text-center text-[11px] text-black/50">
                Add at least one item to continue.
              </p>
            )}
          </div>
        )}

        {/* STEP: done ---------------------------------------------- */}
        {step === "done" && (
          <div className="flex flex-col items-center px-6 pb-10 pt-6 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
              <CheckCircle2 aria-hidden="true" className="h-7 w-7" />
            </span>
            <h3 className="mt-5 text-2xl font-medium leading-tight text-brand-black">
              {doneSummary.title}
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-black/65">
              {doneSummary.body}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setStep("choose")}
                className="inline-flex min-h-12 items-center justify-center rounded-[10px] border border-brand-green/30 bg-brand-green/5 px-6 text-sm font-semibold uppercase tracking-[0.16em] text-brand-green transition hover:bg-brand-green hover:text-white"
              >
                Donate again
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-brand-black px-6 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-brand-green"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
