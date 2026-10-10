import { Camera } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import ElectionCountdown from "./election-countdown";
import { ELECTION } from "./election-data";
import StickerMarquee from "./sticker-marquee";

const heroDuoImage = "/assets/hero_duo_trimmed.png";
const LOGO = "/images/new-logo.png";

function Star({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0l2.9 9.1L24 12l-9.1 2.9L12 24l-2.9-9.1L0 12l9.1-2.9z" />
    </svg>
  );
}

const MARQUEE_ITEMS = ["Check your PVC", "Bring 20", "Show up", "Vote January 16"] as const;

/**
 * The landing page opens on one idea: the election is coming, and here is what
 * you can do about it. The countdown is the hero; the actions sit right under it.
 */
export default function HomeElectionHero() {
  return (
    <section
      id="home-hero"
      aria-labelledby="home-hero-heading"
      className="relative isolate overflow-hidden bg-paper-sunk"
    >
      {/* Texture: a dot grid under a sunrise wash. */}
      <div aria-hidden="true" className="dot-grid absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_20%,rgb(247_201_104/0.55)_0%,rgb(247_201_104/0.12)_40%,transparent_65%),radial-gradient(ellipse_at_0%_100%,rgb(0_166_81/0.16)_0%,transparent_55%)]"
      />

      {/* Floating confetti shapes. */}
      <Star className="float-slow absolute left-[4%] top-[14%] -z-10 hidden h-9 w-9 text-brand-red sm:block" />
      <Star
        className="float-slow absolute bottom-[22%] left-[46%] -z-10 hidden h-6 w-6 text-green-deep lg:block"
      />
      <span
        aria-hidden="true"
        className="float-slow absolute right-[6%] top-[8%] -z-10 hidden h-10 w-10 rounded-full border-[5px] border-brand-green lg:block"
      />

      <div className="relative mx-auto grid w-[min(100%-2rem,82rem)] items-center gap-12 pb-16 pt-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-8 lg:pb-24 lg:pt-16">
        <div>
          <p className="sticker-sm inline-flex -rotate-2 items-center gap-2 rounded-full bg-[#f7c968] px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-ink">
            <span aria-hidden="true">🗳️</span>
            2027 General Elections
          </p>

          <h1
            id="home-hero-heading"
            className="mt-6 font-display text-[clamp(2.2rem,1rem+5.4vw,5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.01em] text-ink text-balance [word-spacing:0.12em]"
          >
            <span className="block">Nigeria votes</span>
            <span className="relative mt-1 inline-block pb-3 text-green-deep">
              {ELECTION.presidential.dateLabel.replace(", 2027", "")}.
              <svg
                aria-hidden="true"
                viewBox="0 0 300 14"
                preserveAspectRatio="none"
                className="absolute bottom-0 left-0 h-3 w-full text-brand-red"
              >
                <path
                  d="M2 9 Q 20 1 38 9 T 74 9 T 110 9 T 146 9 T 182 9 T 218 9 T 254 9 T 298 9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="mt-1 block">Are you ready?</span>
          </h1>

          <p className="mt-7 max-w-[46ch] text-lead font-medium leading-relaxed text-body text-pretty">
            Check your voter card, join your state team and bring twenty people with you. Every one
            of us has a part to play before the polls open.
          </p>

          <div className="mt-8">
            <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand-red">
              <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-brand-red" />
              Polls open in
            </p>
            <ElectionCountdown />
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/home/get-involved"
              className="sticker sticker-press inline-flex min-h-14 items-center justify-center gap-2.5 rounded-lg bg-white px-7 text-sm font-extrabold uppercase tracking-[0.1em] text-ink"
            >
              Join your state team
            </Link>
            <a
              href="#share"
              className="sticker sticker-press inline-flex min-h-14 items-center justify-center gap-2.5 rounded-lg bg-brand-red px-7 text-sm font-extrabold uppercase tracking-[0.1em] text-white"
            >
              <Camera aria-hidden="true" className="h-5 w-5" />
              Make your DP
            </a>
          </div>

          <p className="mt-8 max-w-[56ch] text-sm leading-relaxed text-muted">
            Polls open {ELECTION.pollsOpen} and close {ELECTION.pollsClose}. Governorship and State
            Assembly elections follow on {ELECTION.governorship.dateLabel}.{" "}
            <Link
              href="/home/electioncalendar"
              className="font-bold text-green-deep underline decoration-green-deep/30 underline-offset-4 transition hover:decoration-green-deep"
            >
              See the full calendar
            </Link>
          </p>
        </div>

        {/* Portrait sticker: the principals inside a circle, with badges stuck around it. */}
        <div className="relative mx-auto w-full max-w-[30rem] lg:max-w-none">
          <div className="relative mx-auto aspect-square w-full max-w-[21rem] sm:max-w-[26rem] lg:max-w-[32rem]">
            <div className="sticker-lg relative h-full w-full overflow-hidden rounded-full bg-[#f7c968]">
              <Image
                src={heroDuoImage}
                alt="Peter Obi and Rabiu Kwankwaso"
                fill
                priority
                sizes="(min-width: 1024px) 32rem, 90vw"
                className="scale-[1.08] object-contain object-bottom mix-blend-multiply"
              />
            </div>

            <div className="sticker absolute -right-2 top-[6%] rotate-6 rounded-xl bg-brand-red px-4 py-3 text-center text-white sm:-right-6">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em]">Polls open</p>
              <p className="font-display text-2xl font-extrabold leading-none sm:text-3xl">
                {ELECTION.pollsOpen}
              </p>
            </div>

            <div className="sticker absolute -left-1 bottom-[10%] -rotate-6 rounded-xl bg-white px-4 py-3 sm:-left-6">
              <p className="font-display text-2xl font-extrabold leading-none text-ink sm:text-3xl">
                Bring <span className="text-brand-red">20</span>
              </p>
              <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted">
                Pass it on
              </p>
            </div>

            <div className="sticker absolute left-[2%] top-[4%] -rotate-12 overflow-hidden rounded-full bg-white">
              <Image
                src={LOGO}
                alt="OK Movement"
                width={88}
                height={88}
                className="h-16 w-16 object-contain sm:h-20 sm:w-20"
              />
            </div>
          </div>
        </div>
      </div>

      <StickerMarquee items={MARQUEE_ITEMS} tone="ink" className="border-t-2 border-ink" />
    </section>
  );
}
