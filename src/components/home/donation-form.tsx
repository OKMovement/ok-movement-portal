"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Check, Globe2, Loader2, Plane, ShieldCheck } from "lucide-react";
import PhoneInput from "@/components/ui/phone-input";
import { donationCheckoutSchema } from "@/lib/donation-validation";
import {
  getLgaOptionsByState,
  getWardOptionsByStateAndLga,
  nigeriaStateOptions,
} from "@/lib/nigeria-locations";

const inputClass =
  "min-h-12 w-full rounded-[10px] border border-black/12 bg-white px-4 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50 disabled:cursor-not-allowed disabled:opacity-60";
const selectClass = `${inputClass} appearance-none bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2020%2020%22%20fill=%22%2300a651%22><path%20d=%22M5.5%208l4.5%204.5L14.5%208z%22/></svg>')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`;
const quickAmounts = [5_000, 10_000, 25_000, 50_000];

type FormState = {
  donationAmount: string;
  name: string;
  email: string;
  phone: string;
  isDiaspora: boolean;
  country: string;
  votingState: string;
  votingLga: string;
  votingWard: string;
};

const initialState: FormState = {
  donationAmount: "",
  name: "",
  email: "",
  phone: "",
  isDiaspora: false,
  country: "",
  votingState: "",
  votingLga: "",
  votingWard: "",
};

function formatAmount(value: string) {
  const sanitized = value.replace(/[^\d.]/g, "");
  const firstDot = sanitized.indexOf(".");
  const normalized = firstDot < 0
    ? sanitized
    : `${sanitized.slice(0, firstDot + 1)}${sanitized.slice(firstDot + 1).replaceAll(".", "")}`;
  const [integer = "", decimal = ""] = normalized.split(".");
  const grouped = integer.replace(/^0+(?=\d)/, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return normalized.includes(".") ? `${grouped || "0"}.${decimal.slice(0, 2)}` : grouped;
}

function fieldLabel(label: string) {
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">
      {label} <span className="text-brand-red">*</span>
    </span>
  );
}

export default function DonationForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const checkoutAttempt = useRef<{ payload: string; key: string } | null>(null);
  const lgaOptions = useMemo(() => getLgaOptionsByState(form.votingState), [form.votingState]);
  const wardOptions = useMemo(
    () => getWardOptionsByStateAndLga(form.votingState, form.votingLga),
    [form.votingState, form.votingLga],
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (redirecting) return;
    setError("");

    const payload = JSON.stringify(form);
    if (checkoutAttempt.current?.payload !== payload) {
      checkoutAttempt.current = { payload, key: crypto.randomUUID() };
    }

    const requestBody = {
      ...form,
      checkoutKey: checkoutAttempt.current.key,
      provider: "paystack" as const,
    };
    const parsed = donationCheckoutSchema.safeParse(requestBody);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please complete your donation details.");
      return;
    }

    setRedirecting(true);
    try {
      const response = await fetch("/api/donations/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data = (await response.json().catch(() => null)) as { checkoutUrl?: string; error?: string } | null;
      if (!response.ok || !data?.checkoutUrl) {
        setError(data?.error ?? "Unable to open Paystack checkout. Please try again.");
        setRedirecting(false);
        return;
      }
      window.location.assign(data.checkoutUrl);
    } catch {
      setError("Unable to connect. Please check your connection and try again.");
      setRedirecting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative overflow-hidden rounded-[20px] border border-black/10 bg-white p-6 shadow-[0_30px_60px_-34px_rgb(0_0_0/0.5)] sm:p-8 lg:p-10">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 flex h-[3px]">
        <span className="flex-1 bg-brand-green" />
        <span className="flex-1 bg-brand-black" />
        <span className="flex-1 bg-brand-red" />
      </span>
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-brand-red">Secure donation</p>
          <h2 className="mt-3 text-2xl font-medium sm:text-3xl">Make your contribution</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-black/60">
            Enter your details, then continue to Paystack&apos;s hosted checkout to complete payment in NGN.
          </p>
        </div>
        <span className="hidden shrink-0 rounded-full bg-brand-green/10 p-3 text-brand-green sm:inline-flex">
          <ShieldCheck aria-hidden="true" className="h-6 w-6" />
        </span>
      </div>

      <div className="mt-8">
        {fieldLabel("Donation amount")}
        <div className="relative mt-1.5">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-black/65">₦</span>
          <input
            value={form.donationAmount}
            onChange={(event) => update("donationAmount", formatAmount(event.target.value))}
            inputMode="decimal"
            autoComplete="off"
            placeholder="e.g. 50,000"
            className={`${inputClass} pl-10 text-base font-medium`}
          />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => update("donationAmount", amount.toLocaleString("en-NG"))}
              className="min-h-10 rounded-[9px] border border-black/10 bg-[#f7f7f4] px-3 text-xs font-semibold text-black/70 transition hover:border-brand-green hover:bg-brand-green/5 hover:text-brand-green"
            >
              ₦{amount.toLocaleString("en-NG")}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className="grid gap-1.5">
          {fieldLabel("Full name")}
          <input value={form.name} onChange={(event) => update("name", event.target.value)} autoComplete="name" placeholder="Your full name" className={inputClass} />
        </label>
        <label className="grid gap-1.5">
          {fieldLabel("Email")}
          <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} autoComplete="email" placeholder="you@example.com" className={inputClass} />
        </label>
        <label className="grid gap-1.5 sm:col-span-2">
          {fieldLabel("Telephone / WhatsApp number")}
          <PhoneInput id="donation-phone" value={form.phone} onChange={(value) => update("phone", value)} required placeholder="e.g. 8012345678" />
        </label>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-[12px] border border-black/10 bg-[#f7f7f4] p-4">
        <input
          id="donation-diaspora"
          type="checkbox"
          checked={form.isDiaspora}
          onChange={(event) => setForm((current) => ({
            ...current,
            isDiaspora: event.target.checked,
            country: event.target.checked ? current.country : "",
            votingState: event.target.checked ? "" : current.votingState,
            votingLga: event.target.checked ? "" : current.votingLga,
            votingWard: event.target.checked ? "" : current.votingWard,
          }))}
          className="mt-1 h-4 w-4 accent-brand-green"
        />
        <label htmlFor="donation-diaspora" className="cursor-pointer text-sm">
          <span className="flex items-center gap-2 font-medium"><Plane aria-hidden="true" className="h-4 w-4 text-brand-red" />I&apos;m in the diaspora</span>
          <span className="mt-1 block text-xs leading-relaxed text-black/55">Use your country of residence instead of Nigerian voting location.</span>
        </label>
      </div>

      {form.isDiaspora ? (
        <label className="mt-6 grid gap-1.5">
          {fieldLabel("Country of residence")}
          <span className="relative">
            <Globe2 aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-green" />
            <input value={form.country} onChange={(event) => update("country", event.target.value)} autoComplete="country-name" placeholder="e.g. United Kingdom" className={`${inputClass} pl-11`} />
          </span>
        </label>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <label className="grid gap-1.5">
            {fieldLabel("Voting state")}
            <select value={form.votingState} onChange={(event) => setForm((current) => ({ ...current, votingState: event.target.value, votingLga: "", votingWard: "" }))} className={selectClass}>
              <option value="">Select a state</option>
              {nigeriaStateOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="grid gap-1.5">
            {fieldLabel("Voting LGA")}
            <select value={form.votingLga} onChange={(event) => setForm((current) => ({ ...current, votingLga: event.target.value, votingWard: "" }))} disabled={!form.votingState} className={selectClass}>
              <option value="">{form.votingState ? "Select an LGA" : "Select state first"}</option>
              {lgaOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="grid gap-1.5">
            {fieldLabel("Voting ward")}
            <select value={form.votingWard} onChange={(event) => update("votingWard", event.target.value)} disabled={!form.votingLga} className={selectClass}>
              <option value="">{form.votingLga ? "Select a ward" : "Select LGA first"}</option>
              {wardOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>
      )}

      <fieldset className="mt-7">
        <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Payment provider</legend>
        <label className="mt-2 flex items-center justify-between gap-4 rounded-[12px] border border-brand-green bg-brand-green/5 p-4">
          <span className="flex items-center gap-3">
            <input type="radio" name="donationProvider" checked readOnly className="accent-brand-green" />
            <span><span className="block text-sm font-semibold">Paystack</span><span className="mt-0.5 block text-xs text-black/55">Secure hosted checkout</span></span>
          </span>
          <Check aria-hidden="true" className="h-5 w-5 text-brand-green" />
        </label>
      </fieldset>

      {error ? <p role="alert" className="mt-5 rounded-[10px] border border-brand-red/20 bg-brand-red/5 px-4 py-3 text-sm text-brand-red">{error}</p> : null}

      <div className="mt-7 flex flex-col gap-4 border-t border-black/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex max-w-sm items-start gap-2 text-xs leading-relaxed text-black/55">
          <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
          Payment details are entered only on Paystack. We record your donation after Paystack confirms it.
        </p>
        <button type="submit" disabled={redirecting} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[12px] bg-brand-green px-7 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_36px_-14px_rgb(0_166_81/0.55)] transition hover:bg-brand-black disabled:cursor-wait disabled:opacity-70">
          {redirecting ? <><Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />Opening Paystack…</> : <>Continue to Paystack<ArrowUpRight aria-hidden="true" className="h-4 w-4" /></>}
        </button>
      </div>
    </form>
  );
}
