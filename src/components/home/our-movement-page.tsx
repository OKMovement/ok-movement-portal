"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone, X } from "lucide-react";

import HomeFooterSection from "./home-footer-section";
import HomeSiteHeader from "./home-site-header";
import { useReveal } from "./use-reveal";
import {
  aboutMovement,
  type CouncilMember,
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

/** Toggle to bring back the Zonal Structure section (and its hero button). */
const SHOW_ZONAL_STRUCTURE = false;

const HERO_IMAGE = "/images/bg-3.jpeg";

function TricolorRule({ className = "h-[3px] w-14 rounded-full" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`rule-tricolor ${className}`}>
      <span className="bg-brand-green" />
      <span className="bg-paper-sunk" />
      <span className="bg-brand-red" />
    </span>
  );
}

/**
 * Shared section masthead: eyebrow in the margin, heading and standfirst against
 * the grid. Deliberately left-aligned — the page used to centre every intro
 * behind the same pair of hairlines, which made six different sections read as
 * one repeated template.
 */
function SectionHeader({
  eyebrow,
  heading,
  standfirst,
  id,
  tone = "light",
}: {
  eyebrow: string;
  heading: React.ReactNode;
  standfirst?: string;
  id?: string;
  tone?: "light" | "ink";
}) {
  const isInk = tone === "ink";
  return (
    <div
      className={`reveal grid gap-6 border-t pt-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16 ${
        isInk ? "border-white/15" : "border-rule"
      }`}
    >
      <p
        className={`font-display text-[11px] font-bold uppercase tracking-[0.28em] ${
          isInk ? "text-green-ink" : "text-green-deep"
        }`}
      >
        {eyebrow}
      </p>
      <div>
        <h2
          id={id}
          className={`max-w-[20ch] font-display text-display-2 font-extrabold leading-[0.96] tracking-[-0.03em] text-balance ${
            isInk ? "text-white" : "text-ink"
          }`}
        >
          {heading}
        </h2>
        {standfirst ? (
          <p
            className={`mt-6 max-w-[62ch] text-lead leading-relaxed text-pretty ${
              isInk ? "text-white/70" : "text-body"
            }`}
          >
            {standfirst}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** The logo watermark is the background device on light sections, per the landing page. */
function LogoWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[min(60%,44rem)] select-none opacity-[0.06]"
    >
      <Image
        src="/images/new-logo.png"
        alt=""
        fill
        sizes="(min-width: 1024px) 44rem, 60vw"
        className="object-contain object-right"
      />
    </div>
  );
}

function initialsOf(name: string): string {
  const parts = name
    .replace(/^(Hon\.|Amb\.|Barr\.|Dr\.|Hajiya|Alhaji|Chief|Engr\.)\s+/i, "")
    .split(/\s+/)
    .filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]![0] : "";
  return (first + last).toUpperCase();
}

/**
 * Portalled to <body> with a focus trap, scroll lock and focus restore. The
 * previous version was a bare div: focus stayed behind it on the page, the
 * background scrolled, and nothing returned focus to the card on close.
 */
function CouncilMemberDialog({
  member,
  onClose,
}: {
  member: CouncilMember;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    const panel = panelRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel?.querySelector<HTMLElement>("button")?.focus();

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
        aria-label="Close profile"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/70 backdrop-blur-sm animate-in fade-in duration-200"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="council-member-name"
        className="relative w-full max-w-md overflow-hidden rounded-lg border border-rule bg-paper-raised shadow-4 animate-in fade-in zoom-in-95 duration-200"
      >
        <TricolorRule className="absolute inset-x-0 top-0 z-10 h-1 w-full" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close profile"
          className="absolute right-4 top-5 z-10 inline-flex h-9 w-9 items-center justify-center rounded-md bg-paper-raised/90 text-ink shadow-1 transition duration-200 hover:bg-ink hover:text-white active:scale-95"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>

        <div className="relative aspect-[4/3] w-full bg-ink">
          {member.photo ? (
            <Image
              src={member.photo}
              alt={`Portrait of ${member.name}`}
              fill
              sizes="28rem"
              className="object-cover object-top"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center font-display text-6xl font-extrabold text-green-ink">
              {initialsOf(member.name)}
            </span>
          )}
        </div>

        <div className="p-6 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-green-deep">
            {member.role}
          </p>
          <h2
            id="council-member-name"
            className="mt-2 font-display text-2xl font-extrabold tracking-[-0.02em] text-ink"
          >
            {member.name}
          </h2>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function OurMovementPage() {
  const pageRef = useReveal<HTMLDivElement>();
  const [activeZoneId, setActiveZoneId] = useState(zones[0]!.id);
  const [selectedMember, setSelectedMember] = useState<CouncilMember | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const activeZone = useMemo(() => zones.find((zone) => zone.id === activeZoneId)!, [activeZoneId]);

  function openMember(member: CouncilMember, trigger: HTMLButtonElement) {
    lastTriggerRef.current = trigger;
    setSelectedMember(member);
  }

  function closeMember() {
    setSelectedMember(null);
    lastTriggerRef.current?.focus();
  }

  return (
    <div ref={pageRef}>
      <HomeSiteHeader />

      <main id="main-content" className="bg-paper text-body">
        {/* HERO ----------------------------------------------------- */}
        <section
          aria-labelledby="our-movement-heading"
          className="grain grain-on-ink relative isolate overflow-hidden bg-ink text-white"
        >
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <Image
              src={HERO_IMAGE}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-35"
            />
          </div>
          {/* One directional scrim so the headline holds over the photograph —
              replacing three stacked radial washes. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/40"
          />

          <div className="relative mx-auto w-[min(100%-2rem,82rem)] pb-20 pt-20 sm:pb-24 lg:pb-28 lg:pt-28">
            <div className="max-w-[46rem]">
              <div className="flex items-center gap-4">
                <TricolorRule />
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/70">
                  Our Movement
                </p>
              </div>

              {/* Three beats of one claim, so they are numbered rather than
                  strung together with decorative dots. */}
              <ol className="mt-8 space-y-2.5">
                {ourMovementHero.eyebrowParts.map((part, idx) => (
                  <li key={part} className="flex items-baseline gap-4">
                    <span
                      aria-hidden="true"
                      className="font-display text-[11px] font-bold tabular-nums text-green-ink"
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-medium uppercase tracking-[0.14em] text-white/75">
                      {part}
                    </span>
                  </li>
                ))}
              </ol>

              <h1
                id="our-movement-heading"
                className="mt-8 font-display text-display-1 font-extrabold leading-[0.94] tracking-[-0.035em] text-balance"
              >
                {ourMovementHero.title}
              </h1>
              <p className="mt-7 max-w-[56ch] text-lead leading-relaxed text-white/75 text-pretty">
                {ourMovementHero.lead}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/#get-involved-movement"
                  className="group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-md bg-brand-green px-7 text-sm font-semibold tracking-wide text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-ink active:translate-y-0 active:scale-[0.99]"
                >
                  Join the movement
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
                {SHOW_ZONAL_STRUCTURE ? (
                  <a
                    href="#zonal-structure"
                    className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-md border border-white/25 px-7 text-sm font-semibold tracking-wide text-white transition duration-200 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-ink active:translate-y-0"
                  >
                    Meet the coordinators
                  </a>
                ) : null}
              </div>
            </div>

            {/* Reach, as a ruled figure row rather than four glass cards. */}
            <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-white/15 pt-8 lg:mt-20 lg:grid-cols-4">
              {movementStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-4xl font-extrabold leading-none tracking-[-0.03em] tabular-nums sm:text-[2.75rem]">
                      {stat.value}
                    </span>
                    <span
                      aria-hidden="true"
                      className="mt-2.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-white/55"
                    >
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* OPENING DECLARATION -------------------------------------- */}
        <section
          aria-labelledby="about-movement-heading"
          className="relative overflow-hidden bg-paper py-20 sm:py-24 lg:py-28"
        >
          <LogoWatermark />
          <div className="relative z-10 mx-auto w-[min(100%-2rem,82rem)]">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-20">
              <div className="reveal lg:sticky lg:top-28 lg:self-start">
                <TricolorRule />
                <p className="mt-5 font-display text-[11px] font-bold uppercase tracking-[0.28em] text-green-deep">
                  {aboutMovement.eyebrow}
                </p>
                <h2
                  id="about-movement-heading"
                  className="mt-4 font-display text-display-3 font-extrabold leading-[0.98] tracking-[-0.025em] text-ink text-balance"
                >
                  {aboutMovement.heading}
                </h2>
              </div>

              <div className="reveal">
                <div className="max-w-[65ch] space-y-5 text-lead leading-relaxed text-body text-pretty">
                  {aboutMovement.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-10 border-l-2 border-green-deep bg-paper-sunk py-7 pl-7 pr-6 sm:pl-9">
                  <p className="font-display text-[11px] font-bold uppercase tracking-[0.28em] text-green-deep">
                    {nationInNeed.eyebrow}
                  </p>
                  <h3 className="mt-3 max-w-[24ch] font-display text-xl font-extrabold leading-tight tracking-[-0.02em] text-ink text-balance sm:text-2xl">
                    {nationInNeed.heading}
                  </h3>
                  <div className="mt-4 max-w-[62ch] space-y-3 leading-relaxed text-body text-pretty">
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
        <section
          aria-labelledby="stand-for-heading"
          className="relative overflow-hidden border-t border-rule bg-paper-sunk py-20 sm:py-24 lg:py-28"
        >
          <div className="relative z-10 mx-auto w-[min(100%-2rem,82rem)]">
            <SectionHeader
              id="stand-for-heading"
              eyebrow="What we stand for"
              heading={
                <>
                  Mandate. Vision. <span className="text-green-deep">Values.</span>
                </>
              }
              standfirst="Three commitments that anchor every decision the movement makes — from the streets to the statehouse."
            />

            {/* An ordered set of three, so it reads as a numbered sequence
                instead of three interchangeable cards in a row. */}
            <ol className="mt-14 border-t border-rule lg:mt-20">
              {(["mandate", "vision", "values"] as const).map((key, idx) => {
                const item = mandateVisionValues[key];
                return (
                  <li
                    key={key}
                    className="reveal grid gap-4 border-b border-rule py-9 lg:grid-cols-[auto_minmax(0,22rem)_minmax(0,1fr)] lg:items-baseline lg:gap-12"
                    style={{ "--reveal-delay": `${idx * 90}ms` } as React.CSSProperties}
                  >
                    <span
                      aria-hidden="true"
                      className="font-display text-sm font-bold tabular-nums text-faint"
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-2xl font-extrabold tracking-[-0.025em] text-ink sm:text-[1.75rem]">
                      {item.title}
                    </h3>
                    <p className="max-w-[62ch] leading-relaxed text-body text-pretty">
                      {item.body}
                    </p>
                  </li>
                );
              })}
            </ol>

            {/* Five C's */}
            <div className="reveal grain grain-on-ink relative mt-20 overflow-hidden rounded-lg bg-ink text-white shadow-4 lg:mt-24">
              <TricolorRule className="absolute inset-x-0 top-0 h-1 w-full" />
              <div className="relative grid gap-10 px-6 py-14 sm:px-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-16 lg:px-14">
                <div>
                  <p className="font-display text-[11px] font-bold uppercase tracking-[0.28em] text-green-ink">
                    How we choose leaders
                  </p>
                  <h3 className="mt-4 max-w-[14ch] font-display text-display-3 font-extrabold leading-[0.98] tracking-[-0.025em] text-balance">
                    The 5 C&rsquo;s of OK leadership.
                  </h3>
                  <p className="mt-5 max-w-[46ch] leading-relaxed text-white/70 text-pretty">
                    A simple, uncompromising standard for every leader the movement supports — from
                    local coordinators to national executives.
                  </p>
                </div>

                <dl className="divide-y divide-white/15 border-y border-white/15">
                  {fiveCs.map((item) => (
                    <div key={item.word} className="flex gap-5 py-4 sm:gap-7">
                      <dt className="w-[7.5rem] shrink-0 font-display text-base font-bold tracking-tight sm:w-[9rem] sm:text-lg">
                        {item.word}
                      </dt>
                      <dd className="text-sm leading-relaxed text-white/70">{item.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* SACRED MANDATE QUOTE ------------------------------------- */}
        <section
          aria-labelledby="sacred-mandate-heading"
          className="grain grain-on-ink relative overflow-hidden bg-green-deep py-20 text-white sm:py-24 lg:py-28"
        >
          <div className="relative mx-auto w-[min(100%-2rem,60rem)]">
            <div className="flex items-center gap-4">
              <TricolorRule />
              <h2
                id="sacred-mandate-heading"
                className="font-display text-[11px] font-bold uppercase tracking-[0.28em] text-white/80"
              >
                {sacredMandate.eyebrow}
              </h2>
            </div>

            <p className="mt-8 max-w-[62ch] leading-relaxed text-white/75 text-pretty">
              {sacredMandate.intro}
            </p>

            <figure className="mt-10 border-l-2 border-white/40 pl-7 sm:pl-10">
              <blockquote className="max-w-[24ch] font-display text-display-3 font-extrabold leading-[1.04] tracking-[-0.025em] text-balance">
                {sacredMandate.quote}
              </blockquote>
              <figcaption className="mt-7 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/65">
                {sacredMandate.attribution}
              </figcaption>
            </figure>

            <p className="mt-12 max-w-[62ch] text-lead leading-relaxed text-white/85 text-pretty">
              {sacredMandate.closing}
            </p>
          </div>
        </section>

        {/* UNITY + ROAD AHEAD --------------------------------------- */}
        <section
          aria-label="Unity and the road ahead"
          className="relative overflow-hidden bg-paper py-20 sm:py-24 lg:py-28"
        >
          <LogoWatermark />
          <div className="relative z-10 mx-auto grid w-[min(100%-2rem,82rem)] gap-6 md:grid-cols-2 md:gap-8">
            <article className="reveal flex flex-col border border-rule bg-paper-raised p-7 shadow-1 sm:p-9">
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.28em] text-green-deep">
                {unityOverDivision.eyebrow}
              </p>
              <h2 className="mt-4 max-w-[20ch] font-display text-2xl font-extrabold leading-tight tracking-[-0.025em] text-ink text-balance sm:text-[1.9rem]">
                {unityOverDivision.heading}
              </h2>
              <div className="mt-5 max-w-[60ch] space-y-3 leading-relaxed text-body text-pretty">
                {unityOverDivision.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>

            {/* Offset so the pair reads as a spread rather than a 2-up grid. */}
            <article
              className="reveal flex flex-col border border-rule bg-paper-raised p-7 shadow-1 md:mt-12 sm:p-9"
              style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
            >
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.28em] text-brand-red">
                {roadAhead.eyebrow}
              </p>
              <h2 className="mt-4 max-w-[20ch] font-display text-2xl font-extrabold leading-tight tracking-[-0.025em] text-ink text-balance sm:text-[1.9rem]">
                {roadAhead.heading}
              </h2>
              <div className="mt-5 max-w-[60ch] space-y-3 leading-relaxed text-body text-pretty">
                {roadAhead.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <Link
                href="/#get-involved-movement"
                className="group mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold tracking-wide text-ink transition-colors duration-200 hover:text-green-deep"
              >
                Get involved in your state
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </article>
          </div>
        </section>

        {/* NATIONAL EXECUTIVE COUNCIL ------------------------------- */}
        <section
          id="executive-council"
          aria-labelledby="executive-council-heading"
          className="relative overflow-hidden border-t border-rule bg-paper-sunk py-20 sm:py-24 lg:py-28"
        >
          <div className="relative z-10 mx-auto w-[min(100%-2rem,82rem)]">
            <SectionHeader
              id="executive-council-heading"
              eyebrow="Leadership"
              heading={
                <>
                  The national <span className="text-green-deep">executive council</span>
                </>
              }
              standfirst={`${executiveCouncil.length} executives running a leadership framework built for nationwide mobilisation and strategic implementation.`}
            />

            <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
              {executiveCouncil.map((member, idx) => (
                <li key={member.role}>
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    onClick={(event) => openMember(member, event.currentTarget)}
                    className="reveal group flex h-full w-full flex-col overflow-hidden border border-rule bg-paper-raised text-left transition duration-300 hover:-translate-y-1 hover:border-green-deep hover:shadow-4"
                    style={{ "--reveal-delay": `${(idx % 3) * 80}ms` } as React.CSSProperties}
                  >
                    <span className="relative block aspect-[4/3] w-full overflow-hidden bg-ink">
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 26rem, (min-width: 640px) 45vw, 100vw"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center font-display text-4xl font-extrabold text-green-ink">
                          {initialsOf(member.name)}
                        </span>
                      )}
                      <span
                        aria-hidden="true"
                        className="absolute left-4 top-4 font-display text-xs font-bold tabular-nums text-white/60"
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </span>

                    <span className="flex flex-1 flex-col p-6">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-green-deep">
                        {member.role}
                      </span>
                      <span className="mt-2 font-display text-xl font-extrabold leading-tight tracking-[-0.02em] text-ink">
                        {member.name}
                      </span>
                      <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold tracking-wide text-muted transition-colors duration-200 group-hover:text-green-deep">
                        View profile
                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ZONAL STRUCTURE (hidden behind SHOW_ZONAL_STRUCTURE) ----- */}
        {SHOW_ZONAL_STRUCTURE ? (
          <section
            id="zonal-structure"
            aria-labelledby="zonal-structure-heading"
            className="relative overflow-hidden border-t border-rule bg-paper py-20 sm:py-24 lg:py-28"
          >
            <LogoWatermark />
            <div className="relative z-10 mx-auto w-[min(100%-2rem,82rem)]">
              <SectionHeader
                id="zonal-structure-heading"
                eyebrow="Zonal structure"
                heading={
                  <>
                    Six zones. Every state. <span className="text-green-deep">One movement.</span>
                  </>
                }
                standfirst="Pick a geopolitical zone to meet its zonal coordinator and the state coordinators driving the movement on the ground."
              />

              <div
                role="tablist"
                aria-label="Geopolitical zones"
                className="mt-12 flex gap-2 overflow-x-auto pb-2 lg:mt-16"
              >
                {zones.map((zone) => {
                  const isActive = zone.id === activeZoneId;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      role="tab"
                      id={`zone-tab-${zone.id}`}
                      aria-selected={isActive}
                      aria-controls={`zone-panel-${zone.id}`}
                      onClick={() => setActiveZoneId(zone.id)}
                      className={`flex min-h-12 shrink-0 items-center gap-2.5 rounded-md border px-5 text-sm font-semibold tracking-wide transition duration-200 ${
                        isActive
                          ? "border-green-deep bg-green-deep text-white"
                          : "border-rule-strong bg-paper-raised text-muted hover:border-green-deep hover:text-green-deep"
                      }`}
                    >
                      {zone.name}
                      <span
                        className={`inline-flex h-5 min-w-5 items-center justify-center rounded-sm px-1 text-[10px] font-bold tabular-nums ${
                          isActive ? "bg-white/20" : "bg-paper-sunk"
                        }`}
                      >
                        {zone.states.length}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div
                role="tabpanel"
                id={`zone-panel-${activeZone.id}`}
                aria-labelledby={`zone-tab-${activeZone.id}`}
                className="mt-8 grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-8"
              >
                <aside className="grain grain-on-ink relative overflow-hidden rounded-lg bg-ink p-7 text-white shadow-3">
                  <TricolorRule className="absolute inset-x-0 top-0 h-1 w-full" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                    {activeZone.region}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.025em]">
                    {activeZone.name}
                  </h3>

                  <div className="mt-7 border-t border-white/15 pt-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
                      Zonal coordinator
                    </p>
                    <p className="mt-1.5 font-display text-lg font-bold leading-tight">
                      {activeZone.zonalCoordinator}
                    </p>
                    <div className="mt-4 flex flex-col gap-2">
                      <a
                        href={`tel:+234${activeZone.zonalPhone.replace(/^0/, "")}`}
                        className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors duration-200 hover:text-green-ink"
                      >
                        <Phone aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                        {formatPhone(activeZone.zonalPhone)}
                      </a>
                      <a
                        href={`mailto:${activeZone.zonalEmail}`}
                        className="inline-flex items-center gap-2 break-all text-sm text-white/80 transition-colors duration-200 hover:text-green-ink"
                      >
                        <Mail aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                        {activeZone.zonalEmail}
                      </a>
                    </div>
                  </div>

                  <dl className="mt-7 grid grid-cols-2 gap-4 border-t border-white/15 pt-5">
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
                        States
                      </dt>
                      <dd className="mt-1 font-display text-2xl font-extrabold tabular-nums">
                        {activeZone.states.length}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
                        Coordinators
                      </dt>
                      <dd className="mt-1 font-display text-2xl font-extrabold tabular-nums">
                        {activeZone.states.length + 1}
                      </dd>
                    </div>
                  </dl>
                </aside>

                <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {activeZone.states.map((entry) => (
                    <li key={entry.state}>
                      <article className="flex h-full flex-col border border-rule bg-paper-raised p-5 transition duration-200 hover:-translate-y-0.5 hover:border-green-deep hover:shadow-2">
                        <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-faint">
                          <MapPin aria-hidden="true" className="h-3 w-3" />
                          State
                        </p>
                        <h3 className="mt-2.5 font-display text-lg font-extrabold leading-tight tracking-[-0.02em] text-ink">
                          {entry.state}
                        </h3>
                        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-faint">
                          Coordinator
                        </p>
                        <p className="mt-1 text-sm font-medium leading-snug text-ink">
                          {entry.coordinator}
                        </p>
                        <div className="mt-auto flex flex-col gap-2 pt-4">
                          <a
                            href={`tel:+234${entry.phone.replace(/^0/, "")}`}
                            className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-green-deep"
                          >
                            <Phone aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                            {formatPhone(entry.phone)}
                          </a>
                          <a
                            href={`mailto:${entry.email}`}
                            className="inline-flex items-center gap-2 break-all text-sm text-muted transition-colors duration-200 hover:text-green-deep"
                          >
                            <Mail aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                            {entry.email}
                          </a>
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ) : null}

        {/* CLOSING CTA --------------------------------------------- */}
        <section
          id="movement-cta"
          aria-labelledby="movement-cta-heading"
          className="grain grain-on-ink relative overflow-hidden bg-ink-raised text-white"
        >
          <TricolorRule className="absolute inset-x-0 top-0 h-1 w-full" />
          <div className="relative mx-auto grid w-[min(100%-2rem,82rem)] gap-10 py-20 sm:py-24 lg:grid-cols-[1.4fr_auto] lg:items-end lg:gap-20">
            <div>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.28em] text-green-ink">
                Be part of the rebirth
              </p>
              <h2
                id="movement-cta-heading"
                className="mt-4 max-w-[18ch] font-display text-display-2 font-extrabold leading-[0.96] tracking-[-0.03em] text-balance"
              >
                The structures are set. Will you stand with us?
              </h2>
              <p className="mt-6 max-w-[54ch] text-lead leading-relaxed text-white/70 text-pretty">
                Join thousands of citizens already organising for credible leadership in 2027.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:pb-2">
              <Link
                href="/#get-involved-movement"
                className="group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-md bg-brand-green px-8 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-green transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-ink active:translate-y-0 active:scale-[0.99]"
              >
                Join the movement
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/home/contact"
                className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-md border border-white/25 px-8 text-sm font-semibold uppercase tracking-[0.12em] text-white transition duration-200 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-ink active:translate-y-0"
              >
                Contact the team
              </Link>
            </div>
          </div>
        </section>
      </main>

      <HomeFooterSection />

      {selectedMember ? (
        <CouncilMemberDialog member={selectedMember} onClose={closeMember} />
      ) : null}
    </div>
  );
}
