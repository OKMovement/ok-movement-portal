"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Globe2,
  Loader2,
  Mail,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { RoleCategory, VOLUNTEER_ROLES, VOLUNTEER_STATS, ROLE_CATEGORIES, VOLUNTEER_BENEFITS, HOW_IT_WORKS, DIASPORA_COUNTRIES, NIGERIAN_STATES, EXPERIENCE_LEVELS, AVAILABILITY_OPTIONS, VOLUNTEER_FAQS } from "../../../lib/tech-volunteers-data";
import HomeSiteHeader from "@/components/home/home-site-header";
import HomeFooterSection from "@/components/home/home-footer-section";


type FormStatus = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full min-h-11 rounded-xl border border-black/10 bg-white px-3.5 text-[14px] text-brand-black placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green sm:min-h-12 sm:px-4";

const labelClass = "text-[12px] font-semibold tracking-wide text-brand-black/75";
const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function isValidPhoneInput(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const hasValidChars = /^\+?[0-9\s().-]+$/.test(phone);
  return hasValidChars && digits.length >= 10 && digits.length <= 15;
}

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  state: "",
  isDiaspora: false,
  country: "",
  primaryRole: "",
  experience: "",
  availability: "",
  portfolioUrl: "",
  linkedinUrl: "",
  motivation: "",
  consent: false,
};

export default function TechVolunteersPage() {
  const [activeCat, setActiveCat] = useState<RoleCategory | "all">("all");
  const [form, setForm] = useState(initialForm);
  const [secondarySkills, setSecondarySkills] = useState<string[]>([]);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const visibleRoles = useMemo(
    () =>
      activeCat === "all"
        ? VOLUNTEER_ROLES
        : VOLUNTEER_ROLES.filter((r) => r.category === activeCat),
    [activeCat],
  );

  function update<K extends keyof typeof initialForm>(key: K, value: (typeof initialForm)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleSecondary(roleId: string) {
    setSecondarySkills((prev) =>
      prev.includes(roleId) ? prev.filter((r) => r !== roleId) : [...prev, roleId],
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const normalizedEmail = form.email.trim().toLowerCase();
    const normalizedPhone = form.phone.trim();
    if (!basicEmailRegex.test(normalizedEmail)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!isValidPhoneInput(normalizedPhone)) {
      setStatus("error");
      setErrorMsg("Please enter a valid phone number (include country code, e.g. +234...).");
      return;
    }

    setErrorMsg(null);
    setStatus("submitting");

    try {
      const res = await fetch("/api/tech-volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          email: normalizedEmail,
          phone: normalizedPhone,
          secondarySkills,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not submit your application. Please try again.");
      }
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  function handleReset() {
    setForm(initialForm);
    setSecondarySkills([]);
    setStatus("idle");
    setErrorMsg(null);
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="min-h-screen bg-[#fafaf7] text-brand-black">
      <HomeSiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-black/5 bg-gradient-to-br from-brand-black via-[#0a1f12] to-brand-green text-white">
        <span aria-hidden className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-brand-green/40 blur-3xl" />
        <span aria-hidden className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-brand-red/25 blur-3xl" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:gap-14 lg:px-10 lg:py-28">
          <div className="flex max-w-2xl flex-col gap-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] ring-1 ring-white/20 backdrop-blur sm:text-[11px]">
              <Code2 className="h-3 w-3" /> Tech Volunteers Programme
            </span>
            <h1 className="text-balance text-[34px] font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Build the rebirth.<br />
              <span className="bg-gradient-to-r from-brand-green via-emerald-300 to-brand-red bg-clip-text text-transparent">
                Code, design & shape Nigeria&apos;s future.
              </span>
            </h1>
            <p className="max-w-xl text-[15px] leading-relaxed text-white/80 sm:text-[17px]">
              The OK Movement is calling on Nigeria&apos;s brightest engineers, designers,
              storytellers and creators — at home and in the diaspora — to volunteer
              their craft for the most consequential election of our generation.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <a
                href="#apply"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-black shadow-[0_14px_30px_-12px_rgb(0_0_0/0.45)] transition hover:bg-brand-green hover:text-white"
              >
                Apply to volunteer
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </a>
              <a
                href="#roles"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur transition hover:bg-white/10"
              >
                Explore the roles
              </a>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <Globe2 className="h-3 w-3" /> Remote-friendly
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3 w-3" /> 1,200+ active volunteers
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3" /> Vetted & credited
              </span>
            </div>
          </div>
        </div>

        <span aria-hidden className="absolute inset-x-0 bottom-0 flex h-1 w-full">
          <span className="h-full flex-1 bg-brand-green" />
          <span className="h-full flex-1 bg-white/40" />
          <span className="h-full flex-1 bg-brand-red" />
        </span>
      </section>

      {/* STATS */}
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-px bg-black/5 sm:grid-cols-4">
          {VOLUNTEER_STATS.map((s) => (
            <div key={s.label} className="bg-white px-4 py-5 text-center sm:px-6 sm:py-8">
              <div className="text-2xl font-bold tracking-tight text-brand-green sm:text-3xl">
                {s.value}
              </div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-black/55 sm:text-[11px]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {status === "success" ? (
        <SuccessPanel email={form.email} fullName={form.fullName} onReset={handleReset} />
      ) : null}

      {/* ROLES */}
      <section id="roles" className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2">
            <span aria-hidden className="h-[2px] w-6 rounded-full bg-brand-green" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-black/60">
              Open Roles
            </span>
          </div>
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-4xl">
            We need every craft, every level.
          </h2>
          <p className="max-w-2xl text-[14px] text-brand-black/65 sm:text-base">
            From senior architects to first-year designers — if you have a skill and a
            sense of duty, there&apos;s a seat at this table.
          </p>
        </div>

        <div className="mt-8 -mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
          <div className="flex min-w-max items-center gap-2">
            <CategoryChip active={activeCat === "all"} onClick={() => setActiveCat("all")} label="All roles" />
            {ROLE_CATEGORIES.map((c) => (
              <CategoryChip
                key={c.id}
                active={activeCat === c.id}
                onClick={() => setActiveCat(c.id)}
                label={c.label}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleRoles.map((role) => {
            const Icon = role.icon;
            return (
              <article
                key={role.id}
                className="group flex flex-col gap-4 rounded-2xl bg-white p-5 ring-1 ring-black/[0.05] transition hover:ring-brand-green/30 hover:shadow-[0_24px_50px_-24px_rgb(0_0_0/0.18)] sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                    <Icon className="h-5 w-5" />
                  </span>
                  {/* <span className="rounded-full bg-black/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-black/60">
                    {role.commitment}
                  </span> */}
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold tracking-tight text-brand-black sm:text-[17px]">
                    {role.title}
                  </h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-brand-black/65">
                    {role.short}
                  </p>
                </div>
                <ul className="space-y-1.5">
                  {role.responsibilities.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-[12.5px] text-brand-black/70">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                  {role.tools.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-black/[0.04] px-2 py-1 text-[10px] font-medium text-brand-black/65"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    update("primaryRole", role.id);
                    document
                      .getElementById("apply")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="inline-flex items-center gap-2 self-start text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-green transition hover:text-brand-black"
                >
                  Apply for this role
                  <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* WHY VOLUNTEER */}
      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2">
                <span aria-hidden className="h-[2px] w-6 rounded-full bg-brand-red" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-black/60">
                  Why volunteer
                </span>
              </div>
              <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-4xl">
                More than a side project. A national contribution.
              </h2>
              <p className="text-[14px] text-brand-black/65 sm:text-[15px]">
                You&apos;ll work alongside seasoned operators, ship work that touches millions,
                and earn a verified place in the story of Nigeria&apos;s reset.
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {VOLUNTEER_BENEFITS.map((b) => (
                <li
                  key={b.title}
                  className="flex flex-col gap-2 rounded-2xl border border-black/[0.06] p-5"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <h3 className="text-[15px] font-semibold tracking-tight text-brand-black">
                    {b.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-brand-black/65">{b.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#fafaf7]">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-black/55">
              <span aria-hidden className="h-[2px] w-5 rounded-full bg-brand-green" />
              How it works
              <span aria-hidden className="h-[2px] w-5 rounded-full bg-brand-red" />
            </span>
            <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight sm:text-4xl">
              From application to first ship — in days, not weeks.
            </h2>
          </div>

          <div className="relative mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((s) => (
              <div
                key={s.step}
                className="relative flex flex-col gap-3 rounded-2xl bg-white p-6 ring-1 ring-black/[0.05]"
              >
                <span className="text-[40px] font-bold leading-none text-brand-green/15 sm:text-[52px]">
                  {s.step}
                </span>
                <h3 className="text-[16px] font-semibold tracking-tight text-brand-black">
                  {s.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-brand-black/65">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section
        id="apply"
        className="relative overflow-hidden border-t border-black/5 bg-gradient-to-br from-[#0a1f12] via-brand-black to-[#1a0a0a] text-white"
      >
        <span aria-hidden className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-brand-green/25 blur-3xl" />
        <span aria-hidden className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-brand-red/20 blur-3xl" />

        <div className="relative mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] ring-1 ring-white/20 backdrop-blur">
              <Send className="h-3 w-3" /> Application
            </span>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              Apply to join the Tech Volunteers
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-white/75 sm:text-[16px]">
              Tell us about yourself. Our coordinators review every application and
              respond within 5 working days.
            </p>
          </div>

          {status === "success" ? (
            <div className="mt-10 rounded-3xl bg-white/[0.06] p-10 text-center ring-1 ring-white/15 backdrop-blur">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-white">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                Welcome to the Movement.
              </h3>
              <p className="mt-2 text-[14px] text-white/75">
                Check <span className="font-semibold text-white">{form.email || "your inbox"}</span>{" "}
                for your confirmation email. Shortlisted applicants will be contacted for onboarding.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-black transition hover:bg-brand-green hover:text-white"
              >
                Submit another application
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-10 rounded-3xl bg-white/[0.04] p-5 ring-1 ring-white/10 backdrop-blur sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name *">
                  <input required type="text" value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    placeholder="e.g. Adaeze Okoro" className={inputClass} />
                </Field>
                <Field label="Email *">
                  <input required type="email" value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@email.com" className={inputClass} />
                </Field>
                <Field label="Phone *">
                  <input required type="tel" value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+234 …" className={inputClass} />
                  <span className="mt-1 inline-flex w-fit items-center rounded-md bg-brand-black px-2 py-1 text-[11px] font-semibold text-white">
                    WhatsApp number only
                  </span>
                </Field>
                <div className="flex flex-col gap-2">
                  <label className="flex flex-col gap-2">
                    <span className={labelClass}>
                      {form.isDiaspora ? "Country of residence *" : "Where are you based? *"}
                    </span>
                    {form.isDiaspora ? (
                      <select required value={form.country}
                        onChange={(e) => update("country", e.target.value)}
                        className={inputClass}>
                        <option value="">Select your country of residence</option>
                        {DIASPORA_COUNTRIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    ) : (
                      <select required value={form.state}
                        onChange={(e) => update("state", e.target.value)}
                        className={inputClass}>
                        <option value="">Select your state / location</option>
                        {NIGERIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    )}
                  </label>
                  <label className="mt-1 flex cursor-pointer items-start gap-2.5 rounded-lg border border-white/10 bg-brand-black p-2.5 text-[12px] leading-snug text-white transition hover:border-brand-green/60 hover:bg-[#0a1f12]">
                    <input type="checkbox" checked={form.isDiaspora}
                      onChange={(e) => update("isDiaspora", e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/40 text-brand-green focus:ring-brand-green/40" />
                    <span className="font-semibold text-white">
                      Please tick the box if you are in the Diaspora
                    </span>
                  </label>
                </div>
                <Field label="Primary skill area *">
                  <select required value={form.primaryRole}
                    onChange={(e) => update("primaryRole", e.target.value)}
                    className={inputClass}>
                    <option value="">Choose your strongest craft</option>
                    {ROLE_CATEGORIES.map((cat) => (
                      <optgroup key={cat.id} label={cat.label}>
                        {VOLUNTEER_ROLES.filter((r) => r.category === cat.id).map((r) => (
                          <option key={r.id} value={r.id}>{r.title}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </Field>
                <Field label="Years of experience *">
                  <select required value={form.experience}
                    onChange={(e) => update("experience", e.target.value)}
                    className={inputClass}>
                    <option value="">Select level</option>
                    {EXPERIENCE_LEVELS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </Field>
                {/* <Field label="Weekly availability">
                  <select value={form.availability}
                    onChange={(e) => update("availability", e.target.value)}
                    className={inputClass}>
                    <option value="">How much time can you give?</option>
                    {AVAILABILITY_OPTIONS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </Field> */}
                <Field label="Portfolio / website (optional)">
                  <input type="url" value={form.portfolioUrl}
                    onChange={(e) => update("portfolioUrl", e.target.value)}
                    placeholder="https://…" className={inputClass} />
                </Field>
                <Field label="LinkedIn / GitHub (optional)" className="sm:col-span-2">
                  <input type="url" value={form.linkedinUrl}
                    onChange={(e) => update("linkedinUrl", e.target.value)}
                    placeholder="https://linkedin.com/in/… or https://github.com/…"
                    className={inputClass} />
                </Field>
              </div>

              <div className="mt-6">
                <label className={labelClass}>
                  Other skills you can contribute (optional)
                </label>
                <p className="mt-1 text-[12px] text-white/55">
                  Tap any that apply — we love multi-talented volunteers.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {VOLUNTEER_ROLES.map((r) => {
                    const active = secondarySkills.includes(r.id);
                    return (
                      <button type="button" key={r.id}
                        onClick={() => toggleSecondary(r.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${active
                            ? "border-brand-green bg-brand-green text-white"
                            : "border-white/20 bg-white/[0.04] text-white/70 hover:bg-white/[0.1]"
                          }`}>
                        {active ? <CheckCircle2 className="h-3 w-3" /> : null}
                        {r.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <Field label="Why do you want to volunteer? (optional)">
                  <textarea value={form.motivation}
                    onChange={(e) => update("motivation", e.target.value)}
                    rows={4}
                    placeholder="Tell us in a few sentences what draws you to the OK Movement…"
                    className={`${inputClass} resize-y py-3`} />
                </Field>
              </div>

              <label className="mt-6 flex cursor-pointer items-start gap-3 text-[12.5px] text-white/75">
                <input type="checkbox" required checked={form.consent}
                  onChange={(e) => update("consent", e.target.checked)}
                  className="mt-0.5 h-4 w-4 cursor-pointer accent-brand-green" />
                <span>
                  I consent to the OK Movement using my details to coordinate my
                  volunteering. I understand my data will not be shared with third
                  parties and I can request deletion at any time.
                </span>
              </label>

              {errorMsg ? (
                <div className="mt-5 rounded-xl border border-brand-red/40 bg-brand-red/10 px-4 py-3 text-[13px] text-white/90">
                  {errorMsg}
                </div>
              ) : null}

              <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">
                  We respond within 5 working days · 100% confidential
                </p>
                <button type="submit" disabled={status === "submitting"}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-green px-7 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_40px_-14px_rgb(0_166_81/0.7)] transition hover:bg-white hover:text-brand-black disabled:cursor-not-allowed disabled:opacity-60">
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      Submit application
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-black/5 bg-white">
        <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-black/55">
              <span aria-hidden className="h-[2px] w-5 rounded-full bg-brand-green" />
              Questions, answered
            </span>
            <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight sm:text-4xl">
              Frequently asked
            </h2>
          </div>
          <div className="mt-8 space-y-3">
            {VOLUNTEER_FAQS.map((faq) => (
              <details key={faq.q}
                className="group rounded-2xl bg-[#fafaf7] p-5 ring-1 ring-black/[0.04] open:ring-brand-green/20">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-semibold tracking-tight text-brand-black [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-brand-black/60 transition group-open:rotate-45 group-open:bg-brand-green group-open:text-white">
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                </summary>
                <p className="mt-3 text-[13px] leading-relaxed text-brand-black/65">{faq.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-dashed border-black/15 p-6 text-center">
            <Mail className="mx-auto h-5 w-5 text-brand-green" />
            <p className="mt-2 text-[13px] text-brand-black/70">
              Still have questions? Email us at{" "}
              <a href="mailto:volunteers@okmovement.org"
                className="font-semibold text-brand-green hover:text-brand-black">
                volunteers@okmovement.org
              </a>
            </p>
          </div>
        </div>
      </section>

      <HomeFooterSection />
    </main>
  );
}

function CategoryChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-semibold tracking-wide transition ${active
          ? "bg-brand-black text-white shadow-[0_8px_20px_-10px_rgb(0_0_0/0.4)]"
          : "bg-white text-brand-black/70 ring-1 ring-black/[0.08] hover:bg-black/[0.03] hover:text-brand-black"
        }`}>
      {label}
    </button>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function SuccessPanel({ email, fullName, onReset }: { email: string; fullName: string; onReset: () => void }) {
  return (
    <section className="border-b border-brand-green/30 bg-gradient-to-r from-brand-green/[0.08] via-white to-brand-green/[0.08]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-green text-white">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <p className="text-[13px] text-brand-black sm:text-[14px]">
            <span className="font-semibold">Welcome, {fullName.split(" ")[0] || "friend"}.</span>{" "}
            Your registration was successful. We&apos;ve sent a confirmation email to{" "}
            <span className="font-semibold">{email}</span>, and shortlisted applicants will be contacted
            for onboarding.
          </p>
        </div>
        <button type="button" onClick={onReset}
          className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-green hover:text-brand-black">
          Submit another →
        </button>
      </div>
    </section>
  );
}
