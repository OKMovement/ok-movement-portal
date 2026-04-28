"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Award,
  Compass,
  Crown,
  Flag,
  HandHeart,
  Heart,
  MapPin,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import HomeFooterSection from "./home-footer-section";
import HomeSiteHeader from "./home-site-header";
import {
  aboutMovement,
  executiveCouncil,
  fiveCs,
  formatPhone,
  mandateVisionValues,
  movementStats,
  nationInNeed,
  ourMovementHero,
  roadAhead,
  sacredMandate,
  unityOverDivision,
  zones,
} from "./our-movement-data";

function TricolorRule({ light = false, wide = false }: { light?: boolean; wide?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-[2px] overflow-hidden rounded-full ${wide ? "w-24" : "w-16"}`}
    >
      <span className={`h-full flex-1 ${light ? "bg-white" : "bg-brand-green"}`} />
      <span className={`h-full flex-1 ${light ? "bg-white/65" : "bg-brand-black"}`} />
      <span className="h-full flex-1 bg-brand-red" />
    </span>
  );
}

const pillarIcons = {
  mandate: Target,
  vision: Compass,
  values: Heart,
} as const;

export default function OurMovementPage() {
  const [activeZoneId, setActiveZoneId] = useState(zones[0].id);
  const activeZone = useMemo(
    () => zones.find((zone) => zone.id === activeZoneId)!,
    [activeZoneId],
  );

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-brand-black">
      <HomeSiteHeader />

      {/* HERO ----------------------------------------------------- */}
      <section className="relative isolate overflow-hidden bg-brand-black text-white">
        <div className="absolute inset-0 -z-10">
          <img
            src="/images/bg-3.jpeg"
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
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_18%,rgb(0_166_81/0.32),transparent_45%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_85%,rgb(224_40_40/0.25),transparent_42%)]"
        />

        <div className="relative mx-auto w-[min(100%-1.5rem,80rem)] pb-20 pt-24 sm:pb-24 sm:pt-28 lg:pb-28 lg:pt-36">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4">
              <TricolorRule light wide />
              <p className="text-[11px] font-semibold uppercase tracking-[0.46em] text-white/75">
                Our Movement
              </p>
            </div>

            <ul className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium uppercase tracking-[0.16em] text-white/70 sm:text-[13px]">
              {ourMovementHero.eyebrowParts.map((part, idx) => (
                <li key={part} className="inline-flex items-center gap-3">
                  <span>{part}</span>
                  {idx < ourMovementHero.eyebrowParts.length - 1 && (
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-brand-red/80" />
                  )}
                </li>
              ))}
            </ul>

            <h1 className="mt-6 text-4xl font-medium leading-[1.02] tracking-tight sm:text-5xl lg:text-[4.5rem]">
              {ourMovementHero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              {ourMovementHero.lead}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="/home#get-involved-movement"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[10px] bg-brand-green px-7 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_36px_-12px_rgb(0_166_81/0.55)] transition hover:bg-white hover:text-brand-green"
              >
                Join the Movement
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
              <a
                href="#zonal-structure"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[10px] border border-white/30 bg-white/5 px-7 text-sm font-semibold uppercase tracking-[0.16em] text-white backdrop-blur transition hover:bg-white hover:text-brand-black"
              >
                Meet the Coordinators
              </a>
            </div>
          </div>

          {/* Stats strip */}
          <dl className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {movementStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[14px] border border-white/15 bg-white/5 p-5 backdrop-blur sm:p-6"
              >
                <dt className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/65">
                  {stat.label}
                </dt>
                <dd className="mt-3 text-3xl font-medium tracking-tight text-white sm:text-4xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* OPENING DECLARATION -------------------------------------- */}
      <section className="relative bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-[min(100%-1.5rem,72rem)]">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <TricolorRule />
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-brand-red">
                {aboutMovement.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-medium leading-tight text-brand-black sm:text-4xl lg:text-[2.75rem]">
                {aboutMovement.heading}
              </h2>
              <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-black/10 bg-[#f7f7f4] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-brand-black/70">
                <Sparkles aria-hidden="true" className="h-4 w-4 text-brand-green" />
                Together, we will make Nigeria OK
              </div>
            </div>

            <div className="space-y-5 text-base leading-relaxed text-black/75 sm:text-lg">
              {aboutMovement.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              <div className="mt-8 rounded-[16px] border border-brand-green/15 bg-brand-green/5 p-6 sm:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-green">
                  {nationInNeed.eyebrow}
                </p>
                <h3 className="mt-2 text-xl font-medium leading-tight text-brand-black sm:text-2xl">
                  {nationInNeed.heading}
                </h3>
                <div className="mt-3 space-y-3 text-base leading-relaxed text-black/70">
                  {nationInNeed.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MANDATE / VISION / VALUES -------------------------------- */}
      <section className="relative bg-[#f7f7f4] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-[min(100%-1.5rem,80rem)]">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto inline-flex items-center gap-3">
              <span className="h-[2px] w-10 rounded-full bg-brand-green" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-red">
                What we stand for
              </span>
              <span className="h-[2px] w-10 rounded-full bg-brand-red" />
            </div>
            <h2 className="mt-5 text-3xl font-medium leading-tight text-brand-black sm:text-4xl lg:text-[2.75rem]">
              Mandate. Vision. Values.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-black/65 sm:text-lg">
              Three commitments that anchor every decision the movement makes — from the
              streets to the statehouse.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-3">
            {(["mandate", "vision", "values"] as const).map((key, idx) => {
              const item = mandateVisionValues[key];
              const Icon = pillarIcons[key];
              const accent =
                idx === 0
                  ? "from-brand-green/12 to-transparent"
                  : idx === 1
                    ? "from-brand-black/8 to-transparent"
                    : "from-brand-red/12 to-transparent";
              const iconTone =
                idx === 0
                  ? "bg-brand-green text-white"
                  : idx === 1
                    ? "bg-brand-black text-white"
                    : "bg-brand-red text-white";
              return (
                <article
                  key={key}
                  className="group relative overflow-hidden rounded-[18px] border border-black/8 bg-white p-7 shadow-[0_22px_40px_-26px_rgb(0_0_0/0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_46px_-24px_rgb(0_0_0/0.4)] sm:p-8"
                >
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 flex h-[3px]">
                    <span className="h-full flex-1 bg-brand-green" />
                    <span className="h-full flex-1 bg-brand-black" />
                    <span className="h-full flex-1 bg-brand-red" />
                  </span>
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${accent} blur-2xl`}
                  />
                  <div className="relative">
                    <span
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${iconTone}`}
                    >
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-green">
                      {String(idx + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 text-2xl font-medium leading-tight text-brand-black">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-black/70">{item.body}</p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Five C's of OK Leadership */}
          <div className="mt-16 overflow-hidden rounded-[20px] bg-brand-black p-8 text-white shadow-[0_30px_60px_-30px_rgb(0_0_0/0.45)] sm:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-end lg:gap-16">
              <div>
                <TricolorRule light />
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-white/65">
                  How we choose leaders
                </p>
                <h3 className="mt-3 text-3xl font-medium leading-tight sm:text-4xl">
                  The 5 C&apos;s of OK Leadership.
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
                  A simple, uncompromising standard for every leader the movement supports —
                  from local coordinators to national executives.
                </p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {fiveCs.map((c, idx) => (
                  <li
                    key={c.word}
                    className="rounded-[14px] border border-white/12 bg-white/5 p-5 backdrop-blur"
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-green">
                        0{idx + 1}
                      </span>
                      <span className="text-3xl font-medium text-white/30">{c.letter}</span>
                    </div>
                    <p className="mt-2 text-lg font-medium text-white">{c.word}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/70">
                      {c.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SACRED MANDATE QUOTE ------------------------------------- */}
      <section className="relative isolate overflow-hidden bg-brand-green py-20 text-white sm:py-24 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-brand-red/30 blur-3xl"
        />
        <div className="relative mx-auto w-[min(100%-1.5rem,60rem)] text-center">
          <div className="mx-auto inline-flex items-center gap-3">
            <TricolorRule light />
            <span className="text-[11px] font-semibold uppercase tracking-[0.46em] text-white/80">
              {sacredMandate.eyebrow}
            </span>
            <TricolorRule light />
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            {sacredMandate.intro}
          </p>

          <figure className="mt-10">
            <Quote aria-hidden="true" className="mx-auto h-10 w-10 text-white/60" />
            <blockquote className="mx-auto mt-4 max-w-3xl text-balance text-2xl font-medium italic leading-snug sm:text-3xl lg:text-[2.25rem]">
              &ldquo;{sacredMandate.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/70">
              — {sacredMandate.attribution}
            </figcaption>
          </figure>

          <p className="mx-auto mt-10 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            {sacredMandate.closing}
          </p>
        </div>
      </section>

      {/* UNITY + ROAD AHEAD --------------------------------------- */}
      <section className="relative bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-[min(100%-1.5rem,80rem)] grid gap-10 lg:grid-cols-2 lg:gap-8">
          <article className="group relative overflow-hidden rounded-[18px] border border-black/8 bg-[#f7f7f4] p-8 sm:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-green/10 blur-2xl"
            />
            <div className="relative">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-green text-white">
                <Users aria-hidden="true" className="h-5 w-5" />
              </span>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-green">
                {unityOverDivision.eyebrow}
              </p>
              <h3 className="mt-2 text-2xl font-medium leading-tight text-brand-black sm:text-3xl">
                {unityOverDivision.heading}
              </h3>
              <div className="mt-4 space-y-3 text-base leading-relaxed text-black/70">
                {unityOverDivision.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </article>

          <article className="group relative overflow-hidden rounded-[18px] border border-black/8 bg-[#f7f7f4] p-8 sm:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-red/10 blur-2xl"
            />
            <div className="relative">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-red text-white">
                <Flag aria-hidden="true" className="h-5 w-5" />
              </span>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-red">
                {roadAhead.eyebrow}
              </p>
              <h3 className="mt-2 text-2xl font-medium leading-tight text-brand-black sm:text-3xl">
                {roadAhead.heading}
              </h3>
              <div className="mt-4 space-y-3 text-base leading-relaxed text-black/70">
                {roadAhead.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <a
                href="/home#get-involved-movement"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand-red transition hover:text-brand-black"
              >
                Get involved in your state
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </article>
        </div>
      </section>

      {/* NATIONAL EXECUTIVE COUNCIL ------------------------------- */}
      <section
        id="executive-council"
        className="relative scroll-mt-28 bg-[#f7f7f4] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto w-[min(100%-1.5rem,80rem)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <TricolorRule />
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-brand-red">
                Leadership
              </p>
              <h2 className="mt-3 text-3xl font-medium leading-tight text-brand-black sm:text-4xl lg:text-[2.75rem]">
                National Executive Council.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-black/65 sm:text-lg">
                A robust leadership framework designed for nationwide mobilisation and
                strategic implementation.
              </p>
            </div>
            <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-brand-black/70">
              <Crown aria-hidden="true" className="h-4 w-4 text-brand-green" />
              {executiveCouncil.length} executives
            </div>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {executiveCouncil.map((member, idx) => (
              <li key={member.role}>
                <article className="group relative h-full overflow-hidden rounded-[16px] border border-black/8 bg-white p-6 shadow-[0_18px_36px_-26px_rgb(0_0_0/0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_42px_-22px_rgb(0_0_0/0.4)]">
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 flex h-[2px]">
                    <span className="h-full flex-1 bg-brand-green" />
                    <span className="h-full flex-1 bg-brand-black" />
                    <span className="h-full flex-1 bg-brand-red" />
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-green">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <Award aria-hidden="true" className="h-4 w-4 text-black/30" />
                  </div>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-black/55">
                    {member.role}
                  </p>
                  <p className="mt-1 text-lg font-medium leading-tight text-brand-black">
                    {member.name}
                  </p>
                  <a
                    href={`tel:+234${member.phone.replace(/^0/, "")}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-black/70 transition hover:text-brand-green"
                  >
                    <Phone aria-hidden="true" className="h-3.5 w-3.5" />
                    {formatPhone(member.phone)}
                  </a>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ZONAL STRUCTURE ----------------------------------------- */}
      <section
        id="zonal-structure"
        className="relative scroll-mt-28 bg-white py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto w-[min(100%-1.5rem,80rem)]">
          <div className="max-w-3xl">
            <TricolorRule />
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-brand-red">
              Zonal Structure
            </p>
            <h2 className="mt-3 text-3xl font-medium leading-tight text-brand-black sm:text-4xl lg:text-[2.75rem]">
              Six zones. Every state. One movement.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-black/65 sm:text-lg">
              Pick a geopolitical zone to meet its zonal coordinator and the state
              coordinators driving the movement on the ground.
            </p>
          </div>

          {/* Zone tabs */}
          <div className="mt-10 -mx-1 flex gap-2 overflow-x-auto pb-2">
            {zones.map((zone) => {
              const isActive = zone.id === activeZoneId;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setActiveZoneId(zone.id)}
                  aria-pressed={isActive}
                  className={`group flex min-h-12 shrink-0 items-center gap-2.5 rounded-[12px] border px-5 text-sm font-semibold uppercase tracking-[0.14em] transition ${
                    isActive
                      ? "border-brand-green bg-brand-green text-white shadow-[0_14px_28px_-14px_rgb(0_166_81/0.55)]"
                      : "border-black/10 bg-white text-black/70 hover:border-brand-green/40 hover:text-brand-black"
                  }`}
                >
                  <MapPin aria-hidden="true" className="h-4 w-4" />
                  {zone.name}
                  <span
                    className={`ml-1 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-black/[0.05] text-black/55"
                    }`}
                  >
                    {zone.states.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active zone panel */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[20rem_1fr] lg:gap-8">
            {/* Zonal coordinator card */}
            <aside className="relative overflow-hidden rounded-[18px] bg-brand-black p-7 text-white shadow-[0_22px_40px_-22px_rgb(0_0_0/0.5)] sm:p-8">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 flex h-[3px]">
                <span className="h-full flex-1 bg-brand-green" />
                <span className="h-full flex-1 bg-white/30" />
                <span className="h-full flex-1 bg-brand-red" />
              </span>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-green/25 blur-2xl"
              />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/65">
                  {activeZone.region}
                </p>
                <h3 className="mt-2 text-3xl font-medium leading-tight">{activeZone.name}</h3>
                <div className="mt-7 rounded-[12px] border border-white/15 bg-white/5 p-4 backdrop-blur">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/65">
                    Zonal Coordinator
                  </p>
                  <p className="mt-1.5 text-lg font-medium leading-tight text-white">
                    {activeZone.zonalCoordinator}
                  </p>
                  <a
                    href={`tel:+234${activeZone.zonalPhone.replace(/^0/, "")}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/85 transition hover:text-brand-green"
                  >
                    <Phone aria-hidden="true" className="h-3.5 w-3.5" />
                    {formatPhone(activeZone.zonalPhone)}
                  </a>
                </div>
                <dl className="mt-7 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
                      States
                    </dt>
                    <dd className="mt-1 text-2xl font-medium">{activeZone.states.length}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
                      Coordinators
                    </dt>
                    <dd className="mt-1 text-2xl font-medium">{activeZone.states.length + 1}</dd>
                  </div>
                </dl>
              </div>
            </aside>

            {/* States grid */}
            <div className="rounded-[18px] border border-black/8 bg-[#f7f7f4] p-5 sm:p-6">
              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {activeZone.states.map((entry, idx) => (
                  <li key={entry.state}>
                    <article className="group relative flex h-full flex-col rounded-[14px] border border-black/8 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-green/30 hover:shadow-[0_18px_28px_-22px_rgb(0_0_0/0.35)]">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-green">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
                          <MapPin aria-hidden="true" className="h-3 w-3" />
                          State
                        </span>
                      </div>
                      <p className="mt-3 text-lg font-medium leading-tight text-brand-black">
                        {entry.state}
                      </p>
                      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-black/55">
                        Coordinator
                      </p>
                      <p className="mt-1 text-sm font-medium leading-snug text-brand-black">
                        {entry.coordinator}
                      </p>
                      <a
                        href={`tel:+234${entry.phone.replace(/^0/, "")}`}
                        className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-medium text-black/70 transition group-hover:text-brand-green"
                      >
                        <Phone aria-hidden="true" className="h-3.5 w-3.5" />
                        {formatPhone(entry.phone)}
                      </a>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING CTA --------------------------------------------- */}
      <section
        id="movement-cta"
        className="relative isolate overflow-hidden bg-brand-black px-4 py-20 text-center text-white sm:py-24 lg:py-28"
      >
        <span aria-hidden="true" className="absolute inset-x-0 top-0 flex h-[3px]">
          <span className="h-full flex-1 bg-brand-green" />
          <span className="h-full flex-1 bg-white/40" />
          <span className="h-full flex-1 bg-brand-red" />
        </span>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-brand-green/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-brand-red/30 blur-3xl"
        />

        <div className="relative mx-auto w-[min(100%-1rem,52rem)]">
          <div className="flex items-center justify-center gap-4">
            <TricolorRule light />
            <p className="text-[11px] font-semibold uppercase tracking-[0.46em] text-white/85">
              Be part of the rebirth
            </p>
            <TricolorRule light />
          </div>
          <h2 className="mx-auto mt-5 text-3xl font-medium leading-tight sm:text-4xl lg:text-5xl">
            The structures are set. <br className="hidden sm:inline" />
            Will you stand with us?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Join thousands of citizens already organising for credible leadership in 2027.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/home#get-involved-movement"
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[10px] bg-brand-green px-8 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_36px_-12px_rgb(0_166_81/0.55)] transition hover:bg-white hover:text-brand-green sm:w-auto"
            >
              <HandHeart aria-hidden="true" className="h-4 w-4" />
              Join the Movement
            </a>
            <a
              href="/home/contact"
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[10px] border border-white/30 bg-white/10 px-8 text-sm font-semibold uppercase tracking-[0.16em] text-white backdrop-blur transition hover:bg-white hover:text-brand-black sm:w-auto"
            >
              <ShieldCheck aria-hidden="true" className="h-4 w-4" />
              Contact the Team
            </a>
          </div>
        </div>
      </section>

      <HomeFooterSection />
    </main>
  );
}