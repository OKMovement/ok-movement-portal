"use client";

import { useEffect, useState } from "react";

import { ELECTION } from "./election-data";

type Remaining = { days: number; hours: number; minutes: number; seconds: number; over: boolean };

function compute(target: number): Remaining {
  const diff = target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, over: true };
  const total = Math.floor(diff / 1000);
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    over: false,
  };
}

/**
 * Whole days until polls open, or `null` before the client clock has run (so
 * server and first paint match). `0` means election day itself.
 */
export function useDaysToVote(): number | null {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(ELECTION.presidential.opensAtIso).getTime();
    const compute = () => Math.max(0, Math.floor((target - Date.now()) / 86_400_000));
    setDays(compute());
    const id = window.setInterval(() => setDays(compute()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return days;
}

const pad = (value: number) => String(value).padStart(2, "0");

/** Each unit is its own colour block, like a row of stickers. */
const TILE_TONES = [
  "bg-brand-red text-white",
  "bg-white text-ink",
  "bg-[#f7c968] text-ink",
  "bg-ink text-white",
] as const;

/**
 * Live countdown to polls opening on election day. Rendered as "--" on the
 * server and first paint so the markup matches before the clock starts.
 */
export default function ElectionCountdown() {
  const target = new Date(ELECTION.presidential.opensAtIso).getTime();
  const [remaining, setRemaining] = useState<Remaining | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    setRemaining(compute(target));
    // Visitors who prefer reduced motion get a calmer once-a-minute update.
    const id = window.setInterval(
      () => setRemaining(compute(target)),
      reduceMotion ? 60_000 : 1000,
    );
    return () => window.clearInterval(id);
  }, [target, reduceMotion]);

  if (remaining?.over) {
    return (
      <p className="sticker inline-flex rounded-lg bg-brand-red px-5 py-3 font-display text-2xl font-extrabold text-white">
        Election day is here. Go and vote.
      </p>
    );
  }

  const tiles = [
    { label: "Days", value: remaining ? String(remaining.days) : "--" },
    { label: "Hours", value: remaining ? pad(remaining.hours) : "--" },
    { label: "Minutes", value: remaining ? pad(remaining.minutes) : "--" },
    ...(reduceMotion ? [] : [{ label: "Seconds", value: remaining ? pad(remaining.seconds) : "--" }]),
  ];

  return (
    <div>
      {/* One calm sentence for assistive tech, instead of a ticking clock. */}
      <p className="sr-only">
        {remaining
          ? `${remaining.days} days until polls open on ${ELECTION.presidential.dateLabel}.`
          : ""}
      </p>
      <dl
        aria-hidden="true"
        className="grid auto-cols-fr grid-flow-col gap-2 sm:flex sm:flex-wrap sm:gap-4"
      >
        {tiles.map((tile, index) => (
          <div
            key={tile.label}
            className={`sticker min-w-0 overflow-hidden rounded-xl px-1.5 py-3 text-center sm:min-w-[6.25rem] sm:px-5 sm:py-4 ${TILE_TONES[index]!} ${
              index % 2 === 0 ? "-rotate-2" : "rotate-1"
            }`}
          >
            <dd
              key={tile.value}
              className="tick-pop font-display text-3xl font-extrabold leading-none tabular-nums tracking-tight min-[400px]:text-4xl sm:text-6xl"
            >
              {tile.value}
            </dd>
            <dt className="mt-2 text-[9px] font-extrabold uppercase tracking-[0.12em] opacity-80 min-[400px]:text-[10px] sm:text-[11px] sm:tracking-[0.2em]">
              {tile.label}
            </dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
