"use client";

import { useEffect, useState, type FormEvent } from "react";
import QRCode from "qrcode";
import { CheckCircle2, Globe2, Loader2, Mail, MapPin, MessageCircle, Users, X } from "lucide-react";
import HomeFooterSection from "./home-footer-section";
import HomeSiteHeader from "./home-site-header";
import PhoneInput from "@/components/ui/phone-input";
import CountryPicker from "@/components/ui/country-picker";
import { DIASPORA_WHATSAPP_URL } from "@/lib/diaspora";
import { isNigerianPhoneNumber, isPhoneValid } from "@/lib/phone-validation";

type FormValues = { name: string; email: string; phone: string; country: string };

const inputClass =
  "min-h-12 w-full rounded-[10px] border border-black/12 bg-white px-4 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50";

export default function DiasporaPage() {
  const [values, setValues] = useState<FormValues>({ name: "", email: "", phone: "", country: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    QRCode.toDataURL(DIASPORA_WHATSAPP_URL, {
      width: 320,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#121212", light: "#ffffff" },
    }).then(setQrCode).catch(() => setQrCode(""));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setError("");

    if (!values.country) {
      setError("Please select your country of residence.");
      return;
    }

    if (!isPhoneValid(values.phone)) {
      setError("Please enter a valid international phone number.");
      return;
    }

    if (isNigerianPhoneNumber(values.phone)) {
      setError("Nigerian phone numbers should use the member registration page instead.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/diaspora", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json().catch(() => null)) as { error?: string; code?: string } | null;
      if (!response.ok) {
        setError(data?.error ?? "Unable to submit your registration. Please try again.");
        return;
      }
      setFirstName(values.name.trim().split(/\s+/)[0] ?? "");
      setSuccessOpen(true);
      setValues({ name: "", email: "", phone: "", country: "" });
    } catch {
      setError("Unable to submit your registration. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-brand-black">
      <HomeSiteHeader />
      <section className="relative isolate overflow-visible bg-brand-black py-16 text-white sm:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgb(0_166_81/0.38),transparent_34%),radial-gradient(circle_at_12%_90%,rgb(202_32_45/0.3),transparent_38%)]" />
        <div className="mx-auto grid w-[min(100%-2rem,74rem)] gap-12 lg:grid-cols-[1fr_30rem] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90">
              <Globe2 className="h-4 w-4" /> Global community
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Nigeria&apos;s future includes every Nigerian, everywhere.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              Join the OK Movement Diaspora community. Connect with Nigerians around the world, receive movement updates, and help shape the New Dawn from wherever you call home.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                [Users, "A global network"],
                [MessageCircle, "Direct community updates"],
                [MapPin, "Your country, your voice"],
              ].map(([Icon, label]) => {
                const ItemIcon = Icon as typeof Users;
                return <div key={label as string} className="flex items-center gap-2 text-sm font-medium text-white/85"><ItemIcon className="h-4 w-4 text-brand-green" />{label as string}</div>;
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="relative z-10 rounded-2xl bg-white p-6 text-brand-black shadow-[0_30px_60px_-24px_rgb(0_0_0/0.7)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red">Diaspora registration</p>
            <h2 className="mt-3 text-2xl font-semibold">Make your voice count.</h2>
            <p className="mt-2 text-sm leading-relaxed text-black/60">We&apos;ll send your WhatsApp community link to this email after registration.</p>
            <div className="mt-6 grid gap-4">
              <label className="grid gap-1.5"><span className="text-sm font-medium">Full name <span className="text-brand-red">*</span></span><input required value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} className={inputClass} autoComplete="name" /></label>
              <label className="grid gap-1.5"><span className="text-sm font-medium">Email address <span className="text-brand-red">*</span></span><input required type="email" value={values.email} onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))} className={inputClass} autoComplete="email" /></label>
              <label className="grid gap-1.5"><span className="text-sm font-medium">WhatsApp number <span className="text-brand-red">*</span></span><PhoneInput required defaultCountry="us" value={values.phone} onChange={(phone) => setValues((current) => ({ ...current, phone }))} placeholder="International phone number" dropdownClassName="!z-[70]" /></label>
              <div className="grid gap-1.5"><span className="text-sm font-medium">Country of residence <span className="text-brand-red">*</span></span><CountryPicker value={values.country} onValueChange={(country) => setValues((current) => ({ ...current, country }))} /></div>
            </div>
            {error ? <p role="alert" className="mt-4 text-sm text-brand-red">{error} {isNigerianPhoneNumber(values.phone) ? <a href="/home/get-involved" className="font-semibold underline">Go to member registration.</a> : null}</p> : null}
            <button disabled={submitting} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand-green px-5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-brand-black disabled:cursor-not-allowed disabled:opacity-70">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Registering...</> : "Join the diaspora"}
            </button>
          </form>
        </div>
      </section>
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid w-[min(100%-2rem,74rem)] gap-6 md:grid-cols-3">
          {[
            ["01", "Register", "Tell us who you are and where you are joining from."],
            ["02", "Check your email", "Your welcome email includes the private community link."],
            ["03", "Join the conversation", "Scan the QR code or use the link to connect on WhatsApp."],
          ].map(([number, title, copy]) => <article key={number} className="rounded-2xl border border-black/8 bg-[#f7f7f4] p-6"><p className="text-xs font-semibold tracking-[0.24em] text-brand-red">{number}</p><h2 className="mt-4 text-xl font-semibold">{title}</h2><p className="mt-2 text-sm leading-relaxed text-black/65">{copy}</p></article>)}
        </div>
      </section>
      <HomeFooterSection />

      {successOpen ? <div role="dialog" aria-modal="true" aria-labelledby="diaspora-success-title" className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 text-center shadow-2xl sm:p-8">
          <button onClick={() => setSuccessOpen(false)} aria-label="Close" className="absolute right-4 top-4 rounded-full p-2 text-black/60 transition hover:bg-black/5 hover:text-brand-black"><X className="h-5 w-5" /></button>
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10 text-brand-green"><CheckCircle2 className="h-7 w-7" /></span>
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.26em] text-brand-red">Registration confirmed</p>
          <h2 id="diaspora-success-title" className="mt-2 text-2xl font-semibold">Welcome{firstName ? `, ${firstName}` : ""}.</h2>
          <p className="mt-3 text-sm leading-relaxed text-black/65"><Mail className="mr-1 inline h-4 w-4 text-brand-green" /> Your WhatsApp community link is on its way to your email. You can also scan the code below to join now.</p>
          {qrCode ? <img src={qrCode} alt="QR code for the OK Movement Diaspora WhatsApp community" className="mx-auto mt-5 h-48 w-48 rounded-xl border border-black/10 p-2" /> : null}
          <a href={DIASPORA_WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-brand-green px-5 text-sm font-semibold text-white transition hover:bg-brand-black"><MessageCircle className="h-4 w-4" /> Open WhatsApp link</a>
        </div>
      </div> : null}
    </main>
  );
}
