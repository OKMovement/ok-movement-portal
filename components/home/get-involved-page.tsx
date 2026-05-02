"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Globe2,
  HandHeart,
  Heart,
  Loader2,
  Mail,
  MapPin,
  MessageCircleQuestion,
  Phone,
  Plane,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import HomeFooterSection from "./home-footer-section";
import HomeSiteHeader from "./home-site-header";
import {
  donationKinds,
  engagementOptions,
  engagementPillars,
  involveFaqs,
  involveStats,
  nextSteps,
  nigerianStates,
  type EngagementType,
} from "./get-involved-data";

function TricolorRule({ light = false, wide = false }: { light?: boolean; wide?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-0.5 overflow-hidden rounded-full ${wide ? "w-24" : "w-16"}`}
    >
      <span className={`h-full flex-1 ${light ? "bg-white" : "bg-brand-green"}`} />
      <span className={`h-full flex-1 ${light ? "bg-white/65" : "bg-brand-black"}`} />
      <span className="h-full flex-1 bg-brand-red" />
    </span>
  );
}

function pillarTone(tone: "green" | "red" | "black") {
  if (tone === "green") {
    return {
      iconWrap: "bg-brand-green text-white",
      eyebrow: "text-brand-green",
      glow: "bg-brand-green/12",
    } as const;
  }
  if (tone === "red") {
    return {
      iconWrap: "bg-brand-red text-white",
      eyebrow: "text-brand-red",
      glow: "bg-brand-red/12",
    } as const;
  }
  return {
    iconWrap: "bg-brand-black text-white",
    eyebrow: "text-brand-black",
    glow: "bg-black/8",
  } as const;
}

const inputClass =
  "min-h-12 rounded-[10px] border border-black/12 bg-white px-4 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50";

export default function GetInvolvedPage() {
  const [engagement, setEngagement] = useState<EngagementType>("volunteer-individual");
  const [isDiaspora, setIsDiaspora] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const selected = useMemo(
    () => engagementOptions.find((option) => option.key === engagement)!,
    [engagement],
  );
  const isDonate = engagement === "donate";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    // Simulated submit — in production this would POST to an API.
    window.setTimeout(() => setStatus("sent"), 900);
  };

  const handleReset = () => {
    setStatus("idle");
    setName("");
    setEngagement("volunteer-individual");
    setIsDiaspora(false);
  };

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-brand-black">
      <HomeSiteHeader />

      {/* HERO ----------------------------------------------------- */}
      <section className="relative isolate overflow-hidden bg-brand-black text-white">
        <div className="absolute inset-0 -z-10">
          <img
            src="/images/bg-5.jpeg"
            alt=""
            className="h-full w-full object-cover object-center opacity-40"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,rgb(0_0_0/0.92)_0%,rgb(0_0_0/0.7)_45%,rgb(0_0_0/0.55)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgb(0_166_81/0.32),transparent_45%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_85%,rgb(224_40_40/0.28),transparent_45%)]"
        />

        <div className="relative mx-auto w-[min(100%-1.5rem,80rem)] pb-20 pt-24 sm:pb-24 sm:pt-28 lg:pb-28 lg:pt-36">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
            <div>
              <div className="flex items-center gap-4">
                <TricolorRule light wide />
                <p className="text-[11px] font-semibold uppercase tracking-[0.46em] text-white/75">
                  Get Involved
                </p>
              </div>
              <h1 className="mt-6 text-4xl font-medium leading-[1.02] tracking-tight sm:text-5xl lg:text-[4.25rem]">
                Be the rebirth.
                <br />
                Be the OK.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                The OK Movement is committed to building stronger, more connected communities
                through advocacy, awareness and collective action. Step in as a volunteer,
                rally your organisation, host a support circle, or fuel the work with a
                contribution — every action moves the country forward.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href="#registration"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[10px] bg-brand-green px-7 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_36px_-12px_rgb(0_166_81/0.55)] transition hover:bg-white hover:text-brand-green"
                >
                  Register now
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
                <a
                  href="#donate"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[10px] border border-white/30 bg-white/5 px-7 text-sm font-semibold uppercase tracking-[0.16em] text-white backdrop-blur transition hover:bg-white hover:text-brand-black"
                >
                  Support the work
                  <Heart aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>

              <ul className="mt-8 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-white/70">
                <li className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur">
                  <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-brand-green" />
                  Privacy protected
                </li>
                <li className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur">
                  <Plane aria-hidden="true" className="h-3.5 w-3.5 text-brand-red" />
                  Diaspora friendly
                </li>
                <li className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur">
                  <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-white" />
                  Citizen funded
                </li>
              </ul>
            </div>

            <dl className="grid gap-3 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur sm:grid-cols-2 sm:p-6">
              {involveStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/60">
                    {stat.label}
                  </dt>
                  <dd className="mt-2 text-3xl font-medium text-white">{stat.value}</dd>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/50">
                    {stat.helper}
                  </p>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* FOUR PILLARS --------------------------------------------- */}
      <section className="relative bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-[min(100%-1.5rem,80rem)]">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto inline-flex items-center gap-3">
              <span className="h-0.5 w-10 rounded-full bg-brand-green" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-red">
                Four ways to engage
              </span>
              <span className="h-0.5 w-10 rounded-full bg-brand-red" />
            </div>
            <h2 className="mt-5 text-3xl font-medium leading-tight text-brand-black sm:text-4xl lg:text-[2.75rem]">
              Pick the role that fits you.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-black/65 sm:text-lg">
              Whether you have an hour, a network or a cheque book — there is a place for
              you in the movement. Forming meaningful partnerships at the grassroots is how
              we build sustainable support systems.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-2">
            {engagementPillars.map((pillar, idx) => {
              const tone = pillarTone(pillar.accent);
              const Icon = pillar.icon;
              return (
                <article
                  key={pillar.title}
                  className="group relative overflow-hidden rounded-[18px] border border-black/8 bg-white p-7 shadow-[0_22px_40px_-26px_rgb(0_0_0/0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_46px_-22px_rgb(0_0_0/0.4)] sm:p-8"
                >
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 flex h-0.75">
                    <span className="h-full flex-1 bg-brand-green" />
                    <span className="h-full flex-1 bg-brand-black" />
                    <span className="h-full flex-1 bg-brand-red" />
                  </span>
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full ${tone.glow} blur-2xl`}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${tone.iconWrap}`}
                      >
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-[0.32em] ${tone.eyebrow}`}
                      >
                        0{idx + 1}
                      </span>
                    </div>
                    <h3 className="mt-6 text-2xl font-medium leading-tight text-brand-black">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-black/70">{pillar.body}</p>
                    <ul className="mt-5 grid gap-2 text-sm text-brand-black/80">
                      {pillar.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2">
                          <CheckCircle2
                            aria-hidden="true"
                            className="mt-0.5 h-4 w-4 shrink-0 text-brand-green"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* REGISTRATION FORM ---------------------------------------- */}
      <section
        id="registration"
        className="relative scroll-mt-28 bg-[#f7f7f4] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto w-[min(100%-1rem,80rem)] px-4">
          <div className="grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-12">
            {/* Sidebar / context */}
            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <div>
                <TricolorRule />
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-brand-red">
                  Step in
                </p>
                <h2 className="mt-3 text-3xl font-medium leading-tight text-brand-black sm:text-4xl">
                  Register your role in the movement.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-black/65">
                  Tell us how you would like to get involved and where you are. A coordinator
                  from your state — or our diaspora desk — will reach out within 1–2
                  business days.
                </p>
              </div>

              <ul className="space-y-3">
                {nextSteps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <li
                      key={step.title}
                      className="flex items-start gap-4 rounded-[14px] border border-black/8 bg-white p-4"
                    >
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                        <Icon aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-green">
                          Step 0{idx + 1}
                        </p>
                        <p className="mt-1 text-sm font-medium leading-snug text-brand-black">
                          {step.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-black/60">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="rounded-[14px] border border-brand-green/20 bg-brand-green/5 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-green">
                  Privacy first
                </p>
                <p className="mt-2 text-xs leading-relaxed text-black/70">
                  Your details are used solely to coordinate your involvement and are never
                  sold or shared with third parties.
                </p>
              </div>
            </aside>

            {/* Form panel */}
            <div className="relative overflow-hidden rounded-[18px] border border-black/8 bg-white shadow-[0_24px_48px_-26px_rgb(0_0_0/0.3)]">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 flex h-0.75">
                <span className="h-full flex-1 bg-brand-green" />
                <span className="h-full flex-1 bg-brand-black" />
                <span className="h-full flex-1 bg-brand-red" />
              </span>

              {status === "sent" ? (
                <div className="flex flex-col items-center px-6 py-16 text-center sm:px-12">
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                    <CheckCircle2 aria-hidden="true" className="h-8 w-8" />
                  </span>
                  <h3 className="mt-6 text-2xl font-medium leading-tight text-brand-black sm:text-3xl">
                    Welcome aboard{name ? `, ${name.split(" ")[0]}` : ""} — you&apos;re in.
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-black/65">
                    A confirmation email is on its way. The right coordinator from the OK
                    Movement will reach out within 1–2 business days with your next steps.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] bg-brand-black px-6 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-brand-green"
                    >
                      Register another
                    </button>
                    <a
                      href="#donate"
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] border border-brand-green/30 bg-brand-green/5 px-6 text-sm font-semibold uppercase tracking-[0.16em] text-brand-green transition hover:bg-brand-green hover:text-white"
                    >
                      View ways to give
                      <Heart aria-hidden="true" className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="px-6 py-10 sm:px-10 sm:py-12">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-brand-red">
                      Registration
                    </p>
                    <h2 className="mt-3 text-2xl font-medium leading-tight text-brand-black sm:text-3xl">
                      How would you like to get involved?
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/65">
                      Pick the role that fits, share a few details, and we&apos;ll take it from
                      there. Required fields are marked with an asterisk.
                    </p>
                  </div>

                  {/* Engagement type */}
                  <fieldset className="mt-8">
                    <legend className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/65">
                      I want to <span className="text-brand-red">*</span>
                    </legend>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {engagementOptions.map(({ key, label, icon: Icon }) => {
                        const isActive = key === engagement;
                        return (
                          <label
                            key={key}
                            className={`group flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                              isActive
                                ? "border-brand-green bg-brand-green/5 text-brand-black shadow-[0_10px_20px_-12px_rgb(0_166_81/0.5)]"
                                : "border-black/10 bg-white text-black/70 hover:border-brand-green/40 hover:bg-brand-green/5 hover:text-brand-black"
                            }`}
                          >
                            <input
                              type="radio"
                              name="engagement"
                              value={key}
                              checked={isActive}
                              onChange={() => setEngagement(key)}
                              className="sr-only"
                            />
                            <span
                              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                                isActive
                                  ? "bg-brand-green text-white"
                                  : "bg-black/4 text-brand-black group-hover:bg-brand-green/10 group-hover:text-brand-green"
                              }`}
                            >
                              <Icon aria-hidden="true" className="h-4 w-4" />
                            </span>
                            <span>{label}</span>
                          </label>
                        );
                      })}
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-black/60">
                      <span className="font-semibold uppercase tracking-[0.18em] text-brand-green">
                        {selected.label}:
                      </span>{" "}
                      {selected.description}
                    </p>
                  </fieldset>

                  {/* Contact details */}
                  <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
                        Full name <span className="text-brand-red">*</span>
                      </span>
                      <input
                        type="text"
                        name="name"
                        required
                        autoComplete="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Adaeze Okeke"
                        className={inputClass}
                      />
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
                        Email <span className="text-brand-red">*</span>
                      </span>
                      <input
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        placeholder="you@example.com"
                        className={inputClass}
                      />
                    </label>

                    <label className="flex flex-col gap-1.5 sm:col-span-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
                        Telephone / WhatsApp number{" "}
                        <span className="text-brand-red">*</span>
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        required
                        autoComplete="tel"
                        placeholder="+234 …"
                        className={inputClass}
                      />
                    </label>
                  </div>

                  {/* Diaspora toggle */}
                  <div className="mt-6 flex items-start gap-3 rounded-xl border border-black/10 bg-[#f7f7f4] p-4">
                    <input
                      id="diaspora-toggle"
                      type="checkbox"
                      checked={isDiaspora}
                      onChange={(event) => setIsDiaspora(event.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-black/20 text-brand-green focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-green/50"
                    />
                    <label htmlFor="diaspora-toggle" className="cursor-pointer text-sm">
                      <span className="flex items-center gap-2 font-medium text-brand-black">
                        <Plane aria-hidden="true" className="h-4 w-4 text-brand-red" />
                        I&apos;m in the diaspora
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-black/60">
                        Tick this if you live outside Nigeria. We&apos;ll swap the voting
                        location fields for your country of residence.
                      </span>
                    </label>
                  </div>

                  {/* Conditional location fields */}
                  {isDiaspora ? (
                    <div className="mt-6 grid gap-5">
                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
                          Country of residence <span className="text-brand-red">*</span>
                        </span>
                        <span className="relative">
                          <Globe2
                            aria-hidden="true"
                            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-green"
                          />
                          <input
                            type="text"
                            name="country"
                            required
                            autoComplete="country-name"
                            placeholder="e.g. United Kingdom, United States, Canada"
                            className={`${inputClass} w-full pl-11`}
                          />
                        </span>
                      </label>
                    </div>
                  ) : (
                    <div className="mt-6 grid gap-5 sm:grid-cols-3">
                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
                          Voting state <span className="text-brand-red">*</span>
                        </span>
                        <select
                          name="votingState"
                          required
                          defaultValue=""
                          className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2020%2020%22%20fill=%22%2300a651%22><path%20d=%22M5.5%208l4.5%204.5L14.5%208z%22/></svg>')] bg-size-[1.25rem_1.25rem] bg-position-[right_0.75rem_center] bg-no-repeat pr-10`}
                        >
                          <option value="" disabled>
                            Select a state
                          </option>
                          {nigerianStates.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
                          Voting LGA <span className="text-brand-red">*</span>
                        </span>
                        <input
                          type="text"
                          name="votingLga"
                          required
                          placeholder="e.g. Ikeja, Municipal"
                          className={inputClass}
                        />
                      </label>

                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
                          Voting ward <span className="text-brand-red">*</span>
                        </span>
                        <input
                          type="text"
                          name="votingWard"
                          required
                          placeholder="Your registered ward"
                          className={inputClass}
                        />
                      </label>
                    </div>
                  )}

                  {/* Disclaimers + submit */}
                  <div className="mt-8 flex flex-col gap-4 border-t border-black/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex items-center gap-2 text-xs text-black/55">
                      <ShieldCheck aria-hidden="true" className="h-4 w-4 text-brand-green" />
                      Your information is private and never shared.
                    </p>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-brand-black px-7 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_36px_-14px_rgb(0_0_0/0.55)] transition hover:bg-brand-green disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          {isDonate ? "Pledge & Register" : "Join the Movement"}
                          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {isDonate && (
                    <p className="mt-4 rounded-[10px] border border-brand-red/20 bg-brand-red/5 px-4 py-3 text-xs leading-relaxed text-brand-black/75">
                      <span className="font-semibold uppercase tracking-[0.18em] text-brand-red">
                        Donating?
                      </span>{" "}
                      After registering we&apos;ll share verified channels for cash transfers,
                      campaign materials and in-kind support. See the{" "}
                      <a href="#donate" className="font-semibold text-brand-red underline">
                        Support &amp; Donations
                      </a>{" "}
                      section below for a preview.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DONATIONS ------------------------------------------------ */}
      <section
        id="donate"
        className="relative scroll-mt-28 bg-white py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto w-[min(100%-1.5rem,80rem)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <TricolorRule />
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-brand-red">
                Support & Donations
              </p>
              <h2 className="mt-3 text-3xl font-medium leading-tight text-brand-black sm:text-4xl lg:text-[2.75rem]">
                Three ways to power the movement.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-black/65 sm:text-lg">
                Every contribution — financial, material or in-kind — helps us reach
                more communities, organise impactful programmes and provide essential
                resources.
              </p>
            </div>
            <a
              href="#registration"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] bg-brand-green px-6 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_14px_28px_-14px_rgb(0_166_81/0.55)] transition hover:bg-brand-black"
            >
              <Heart aria-hidden="true" className="h-4 w-4" />
              Pledge a contribution
            </a>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {donationKinds.map((kind, idx) => {
              const tone = pillarTone(kind.tone);
              const Icon = kind.icon;
              return (
                <article
                  key={kind.title}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-black/8 bg-white p-7 shadow-[0_22px_40px_-26px_rgb(0_0_0/0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_46px_-22px_rgb(0_0_0/0.4)] sm:p-8"
                >
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 flex h-0.75">
                    <span className="h-full flex-1 bg-brand-green" />
                    <span className="h-full flex-1 bg-brand-black" />
                    <span className="h-full flex-1 bg-brand-red" />
                  </span>
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full ${tone.glow} blur-2xl`}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${tone.iconWrap}`}
                      >
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-[0.32em] ${tone.eyebrow}`}
                      >
                        0{idx + 1}
                      </span>
                    </div>
                    <h3 className="mt-6 text-xl font-medium leading-tight text-brand-black sm:text-2xl">
                      {kind.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-black/70">{kind.short}</p>
                    <ul className="mt-5 space-y-2 text-sm text-brand-black/80">
                      {kind.examples.map((example) => (
                        <li key={example} className="flex items-start gap-2">
                          <CheckCircle2
                            aria-hidden="true"
                            className="mt-0.5 h-4 w-4 shrink-0 text-brand-green"
                          />
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 grid gap-3 rounded-2xl border border-black/8 bg-[#f7f7f4] p-5 sm:grid-cols-3 sm:p-6">
            <a
              href="/home/contact"
              className="group flex items-center gap-3 rounded-xl bg-white p-4 transition hover:bg-brand-green hover:text-white"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-green/10 text-brand-green group-hover:bg-white/20 group-hover:text-white">
                <Mail aria-hidden="true" className="h-4 w-4" />
              </span>
              <span className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-current/70">
                  Email
                </span>
                <span className="text-sm font-medium">admin@okmovement.org</span>
              </span>
            </a>
            <a
              href="tel:+2349099999361"
              className="group flex items-center gap-3 rounded-xl bg-white p-4 transition hover:bg-brand-red hover:text-white"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-red/10 text-brand-red group-hover:bg-white/20 group-hover:text-white">
                <Phone aria-hidden="true" className="h-4 w-4" />
              </span>
              <span className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-current/70">
                  Phone
                </span>
                <span className="text-sm font-medium">+234 909 999 9361"</span>
              </span>
            </a>
            <a
              href="/home/our-movement#zonal-structure"
              className="group flex items-center gap-3 rounded-xl bg-white p-4 transition hover:bg-brand-black hover:text-white"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-brand-black group-hover:bg-white/20 group-hover:text-white">
                <MapPin aria-hidden="true" className="h-4 w-4" />
              </span>
              <span className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-current/70">
                  Local team
                </span>
                <span className="text-sm font-medium">Find your state coordinator</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ ----------------------------------------------------- */}
      <section className="bg-[#f7f7f4] px-4 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-[min(100%-1rem,72rem)]">
          <div className="grid gap-10 lg:grid-cols-[20rem_1fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <TricolorRule />
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-brand-red">
                Good to know
              </p>
              <h2 className="mt-3 text-3xl font-medium leading-tight text-brand-black sm:text-4xl">
                Quick answers about getting involved.
              </h2>
              <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
                <MessageCircleQuestion aria-hidden="true" className="h-4 w-4" />
                {involveFaqs.length} common questions
              </div>
            </div>

            <ul className="space-y-3">
              {involveFaqs.map((faq, index) => (
                <li key={faq.q}>
                  <details className="group rounded-[14px] border border-black/8 bg-white p-5 shadow-[0_14px_28px_-22px_rgb(0_0_0/0.35)] transition open:shadow-[0_18px_32px_-22px_rgb(0_0_0/0.45)]">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left text-base font-medium text-brand-black [&::-webkit-details-marker]:hidden">
                      <span className="flex items-baseline gap-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {faq.q}
                      </span>
                      <span
                        aria-hidden="true"
                        className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/10 text-brand-black transition group-open:rotate-45 group-open:bg-brand-green group-open:border-brand-green group-open:text-white"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-4 text-sm leading-relaxed text-black/65">{faq.a}</p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CLOSING CTA --------------------------------------------- */}
      <section className="relative isolate overflow-hidden bg-brand-green px-4 py-20 text-center text-white sm:py-24 lg:py-28">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 flex h-0.75">
          <span className="h-full flex-1 bg-white/40" />
          <span className="h-full flex-1 bg-brand-black/60" />
          <span className="h-full flex-1 bg-brand-red" />
        </span>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-brand-red/30 blur-3xl"
        />

        <div className="relative mx-auto w-[min(100%-1rem,52rem)]">
          <div className="flex items-center justify-center gap-4">
            <TricolorRule light />
            <p className="text-[11px] font-semibold uppercase tracking-[0.46em] text-white/85">
              Call to action
            </p>
            <TricolorRule light />
          </div>
          <h2 className="mx-auto mt-5 text-3xl font-medium leading-tight sm:text-4xl lg:text-5xl">
            Together, we can amplify our impact <br className="hidden sm:inline" />
            and create lasting change.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            We invite individuals, organisations and community leaders to partner with the OK
            Movement.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#registration"
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[10px] bg-brand-red px-8 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_36px_-12px_rgb(224_40_40/0.55)] transition hover:bg-brand-black sm:w-auto"
            >
              <HandHeart aria-hidden="true" className="h-4 w-4" />
              Register now
            </a>
            <a
              href="/home/contact"
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[10px] border border-white/40 bg-white/10 px-8 text-sm font-semibold uppercase tracking-[0.16em] text-white backdrop-blur transition hover:bg-white hover:text-brand-green sm:w-auto"
            >
              Talk to the team
            </a>
          </div>
        </div>
      </section>

      <HomeFooterSection />
    </main>
  );
}