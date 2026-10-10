"use client";

import {
  ArrowUpRight,
  CalendarDays,
  Camera,
  Check,
  Globe2,
  HandHeart,
  IdCard,
  Laptop,
  RotateCcw,
  Users,
  Vote,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import Confetti from "./confetti";
import { ELECTION } from "./election-data";
import ShareButtons from "./share-buttons";
import { HASHTAG_LINE } from "./share-data";
import { useReveal } from "./use-reveal";

type Tone = "ink" | "sun" | "green" | "paper";

type Action = {
  id: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  icon: LucideIcon;
  tone: Tone;
  /** Marks the one step everything else depends on. */
  first?: boolean;
};

const ACTIONS: readonly Action[] = [
  {
    id: "pvc",
    title: "Get your PVC",
    body: "No card, no vote. Register, replace or confirm yours, and find your polling unit.",
    cta: "Sort your card",
    href: "/home/getyourpvc",
    icon: IdCard,
    tone: "ink",
    first: true,
  },
  {
    id: "know",
    title: "Know how to vote",
    body: "From accreditation to result sheets: what happens at your polling unit, step by step.",
    cta: "Voting procedures",
    href: "/home/votingprocedures",
    icon: Vote,
    tone: "sun",
  },
  {
    id: "team",
    title: "Join your state team",
    body: "Sign up with the local OK Movement coordinators in your state and get started.",
    cta: "Get involved",
    href: "/home/get-involved",
    icon: Users,
    tone: "green",
  },
  {
    id: "bring20",
    title: "Bring 20",
    body: "Make your profile picture and pledge card, then dare your people to make theirs.",
    cta: "Make yours",
    href: "#share",
    icon: Camera,
    tone: "paper",
  },
  {
    id: "show-up",
    title: "Show up",
    body: "Rallies, town halls and voter-card clinics. Come out and meet your neighbours.",
    cta: "See events",
    href: "/home/upcoming-events",
    icon: CalendarDays,
    tone: "sun",
  },
  {
    id: "skills",
    title: "Lend your skills",
    body: "Developers, designers, writers, data people. The movement needs you behind the screen.",
    cta: "Tech volunteers",
    href: "/home/tech-volunteer",
    icon: Laptop,
    tone: "ink",
  },
  {
    id: "diaspora",
    title: "Abroad? Count yourself in",
    body: "Nigerians in the diaspora have a role to play too. Find your chapter.",
    cta: "Diaspora",
    href: "/diaspora",
    icon: Globe2,
    tone: "paper",
  },
  {
    id: "donate",
    title: "Back the campaign",
    body: "Posters, buses and organisers cost money. Give what you can.",
    cta: "Donate",
    href: "/home/donations",
    icon: HandHeart,
    tone: "green",
  },
];

const TONES: Record<
  Tone,
  { card: string; body: string; icon: string; link: string; check: string }
> = {
  ink: {
    card: "bg-ink text-white",
    body: "text-white/80",
    icon: "bg-[#f7c968] text-ink",
    link: "text-[#f7c968]",
    check: "border-white/60 text-white hover:bg-white hover:text-ink",
  },
  sun: {
    card: "bg-[#f7c968] text-ink",
    body: "text-ink/80",
    icon: "bg-ink text-[#f7c968]",
    link: "text-ink",
    check: "border-ink text-ink hover:bg-ink hover:text-white",
  },
  green: {
    card: "bg-green-deep text-white",
    body: "text-white/85",
    icon: "bg-white text-green-deep",
    link: "text-white",
    check: "border-white/60 text-white hover:bg-white hover:text-green-deep",
  },
  paper: {
    card: "bg-white text-ink",
    body: "text-body",
    icon: "bg-brand-red text-white",
    link: "text-green-deep",
    check: "border-ink text-ink hover:bg-ink hover:text-white",
  },
};

const STORAGE_KEY = "ok-election-ready-v1";
export default function HomeTakePartSection() {
  const sectionRef = useReveal<HTMLElement>();
  const [done, setDone] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  // Progress lives only in this browser. Private mode / blocked storage just means it won't persist.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setDone(parsed.filter((id): id is string => ACTIONS.some((a) => a.id === id)));
        }
      }
    } catch {
      // Ignore unreadable or blocked storage.
    }
    setLoaded(true);
  }, []);

  const persist = useCallback((next: string[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore blocked storage.
    }
  }, []);

  const toggle = (id: string) => {
    const next = done.includes(id) ? done.filter((x) => x !== id) : [...done, id];
    setDone(next);
    persist(next);
    if (next.length === ACTIONS.length && done.length < ACTIONS.length) setCelebrate(true);
  };

  const reset = () => {
    setDone([]);
    setCelebrate(false);
    persist([]);
  };

  useEffect(() => {
    if (!celebrate) return;
    const id = window.setTimeout(() => setCelebrate(false), 4200);
    return () => window.clearTimeout(id);
  }, [celebrate]);

  const total = ACTIONS.length;
  const count = done.length;
  const complete = loaded && count === total;
  const shareText = `I'm ready for January 16. 🗳️ PVC, my state team, my 20, all sorted. Are you? ${HASHTAG_LINE}`;

  return (
    <section
      ref={sectionRef}
      id="take-part"
      aria-labelledby="take-part-heading"
      className="relative border-b-2 border-ink bg-paper py-20 sm:py-24 lg:py-28"
    >
      {celebrate ? <Confetti /> : null}

      <div className="mx-auto grid w-[min(100%-2rem,82rem)] gap-12 lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)] lg:gap-14">
        {/* Left: the pitch, the dates and the readiness meter. Sticks while the cards scroll. */}
        <div className="reveal lg:sticky lg:top-32 lg:self-start">
          <p className="sticker-sm inline-flex rotate-1 rounded-full bg-brand-red px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-white">
            Your part in 2027
          </p>
          <h2
            id="take-part-heading"
            className="mt-5 font-display text-[clamp(2.1rem,1.2rem+3.6vw,3.6rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.02em] text-ink text-balance"
          >
            Eight ways in. <span className="text-green-deep">Tick them off.</span>
          </h2>
          <p className="mt-5 text-lead font-medium leading-relaxed text-body text-pretty">
            You don&apos;t need to be a politician. You need a voter card, a phone and a few people
            who trust you.
          </p>

          {/* Readiness meter */}
          <div
            className={`sticker mt-8 rounded-2xl p-5 ${complete ? "bg-[#f7c968]" : "bg-white"}`}
            role="group"
            aria-label="Your election readiness"
          >
            <div className="flex items-end justify-between gap-4">
              <p className="font-display text-5xl font-extrabold leading-none tabular-nums text-ink">
                {count}
                <span className="text-2xl text-faint">/{total}</span>
              </p>
              <p className="text-right text-sm font-bold text-ink">
                {complete ? "You're election-ready! 🎉" : count === 0 ? "Let's get you ready" : "Keep going"}
              </p>
            </div>
            <div className="mt-4 grid grid-cols-8 gap-1.5" aria-hidden="true">
              {ACTIONS.map((action, i) => (
                <span
                  key={action.id}
                  className={`h-3.5 rounded-sm border-2 border-ink transition-colors duration-300 ${
                    done.includes(action.id)
                      ? i % 3 === 0
                        ? "bg-brand-green"
                        : i % 3 === 1
                          ? "bg-ink"
                          : "bg-brand-red"
                      : "bg-paper-sunk"
                  }`}
                />
              ))}
            </div>

            {complete ? (
              <div className="mt-5">
                <p className="mb-3 text-sm font-semibold text-ink">
                  Tell your people you&apos;re ready. Dare them to tick the same eight.
                </p>
                <ShareButtons text={shareText} />
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted">
                Tap <strong className="text-ink">Done</strong> on each card as you go. Your
                progress stays on this device.
              </p>
            )}

            {count > 0 ? (
              <button
                type="button"
                onClick={reset}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-muted transition hover:text-ink"
              >
                <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
                Start over
              </button>
            ) : null}
          </div>

          <dl className="mt-6 hidden gap-2 text-sm lg:grid">
            <div className="flex items-center justify-between gap-4 rounded-lg bg-ink px-4 py-3 text-white">
              <dt>{ELECTION.presidential.label}</dt>
              <dd className="shrink-0 font-display text-base font-extrabold text-[#f7c968]">
                {ELECTION.presidential.short}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border-2 border-ink bg-white px-4 py-3 text-ink">
              <dt>{ELECTION.governorship.label}</dt>
              <dd className="shrink-0 font-display text-base font-extrabold">
                {ELECTION.governorship.short}
              </dd>
            </div>
          </dl>

          <Link
            href="/home/electioncalendar"
            className="group mt-5 hidden items-center gap-2 text-sm font-bold text-green-deep lg:inline-flex"
          >
            Full election calendar
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Right: the actions. */}
        <ol className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          {ACTIONS.map((action, index) => {
            const Icon = action.icon;
            const tone = TONES[action.tone];
            const isDone = done.includes(action.id);
            const isAnchor = action.href.startsWith("#");
            const linkClass = `group/link mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-extrabold uppercase tracking-[0.08em] ${tone.link}`;
            const linkInner = (
              <>
                {action.cta}
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                />
              </>
            );

            return (
              <li
                key={action.id}
                className="reveal"
                style={{ "--reveal-delay": `${(index % 2) * 90}ms` } as React.CSSProperties}
              >
                <article
                  className={`sticker sticker-press relative flex h-full flex-col rounded-2xl p-6 ${tone.card} ${
                    index % 2 === 0 ? "sm:-rotate-[0.7deg]" : "sm:rotate-[0.7deg]"
                  } ${isDone ? "opacity-90" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-ink ${tone.icon}`}
                    >
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <span className="font-display text-2xl font-extrabold tabular-nums opacity-40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {action.first ? (
                    <span className="sticker-sm mt-4 inline-flex w-fit -rotate-3 rounded bg-brand-red px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white">
                      Do this first
                    </span>
                  ) : null}

                  <h3 className="mt-4 font-display text-2xl font-extrabold uppercase leading-[1.02] tracking-tight">
                    {action.title}
                  </h3>
                  <p className={`mt-2 flex-1 text-[15px] font-medium leading-relaxed ${tone.body}`}>
                    {action.body}
                  </p>

                  {isAnchor ? (
                    <a href={action.href} className={linkClass}>
                      {linkInner}
                    </a>
                  ) : (
                    <Link href={action.href} className={linkClass}>
                      {linkInner}
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => toggle(action.id)}
                    aria-pressed={isDone}
                    className={`mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border-2 px-4 text-sm font-extrabold uppercase tracking-[0.1em] transition duration-200 ${
                      isDone
                        ? "border-ink bg-brand-green text-ink"
                        : tone.check
                    }`}
                  >
                    <Check aria-hidden="true" className={`h-4 w-4 ${isDone ? "" : "opacity-60"}`} />
                    {isDone ? "Done!" : "Mark as done"}
                  </button>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
