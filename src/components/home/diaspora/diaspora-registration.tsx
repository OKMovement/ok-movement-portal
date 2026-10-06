"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import QRCode from "qrcode";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Loader2,
  MessageCircle,
  ShieldCheck,
  X,
} from "lucide-react";

import CountryPicker from "@/components/ui/country-picker";
import PhoneInput from "@/components/ui/phone-input";
import { DIASPORA_WHATSAPP_URL } from "@/lib/diaspora";
import { nigeriaStateOptions } from "@/lib/nigeria-locations";
import { isNigerianPhoneNumber, isPhoneValid } from "@/lib/phone-validation";
import DiasporaDonateModal from "../../disapora/diaspora-donate-modal";
import {
  diasporaEngagementOptions,
  diasporaNextSteps,
  type DiasporaEngagementType,
} from "@/data/diaspora-data";
import { FieldLabel, TricolorRule } from "./diaspora-shared";

const inputClass =
  "min-h-12 w-full rounded-md border border-rule-strong bg-paper-raised px-4 text-sm text-ink placeholder:text-faint transition-colors duration-200 focus-visible:border-green-deep";

/**
 * Portalled, with a focus trap, scroll lock and focus restore.
 */
function RegistrationSuccessDialog({
  firstName,
  qrCode,
  onClose,
}: {
  firstName: string;
  qrCode: string;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    const panel = panelRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel?.querySelector<HTMLElement>("button, a[href]")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  if (!isMounted) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center p-4 [z-index:var(--z-modal)]">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/70 backdrop-blur-sm animate-in fade-in duration-200"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="diaspora-success-title"
        className="relative w-full max-w-md overflow-hidden rounded-lg border border-rule bg-paper-raised p-7 text-center shadow-4 animate-in fade-in zoom-in-95 duration-200 sm:p-9"
      >
        <TricolorRule className="absolute inset-x-0 top-0 h-1 w-full" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-5 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted transition duration-200 hover:bg-ink hover:text-white active:scale-95"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>

        <p className="font-display text-[11px] font-bold uppercase tracking-[0.28em] text-green-deep">
          Registration confirmed
        </p>
        <h2
          id="diaspora-success-title"
          className="mt-3 font-display text-2xl font-extrabold tracking-[-0.025em] text-ink"
        >
          Welcome{firstName ? `, ${firstName}` : ""}.
        </h2>
        <p className="mx-auto mt-4 max-w-[46ch] text-sm leading-relaxed text-body text-pretty">
          Your WhatsApp community link is on its way to your email. You can also scan this code to
          join now.
        </p>

        {qrCode ? (
          // A generated data: URL — next/image cannot optimise one, so this stays
          // a plain img with explicit dimensions to hold its space.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrCode}
            alt="QR code linking to the OK Movement diaspora WhatsApp community"
            width={176}
            height={176}
            className="mx-auto mt-6 h-44 w-44 rounded-md border border-rule bg-paper-raised p-2"
          />
        ) : null}

        <a
          href={DIASPORA_WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="group mt-6 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-md bg-green-deep px-6 text-sm font-semibold tracking-wide text-white transition duration-200 hover:bg-ink active:scale-[0.99]"
        >
          <MessageCircle aria-hidden="true" className="h-4 w-4" />
          Open the WhatsApp link
        </a>
      </div>
    </div>,
    document.body,
  );
}

export type DiasporaRegistrationSectionProps = {
  /** Pre-selects the country picker. The visitor can still change it. */
  defaultCountry?: string;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  formHeading?: string;
};

/**
 * The whole `#registration` section: the steps aside, the form, the success
 * state and the donate hand-off. Shared so the country pages cannot drift out
 * of sync with the API contract.
 */
export default function DiasporaRegistrationSection({
  defaultCountry = "",
  eyebrow = "Step in",
  heading = "Register with the diaspora desk.",
  intro = "Tell us where in the world you are and how you would like to serve. Our diaspora desk will reach out within 1–2 business days — in your time zone.",
  formHeading = "How will you serve from abroad?",
}: DiasporaRegistrationSectionProps) {
  const [engagement, setEngagement] = useState<DiasporaEngagementType>("volunteer-abroad");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState(defaultCountry);
  const [city, setCity] = useState("");
  const [stateOfOrigin, setStateOfOrigin] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [qrCode, setQrCode] = useState("");

  const selected = useMemo(
    () => diasporaEngagementOptions.find((option) => option.key === engagement)!,
    [engagement],
  );
  const isDonate = engagement === "donate";

  useEffect(() => {
    QRCode.toDataURL(DIASPORA_WHATSAPP_URL, {
      width: 320,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#0b100c", light: "#ffffff" },
    })
      .then(setQrCode)
      .catch(() => setQrCode(""));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setError("");
    if (!name.trim() || !email.trim() || !phone || !country || !city.trim()) {
      setError("Please complete all required fields.");
      return;
    }
    if (!isPhoneValid(phone)) {
      setError("Please enter a valid international phone number.");
      return;
    }
    if (isNigerianPhoneNumber(phone)) {
      setError("Nigerian phone numbers should use the member registration page instead.");
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/diaspora", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          engagement: selected.label,
          country,
          city,
          stateOfOrigin,
        }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(data?.error ?? "Unable to submit your registration right now.");
        setStatus("idle");
        return;
      }
      setStatus("sent");
      setSuccessOpen(true);
    } catch {
      setError("Unable to submit your registration. Please check your connection and try again.");
      setStatus("idle");
    }
  }

  function resetForm() {
    setStatus("idle");
    setError("");
    setName("");
    setEmail("");
    setPhone("");
    setCountry(defaultCountry);
    setCity("");
    setStateOfOrigin("");
    setEngagement("volunteer-abroad");
  }

  function closeSuccess() {
    setSuccessOpen(false);
    if (isDonate) setDonateOpen(true);
  }

  return (
    <>
      <section
        id="registration"
        aria-labelledby="registration-heading"
        className="relative border-t border-rule bg-paper-sunk py-20 sm:py-24 lg:py-28"
      >
        <div className="mx-auto grid w-[min(100%-2rem,82rem)] gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-14">
          <aside className="reveal lg:sticky lg:top-28 lg:self-start">
            <TricolorRule />
            <p className="mt-5 font-display text-[11px] font-bold uppercase tracking-[0.28em] text-green-deep">
              {eyebrow}
            </p>
            <h2
              id="registration-heading"
              className="mt-4 font-display text-display-3 font-extrabold leading-[0.98] tracking-[-0.025em] text-ink text-balance"
            >
              {heading}
            </h2>
            <p className="mt-5 max-w-[48ch] leading-relaxed text-body text-pretty">{intro}</p>

            {/* A real sequence, so these are numbered. */}
            <ol className="mt-9 border-t border-rule">
              {diasporaNextSteps.map((step, index) => (
                <li key={step.title} className="flex gap-5 border-b border-rule py-4">
                  <span
                    aria-hidden="true"
                    className="font-display text-xs font-bold tabular-nums text-faint"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold tracking-tight text-ink">{step.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-7 flex items-start gap-2.5 text-[13px] leading-relaxed text-muted">
              <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-green-deep" />
              Your details are used solely to coordinate your involvement, and are never sold or
              shared.
            </p>
          </aside>

          <div className="reveal relative overflow-hidden border border-rule bg-paper-raised shadow-2">
            <TricolorRule className="absolute inset-x-0 top-0 h-1 w-full" />

            {status === "sent" ? (
              <div className="flex flex-col items-center px-6 py-16 text-center sm:px-12">
                <CheckCircle2 aria-hidden="true" className="h-12 w-12 text-green-deep" />
                <h3 className="mt-6 max-w-[20ch] font-display text-2xl font-extrabold leading-tight tracking-[-0.025em] text-ink text-balance sm:text-3xl">
                  Welcome aboard{name ? `, ${name.split(" ")[0]}` : ""} — home just got closer.
                </h3>
                <p className="mt-5 max-w-[52ch] leading-relaxed text-body text-pretty">
                  A confirmation email is on its way. The diaspora desk will reach out within 1–2
                  business days with your next steps and connect you with members in your city.
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex min-h-12 items-center justify-center rounded-md bg-ink px-6 text-sm font-semibold tracking-wide text-white transition duration-200 hover:bg-green-deep active:scale-[0.99]"
                  >
                    Register another
                  </button>
                  <a
                    href="#support"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-rule-strong px-6 text-sm font-semibold tracking-wide text-ink transition duration-200 hover:border-green-deep hover:text-green-deep active:scale-[0.99]"
                  >
                    View ways to give
                    <Heart aria-hidden="true" className="h-4 w-4 text-brand-red" />
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="px-6 py-10 sm:px-10 sm:py-12">
                <p className="font-display text-[11px] font-bold uppercase tracking-[0.28em] text-green-deep">
                  Diaspora registration
                </p>
                <h3 className="mt-3 max-w-[22ch] font-display text-2xl font-extrabold leading-tight tracking-[-0.025em] text-ink text-balance sm:text-[1.9rem]">
                  {formHeading}
                </h3>
                <p className="mt-4 max-w-[58ch] leading-relaxed text-body text-pretty">
                  Pick the role that fits, tell us where you are, and the diaspora desk takes it
                  from there. Required fields are marked with an asterisk.
                </p>

                <fieldset className="mt-9">
                  <legend className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                    I want to <span className="text-brand-red">*</span>
                  </legend>
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {diasporaEngagementOptions.map(({ key, label, icon: Icon }) => {
                      const active = key === engagement;
                      return (
                        <label
                          key={key}
                          className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3.5 text-sm font-medium transition duration-200 ${
                            active
                              ? "border-green-deep bg-green-lift text-ink"
                              : "border-rule-strong text-muted hover:border-green-deep hover:text-ink"
                          }`}
                        >
                          <input
                            type="radio"
                            name="engagement"
                            value={key}
                            checked={active}
                            onChange={() => setEngagement(key)}
                            className="sr-only"
                          />
                          <Icon
                            aria-hidden="true"
                            className={`h-5 w-5 shrink-0 ${
                              active ? "text-green-deep" : "text-faint"
                            }`}
                          />
                          {label}
                        </label>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-[13px] leading-relaxed text-muted">
                    <span className="font-semibold text-green-deep">{selected.label}:</span>{" "}
                    {selected.description}
                  </p>
                </fieldset>

                <div className="mt-9 grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <FieldLabel>Full name</FieldLabel>
                    <input
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      autoComplete="name"
                      placeholder="Adaeze Okeke"
                      className={inputClass}
                    />
                  </label>
                  <label className="grid gap-2">
                    <FieldLabel>Email</FieldLabel>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </label>

                  {/* htmlFor/id, so the control is programmatically labelled. */}
                  <div className="grid gap-2 sm:col-span-2">
                    <label htmlFor="diaspora-phone">
                      <FieldLabel>Telephone / WhatsApp number</FieldLabel>
                    </label>
                    <PhoneInput
                      id="diaspora-phone"
                      required
                      defaultCountry="us"
                      value={phone}
                      onChange={setPhone}
                      placeholder="International phone number"
                    />
                  </div>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <FieldLabel>Country of residence</FieldLabel>
                    <CountryPicker
                      value={country}
                      onValueChange={setCountry}
                      ariaLabel="Country of residence"
                    />
                  </div>
                  <label className="grid gap-2">
                    <FieldLabel>City</FieldLabel>
                    <input
                      required
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      autoComplete="address-level2"
                      placeholder="London, Houston, Dubai…"
                      className={inputClass}
                    />
                  </label>
                  <div className="grid gap-2 sm:col-span-2">
                    <FieldLabel optional="(optional — helps us point your impact home)">
                      State of origin in Nigeria
                    </FieldLabel>
                    <CountryPicker
                      value={stateOfOrigin}
                      onValueChange={setStateOfOrigin}
                      options={nigeriaStateOptions.map((state) => state.label)}
                      placeholder="Select a state (optional)"
                      ariaLabel="State of origin in Nigeria"
                    />
                  </div>
                </div>

                <div className="mt-9 flex flex-col gap-5 border-t border-rule pt-7 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-center gap-2 text-[13px] text-muted">
                    <ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-green-deep" />
                    Your information is private and never shared.
                  </p>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    aria-busy={status === "sending"}
                    className="group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-md bg-green-deep px-7 text-sm font-semibold tracking-wide text-white shadow-green transition duration-200 hover:-translate-y-0.5 hover:bg-ink active:translate-y-0 active:scale-[0.99] disabled:translate-y-0 disabled:opacity-70"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        {isDonate ? "Register and donate" : "Join from abroad"}
                        <ArrowRight
                          aria-hidden="true"
                          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                      </>
                    )}
                  </button>
                </div>

                {error ? (
                  <p
                    role="alert"
                    className="mt-5 border-l-2 border-brand-red bg-paper-sunk py-3 pl-4 text-sm text-ink"
                  >
                    {error}{" "}
                    {isNigerianPhoneNumber(phone) ? (
                      <Link
                        href="/home/get-involved"
                        className="font-semibold text-brand-red underline underline-offset-2"
                      >
                        Go to member registration.
                      </Link>
                    ) : null}
                  </p>
                ) : null}

                {isDonate ? (
                  <p className="mt-5 border-l-2 border-green-deep bg-paper-sunk py-3 pl-4 text-[13px] leading-relaxed text-body">
                    <span className="font-semibold text-green-deep">Donating?</span> After
                    registering, a secure donation pledge flow opens for cash or campaign materials.
                  </p>
                ) : null}
              </form>
            )}
          </div>
        </div>
      </section>

      {successOpen ? (
        <RegistrationSuccessDialog
          firstName={name ? name.split(" ")[0]! : ""}
          qrCode={qrCode}
          onClose={closeSuccess}
        />
      ) : null}

      <DiasporaDonateModal open={donateOpen} donorName={name} onClose={() => setDonateOpen(false)} />
    </>
  );
}
