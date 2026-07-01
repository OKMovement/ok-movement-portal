"use client";

import { useEffect, type ComponentType, type SVGProps } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Ban,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock,
  Eye,
  Fingerprint,
  Hand,
  IdCard,
  MapPin,
  ScrollText,
  ShieldCheck,
  Smile,
  UserCheck,
  Vote,
} from "lucide-react";
import HomeSiteHeader from "./home-site-header";
import HomeFooterSection from "./home-footer-section";
const heroImage = "/assets/electoral-items-scaled-1_1778613796372.webp";
const stepByStepImage = "/assets/The_Step-by-Step_Process_1778612523386.png";
const rightsImage = "/assets/Your_Rights_as_a_Voter_1778612523386.png";
const pvcCodeImage = "/assets/Note_on_Your_PVC_to_locate_you_polling_unit_1778612523385.png";

type Step = {
  n: string;
  title: string;
  body: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const steps: readonly Step[] = [
  {
    n: "01",
    title: "Arrive at your polling unit",
    body:
      "Get there from 8:00 AM. Find the polling unit code that matches the four-digit code on your PVC. Join the orderly queue.",
    icon: MapPin,
  },
  {
    n: "02",
    title: "Present your PVC for accreditation",
    body:
      "Hand your PVC to the Presiding Officer. Your card is scanned and the Bimodal Voter Accreditation System (BVAS) verifies your fingerprint or face.",
    icon: Fingerprint,
  },
  {
    n: "03",
    title: "Receive your ballot paper",
    body:
      "Once accredited, your name is ticked on the register and you are issued a stamped, signed ballot paper for each election being held.",
    icon: ClipboardList,
  },
  {
    n: "04",
    title: "Vote in secret",
    body:
      "Step into the voting cubicle. Thumbprint clearly inside the box of your chosen candidate. One thumbprint, one box — anything else may invalidate your vote.",
    icon: Hand,
  },
  {
    n: "05",
    title: "Cast your ballot",
    body:
      "Fold your ballot paper with the markings inside and drop it into the correct transparent ballot box for that election.",
    icon: Vote,
  },
  {
    n: "06",
    title: "Stay, watch, protect your vote",
    body:
      "After voting you have a right to remain at the polling unit while ballots are counted, results are announced, and the result sheet (Form EC8A) is uploaded to IReV.",
    icon: Eye,
  },
];

const rights: readonly { icon: ComponentType<SVGProps<SVGSVGElement>>; title: string; body: string }[] = [
  {
    icon: ShieldCheck,
    title: "Vote freely & in secret",
    body:
      "No one — party agent, security operative or community leader — may watch how you mark your ballot or pressure your choice.",
  },
  {
    icon: UserCheck,
    title: "Be treated with dignity",
    body:
      "INEC officials must serve you politely regardless of your ethnicity, religion, gender, age or political affiliation.",
  },
  {
    icon: Hand,
    title: "Receive assistance if needed",
    body:
      "Voters with disabilities, the elderly, pregnant women and nursing mothers are entitled to priority and assisted voting.",
  },
  {
    icon: Eye,
    title: "Observe the counting",
    body:
      "You may stay at your polling unit to watch ballots being sorted, counted and the result sheet being completed and announced.",
  },
  {
    icon: ScrollText,
    title: "See the result sheet",
    body:
      "The signed Form EC8A must be pasted publicly at the polling unit. You may photograph it and check it on the IReV portal.",
  },
  {
    icon: AlertTriangle,
    title: "Report violations",
    body:
      "Vote buying, intimidation, ballot snatching and BVAS sabotage are crimes. Report them to INEC, security agencies or election observers.",
  },
];

const whatToBring: readonly string[] = [
  "Your Permanent Voter Card (PVC) — non-negotiable",
  "A pen (optional — INEC provides ink)",
  "Bottled water and a small snack",
  "Sun protection: cap, umbrella or sunglasses",
  "A book or charged phone for the queue",
];

const whatNotToBring: readonly string[] = [
  "Mobile phones inside the voting cubicle",
  "Cameras or recording devices in the booth",
  "Party-branded clothing, caps or scarves",
  "Weapons of any kind",
  "Cash or items you do not want to lose in a crowd",
];

const faqs: readonly { q: string; a: string }[] = [
  {
    q: "What time does voting start and end?",
    a: "Accreditation and voting run from 8:30 AM to 2:30 PM. If you are already in the queue at 2:30 PM, you must be allowed to vote — do not leave the line.",
  },
  {
    q: "What if BVAS fails to recognise my fingerprint?",
    a: "The Presiding Officer will attempt facial recognition. If both fail and you appear on the register, INEC procedure allows manual verification, but you cannot be turned away simply because the device misreads.",
  },
  {
    q: "Can I vote at any polling unit?",
    a: "No. You can only vote at the specific polling unit where you registered, indicated by the code on your PVC. Voting elsewhere is not permitted.",
  },
  {
    q: "What happens if my ballot is rejected?",
    a: "Ballots are rejected for double thumbprints, marks outside the box, or unstamped papers. You generally cannot get a replacement, so mark carefully — one clear thumbprint inside one box.",
  },
  {
    q: "Can I take photos at the polling unit?",
    a: "Yes — you may photograph the publicly pasted result sheet (Form EC8A) and the general environment, but not your own ballot inside the cubicle.",
  },
  {
    q: "Who can I report irregularities to?",
    a: "Report to the Presiding Officer first, then to accredited observers, INEC's situation room, the police, or independent monitors like Yiaga Africa. Document with photos and timestamps.",
  },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#00733a] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.18),transparent_55%)]"
      />
      <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-10 lg:py-24 xl:px-16">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/95 ring-1 ring-white/25 backdrop-blur">
            <Vote aria-hidden="true" className="h-3.5 w-3.5" />
            Election Resource · Voting Procedures
          </span>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]">
            Know the rules.{" "}
            <span className="rounded-md bg-white/15 px-2 py-1 text-white ring-1 ring-white/25">
              Cast
            </span>{" "}
            with confidence.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
            The official INEC voting procedure for the 2027 general elections — updated for the
            2026 cycle. Walk into your polling unit knowing exactly what happens, what to bring,
            and what your rights are.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#step-by-step"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-green shadow-[0_18px_40px_-16px_rgb(0_0_0/0.45)] transition hover:bg-brand-black hover:text-white"
            >
              See the steps
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <a
              href="#your-rights"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-transparent px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
            >
              Your rights
              <ChevronDown aria-hidden="true" className="h-4 w-4 transition group-hover:translate-y-0.5" />
            </a>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/15 pt-6 text-white sm:max-w-lg">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Voting opens</dt>
              <dd className="mt-1 text-2xl font-semibold leading-tight">8:30 AM</dd>
              <dd className="text-[11px] text-white/70">At every polling unit</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Voting closes</dt>
              <dd className="mt-1 text-2xl font-semibold leading-tight">2:30 PM</dd>
              <dd className="text-[11px] text-white/70">Queue counts</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Required</dt>
              <dd className="mt-1 text-2xl font-semibold leading-tight">PVC</dd>
              <dd className="text-[11px] text-white/70">No card, no vote</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-3xl bg-brand-green/40 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.55)] ring-1 ring-white/15">
            <img
              src={heroImage}
              alt="A Nigerian woman in a red hijab casting her ballot into a transparent INEC ballot box"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-4 bottom-4 flex h-px"
            >
              <span className="h-full flex-1 bg-white/60" />
              <span className="h-full flex-1 bg-white/30" />
              <span className="h-full flex-1 bg-brand-red/80" />
            </span>
          </div>
          <div className="absolute -bottom-6 left-4 right-4 mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-white p-4 text-brand-black shadow-[0_20px_50px_-20px_rgb(0_0_0/0.35)] ring-1 ring-black/5 sm:-bottom-8">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
              <Smile aria-hidden="true" className="h-5 w-5" />
            </span>
            <p className="text-[13px] leading-snug">
              <span className="font-semibold">Your vote is your voice.</span>{" "}
              <span className="text-brand-black/70">
                Show up early, follow the steps, protect the result.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcedureSection() {
  return (
    <section id="step-by-step" className="relative bg-[#fafaf7] text-brand-black">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28 xl:px-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-green">
              <span aria-hidden="true" className="h-px w-6 bg-brand-green" />
              2026 Update
            </span>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Official Election Voting Procedure
            </h2>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-brand-black/75">
              <p>
                Voting in Nigeria is governed by the <strong>Electoral Act 2026</strong> and
                administered by the <strong>Independent National Electoral Commission (INEC)</strong>.
                Since 2023, every polling unit uses the{" "}
                <strong>Bimodal Voter Accreditation System (BVAS)</strong> — a biometric device that
                reads your PVC and verifies your fingerprint or face before you can collect a
                ballot paper.
              </p>
              <p>
                Once polls close, results from each polling unit are recorded on Form EC8A,
                photographed by the Presiding Officer and uploaded directly to the INEC Result
                Viewing Portal (<strong>IReV</strong>) so any citizen can verify the score from
                their phone.
              </p>
              <p className="rounded-2xl border-l-4 border-brand-green bg-white p-5 text-[14px] text-brand-black/80 shadow-[0_12px_30px_-20px_rgb(0_0_0/0.18)]">
                <span className="font-semibold text-brand-black">No PVC, no BVAS, no vote.</span>{" "}
                If you are not biometrically accredited on the BVAS device, you cannot legally cast
                a ballot — even if your name is on the paper register.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="sticky top-24">
              <div className="overflow-hidden rounded-3xl bg-white p-3 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.25)] ring-1 ring-black/[0.05]">
                <img
                  src={stepByStepImage}
                  alt="An INEC official using the BVAS device to capture a voter's fingerprint at a polling unit"
                  className="block h-auto w-full rounded-2xl object-cover"
                />
              </div>
              <p className="mt-3 text-center text-[12px] text-brand-black/55">
                BVAS biometric accreditation in progress at a Nigerian polling unit.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h3 className="text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              The step-by-step process
            </h3>
            <p className="text-[14px] text-brand-black/60 sm:text-right">
              Six clear steps from arrival to result protection.
            </p>
          </div>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.n}
                  className="group relative overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-black/[0.06] transition hover:-translate-y-1 hover:shadow-[0_24px_50px_-26px_rgb(0_0_0/0.25)]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-6 top-0 h-[3px] rounded-b-full bg-gradient-to-r from-brand-green via-brand-black/20 to-brand-red opacity-70"
                  />
                  <div className="flex items-start justify-between">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green">
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <span className="text-[34px] font-bold leading-none text-brand-black/10">
                      {step.n}
                    </span>
                  </div>
                  <h4 className="mt-5 text-[17px] font-semibold leading-tight tracking-tight">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-brand-black/65">
                    {step.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function RightsSection() {
  return (
    <section id="your-rights" className="bg-white text-brand-black">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28 xl:px-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="relative">
            <div className="sticky top-24 overflow-hidden rounded-3xl bg-brand-green/10 p-3 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.2)] ring-1 ring-brand-green/15">
              <img
                src={rightsImage}
                alt="A Nigerian voter posting a ballot paper into a transparent INEC ballot box"
                className="block h-auto w-full rounded-2xl object-cover"
              />
            </div>
          </div>
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-green">
              <span aria-hidden="true" className="h-px w-6 bg-brand-green" />
              Your protections under the law
            </span>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Your rights as a voter.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-brand-black/65">
              The Electoral Act 2026 and the 1999 Constitution guarantee every accredited Nigerian
              voter the rights below. If any of them is violated at your polling unit, document it
              and report immediately.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {rights.map((r) => {
                const Icon = r.icon;
                return (
                  <div
                    key={r.title}
                    className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.06] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-22px_rgb(0_166_81/0.45)]"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <h3 className="mt-3 text-[15px] font-semibold leading-tight">{r.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-brand-black/65">
                      {r.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PVCNoteSection() {
  return (
    <section className="relative overflow-hidden bg-[#fafaf7] text-brand-black">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(ellipse_at_right,rgba(0,166,81,0.12),transparent_60%)]"
      />
      <div className="relative mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28 xl:px-16">
        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_30px_70px_-30px_rgb(0_0_0/0.22)] ring-1 ring-black/[0.05]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-red/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-red ring-1 ring-brand-red/20">
                <IdCard aria-hidden="true" className="h-3.5 w-3.5" />
                Important note
              </span>
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Use your PVC to locate your polling unit.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-brand-black/70">
                Look at the front of your Permanent Voter Card. The four-segment number printed
                next to <strong>CODE:</strong> is your <strong>polling unit code</strong> — it
                tells you exactly where you must vote. You cannot vote at any other polling unit.
              </p>

              <div className="mt-6 rounded-2xl border border-brand-green/20 bg-brand-green/[0.04] p-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-green">
                  How to read the code
                </p>
                <ul className="mt-3 space-y-2.5 text-[14px] leading-relaxed text-brand-black/80">
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-10 shrink-0 items-center justify-center rounded-md bg-brand-black text-[11px] font-bold text-white">
                      24
                    </span>
                    <span><strong>State</strong> — the first two digits identify your state.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-10 shrink-0 items-center justify-center rounded-md bg-brand-black text-[11px] font-bold text-white">
                      15
                    </span>
                    <span><strong>Local Government Area</strong> — the next two pinpoint your LGA.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-10 shrink-0 items-center justify-center rounded-md bg-brand-black text-[11px] font-bold text-white">
                      09
                    </span>
                    <span><strong>Registration Area / Ward</strong> — the third pair narrows you to your ward.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-12 shrink-0 items-center justify-center rounded-md bg-brand-green text-[11px] font-bold text-white">
                      039
                    </span>
                    <span><strong>Polling unit</strong> — the final three digits are your specific polling unit.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a
                  href="https://cvr.inecnigeria.org/pu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-green px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-brand-black"
                >
                  Find my polling unit
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
                <a
                  href="https://cvr.inecnigeria.org/vvs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-black/15 bg-white px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-black transition hover:border-brand-green hover:text-brand-green"
                >
                  Verify my registration
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="relative bg-[radial-gradient(ellipse_at_top_right,rgba(0,166,81,0.18),transparent_60%)] p-6 sm:p-8 lg:p-10">
              <div className="overflow-hidden rounded-2xl bg-white p-3 shadow-[0_24px_60px_-30px_rgb(0_0_0/0.3)] ring-1 ring-black/[0.05]">
                <img
                  src={pvcCodeImage}
                  alt="A sample Nigerian PVC with the polling unit code highlighted by an arrow"
                  className="block h-auto w-full rounded-xl"
                />
              </div>
              <p className="mt-3 text-center text-[12px] text-brand-black/55">
                The four-part code on the top-left of your PVC is your polling unit address.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BringSection() {
  return (
    <section className="bg-white text-brand-black">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-24 xl:px-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-brand-green/20 bg-brand-green/[0.04] p-7 sm:p-9">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/15 text-brand-green">
              <CheckCircle2 aria-hidden="true" className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-tight">
              What to bring on election day
            </h3>
            <p className="mt-2 text-[14px] text-brand-black/65">
              Pack the night before. Travel light, but be ready for a long, hot day.
            </p>
            <ul className="mt-5 space-y-3">
              {whatToBring.map((line) => (
                <li key={line} className="flex items-start gap-3 text-[14.5px] text-brand-black/85">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-green" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-brand-red/20 bg-brand-red/[0.04] p-7 sm:p-9">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-red/15 text-brand-red">
              <Ban aria-hidden="true" className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-tight">
              What you must NOT bring
            </h3>
            <p className="mt-2 text-[14px] text-brand-black/65">
              These items are prohibited at polling units and may disqualify your vote or get you
              arrested.
            </p>
            <ul className="mt-5 space-y-3">
              {whatNotToBring.map((line) => (
                <li key={line} className="flex items-start gap-3 text-[14.5px] text-brand-black/85">
                  <Ban aria-hidden="true" className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-red" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineSection() {
  const items = [
    { time: "8:00 AM", title: "Polling unit setup", body: "INEC officials arrive, set up cubicles and prepare the BVAS device." },
    { time: "8:30 AM", title: "Accreditation & voting begins", body: "The first voter is called forward. Queues form behind the polling unit signage." },
    { time: "2:30 PM", title: "Voting officially closes", body: "Anyone already in the queue at this time MUST be allowed to vote — do not leave the line." },
    { time: "After 2:30 PM", title: "Sorting, counting & announcement", body: "Ballots are sorted and counted in public. The result is announced and Form EC8A is signed." },
    { time: "Same day", title: "Upload to IReV", body: "The Presiding Officer photographs Form EC8A and uploads it directly from the BVAS to the IReV portal." },
  ] as const;

  return (
    <section className="bg-brand-black text-white">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28 xl:px-16">
        <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-green">
              <Clock aria-hidden="true" className="h-3.5 w-3.5" />
              Election day timeline
            </span>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              How the day is expected to unfolds at your polling unit.
            </h2>
          </div>
          <p className="text-[15px] leading-relaxed text-white/70">
            Times are uniform across all 176,846 polling units in Nigeria. Plan to arrive early and
            stay until the result is announced.
          </p>
        </div>

        <ol className="mt-12 relative border-l border-white/15 pl-6 sm:pl-8">
          {items.map((item, i) => (
            <li key={item.title} className={i === items.length - 1 ? "" : "pb-8"}>
              <span className="absolute -left-2.5 mt-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-green ring-4 ring-brand-black" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-green">
                {item.time}
              </p>
              <h3 className="mt-1 text-[17px] font-semibold leading-tight">{item.title}</h3>
              <p className="mt-1.5 max-w-3xl text-[14px] leading-relaxed text-white/70">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FAQItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  return (
    <details
      className="group rounded-2xl bg-white p-5 ring-1 ring-black/[0.06] transition hover:ring-brand-green/30 open:ring-brand-green/40"
      {...(defaultOpen ? { open: true } : {})}
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left text-[15px] font-semibold leading-snug tracking-tight text-brand-black [&::-webkit-details-marker]:hidden">
        <span>{q}</span>
        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green transition group-open:rotate-180 group-open:bg-brand-green group-open:text-white">
          <ChevronDown aria-hidden="true" className="h-4 w-4" />
        </span>
      </summary>
      <p className="mt-3 text-[14px] leading-relaxed text-brand-black/70">{a}</p>
    </details>
  );
}

function FAQSection() {
  return (
    <section className="bg-[#fafaf7] text-brand-black">
      <div className="mx-auto w-full max-w-[1100px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28 xl:px-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-green">
              <span aria-hidden="true" className="h-px w-6 bg-brand-green" />
              FAQ
            </span>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Voting day, answered.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-brand-black/65">
              Common questions Nigerians ask before heading to their polling unit. Still unsure?
              Talk to the OK Movement team.
            </p>
            <a
              href="/home/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-black/15 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-black transition hover:border-brand-green hover:text-brand-green"
            >
              Ask the team
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="grid gap-3">
            {faqs.map((f, i) => (
              <FAQItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function VotingProceduresPage() {
  useEffect(() => {
    document.title = "Voting Procedures · OK Movement";
  }, []);

  return (
    <main className="min-h-screen bg-white text-brand-black">
      <HomeSiteHeader />
      <HeroSection />
      <ProcedureSection />
      <RightsSection />
      <PVCNoteSection />
      <BringSection />
      <TimelineSection />
      <FAQSection />
      <HomeFooterSection />
    </main>
  );
}
