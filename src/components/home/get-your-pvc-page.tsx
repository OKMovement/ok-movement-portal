"use client";

import { useEffect, useState, type ComponentType, type SVGProps } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  Fingerprint,
  IdCard,
  MapPinned,
  Mail,
  Megaphone,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Vote,
} from "lucide-react";
import HomeSiteHeader from "./home-site-header";
import HomeFooterSection from "./home-footer-section";
const heroPortrait = "/assets/GET_PVC_1778603766490.png";
const pvcExplainer = "/assets/Gemini_Generated_Image_c9pt25c9pt25c9pt_1778604912217.png";

const NIGERIAN_STATES: readonly string[] = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
] as const;

type ActionCard = {
  id: string;
  label: string;
  title: string;
  description: string;
  href: string;
  external?: boolean;
  cta: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  accent: "green" | "red" | "black";
};

const actionCards: readonly ActionCard[] = [
  {
    id: "first-time-voter",
    label: "Brand new",
    title: "First Time Voter",
    description:
      "Just turned 18 or never registered before? Start your INEC voter registration in a few simple steps.",
    href: "https://cvr.inecnigeria.org/Home/start",
    external: true,
    cta: "Start registration",
    icon: UserPlus,
    accent: "green",
  },
  {
    id: "get-your-pvc",
    label: "Ready to collect",
    title: "Get Your PVC",
    description:
      "Find your collection centre and the documents you need to walk away with your card the same day.",
    href: "https://cvr.inecnigeria.org/locator",
    external: true,
    cta: "Find my centre",
    icon: IdCard,
    accent: "green",
  },
  {
    id: "check-status",
    label: "Already registered",
    title: "Check Your Voter Status",
    description:
      "Confirm that your name is on the roll, your polling unit is correct, and your PVC is ready.",
    href: "https://cvr.inecnigeria.org/vvs",
    external: true,
    cta: "Check my status",
    icon: SearchCheck,
    accent: "black",
  },
  {
    id: "relocated",
    label: "Moved address",
    title: "I Have Relocated",
    description:
      "Apply to transfer your registration to your new state, LGA or polling unit before the deadline.",
    href: "https://cvr.inecnigeria.org/Home/start",
    external: true,
    cta: "Start my transfer",
    icon: MapPinned,
    accent: "black",
  },
  {
    id: "lost-pvc",
    label: "Replacement",
    title: "I Have Lost My PVC / TVC",
    description:
      "Damaged, lost or stolen card? Request a replacement Permanent Voter Card from your INEC office.",
    href: "https://cvr.inecnigeria.org/Home/start",
    external: true,
    cta: "Request replacement",
    icon: AlertTriangle,
    accent: "red",
  },
] as const;

const accentClasses: Record<ActionCard["accent"], { iconBg: string; iconText: string; chip: string; cta: string }> = {
  green: {
    iconBg: "bg-brand-green/10",
    iconText: "text-brand-green",
    chip: "text-brand-green",
    cta: "bg-brand-green hover:bg-brand-black",
  },
  red: {
    iconBg: "bg-brand-red/10",
    iconText: "text-brand-red",
    chip: "text-brand-red",
    cta: "bg-brand-red hover:bg-brand-black",
  },
  black: {
    iconBg: "bg-brand-black/[0.06]",
    iconText: "text-brand-black",
    chip: "text-brand-black/70",
    cta: "bg-brand-black hover:bg-brand-green",
  },
};

const pvcFeatures: readonly { icon: ComponentType<SVGProps<SVGSVGElement>>; title: string; body: string }[] = [
  {
    icon: Fingerprint,
    title: "Biometric secured",
    body: "An embedded chip stores your fingerprints and facial data so no one else can vote in your name.",
  },
  {
    icon: ShieldCheck,
    title: "Mandatory at the polls",
    body: "Without a physical PVC you cannot be accredited. It is the sole legal proof of voter registration.",
  },
  {
    icon: IdCard,
    title: "Recognised ID",
    body: "Beyond elections, the PVC is widely accepted as a valid form of national identification.",
  },
];

const eligibilityChecks: readonly string[] = [
  "Nigerian citizen",
  "18 years and above",
  "Mentally sound",
  "Not legally barred from voting",
];

const collectionDocs: readonly string[] = [
  "Acknowledgement slip from CVR registration",
  "Any government-issued photo ID (NIN, driver's licence, int'l passport)",
  "Knowledge of your registration state, LGA and ward",
];

const faqs: readonly { q: string; a: string }[] = [
  {
    q: "Who is eligible to receive a PVC?",
    a: "Any Nigerian citizen who is 18 years or older, mentally sound and not under any legal disqualification can register and collect a PVC from INEC.",
  },
  {
    q: "Where do I collect my PVC?",
    a: "PVCs are issued at the INEC Local Government Area (LGA) office where you registered. During special collection windows INEC may decentralise to ward level — check INEC's announcements for your state.",
  },
  {
    q: "What documents do I need on collection day?",
    a: "Bring your acknowledgement slip from registration and a valid government-issued photo ID. If you registered during the latest CVR, your fingerprint or facial scan will also be used for verification.",
  },
  {
    q: "Can someone else collect my PVC for me?",
    a: "No. INEC requires the registered voter to appear in person so biometrics can be verified. Authorisation letters or third-party pickups are not accepted.",
  },
  {
    q: "I have moved to a new state. How do I transfer my registration?",
    a: "Apply for a transfer through INEC's online portal or visit the LGA office in your new location. You will need your old voter details and proof of new residence. Transfers must be completed before the official cut-off ahead of an election.",
  },
  {
    q: "I lost my PVC. What should I do?",
    a: "Report the loss at your nearest INEC LGA office and request a replacement. INEC may require an affidavit or police report. Your registration and biometrics remain valid — only the physical card is reissued.",
  },
  {
    q: "How long does it take to receive my PVC after registration?",
    a: "INEC typically prints PVCs in batches after each Continuous Voter Registration phase. Cards are usually ready 4–12 weeks after registration closes — INEC announces collection windows in each state.",
  },
  {
    q: "Is the PVC required for every election?",
    a: "Yes. Whether it is a local government, state assembly, governorship or presidential election, your PVC is the only accepted credential at the polling unit.",
  },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#00733a] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.18),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(ellipse_at_right,rgba(0,0,0,0.35),transparent_60%)]"
      />
      <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-10 lg:py-24 xl:px-16">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/95 ring-1 ring-white/25 backdrop-blur">
            <Vote aria-hidden="true" className="h-3.5 w-3.5" />
            Election Resource · PVC
          </span>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]">
            Your <span className="text-white">vote</span> begins with your{" "}
            <span className="rounded-md bg-white/15 px-2 py-1 text-white ring-1 ring-white/25">
              PVC
            </span>
            .
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
            The Permanent Voter Card is your only ticket to the ballot in every Nigerian election.
            Get yours, check your details and protect your right to choose Nigeria's future in 2027.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#action-cards"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-green shadow-[0_18px_40px_-16px_rgb(0_0_0/0.45)] transition hover:bg-brand-black hover:text-white"
            >
              Get started
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <a
              href="#what-is-pvc"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-transparent px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
            >
              What is a PVC?
              <ChevronDown aria-hidden="true" className="h-4 w-4 transition group-hover:translate-y-0.5" />
            </a>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/15 pt-6 text-white sm:max-w-lg">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Eligibility</dt>
              <dd className="mt-1 text-2xl font-semibold leading-tight">18+</dd>
              <dd className="text-[11px] text-white/70">Nigerian citizens</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Cost</dt>
              <dd className="mt-1 text-2xl font-semibold leading-tight">Free</dd>
              <dd className="text-[11px] text-white/70">Issued by INEC</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Validity</dt>
              <dd className="mt-1 text-2xl font-semibold leading-tight">Life</dd>
              <dd className="text-[11px] text-white/70">Until you transfer</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-3xl bg-brand-green/40 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.55)] ring-1 ring-white/15">
            <img
              src={heroPortrait}
              alt="A young Nigerian proudly displaying his Permanent Voter Card"
              className="absolute inset-0 h-full w-full object-cover object-right"
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
              <Sparkles aria-hidden="true" className="h-5 w-5" />
            </span>
            <p className="text-[13px] leading-snug">
              <span className="font-semibold">No PVC. No vote.</span>{" "}
              <span className="text-brand-black/70">
                Don&apos;t let anyone choose for you. Get yours today.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatIsPVCSection() {
  return (
    <section id="what-is-pvc" className="relative bg-[#fafaf7] text-brand-black">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-10 lg:py-28 xl:px-16">
        <div>
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-green">
            <span aria-hidden="true" className="h-px w-6 bg-brand-green" />
            About the card
          </span>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            What is a Permanent Voter Card?
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-brand-black/75">
            <p>
              The <strong>Permanent Voter Card (PVC)</strong> is the official identification document
              issued by the <strong>Independent National Electoral Commission (INEC)</strong> to
              Nigerian citizens aged 18 and older. It is the primary authorisation a citizen needs
              to exercise their right to vote in any local or national election.
            </p>
            <p>
              The card contains an embedded chip that stores your biometric data — including
              fingerprints and facial information — alongside your personal details, ensuring the
              integrity of every ballot cast in your name.
            </p>
            <p className="rounded-2xl border-l-4 border-brand-green bg-white p-5 text-[14px] text-brand-black/80 shadow-[0_12px_30px_-20px_rgb(0_0_0/0.18)]">
              <span className="font-semibold text-brand-black">The sole verification method.</span>{" "}
              Your PVC is the only official proof of identification accepted at a polling unit.
              Without it, or if it cannot be validated, you cannot cast your ballot.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {pvcFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.05] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-22px_rgb(0_166_81/0.45)]"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 text-[15px] font-semibold leading-tight">{feature.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-brand-black/65">
                    {feature.body}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-brand-green/20 bg-white p-5">
              <h4 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-green">
                Eligibility
              </h4>
              <ul className="mt-3 space-y-2">
                {eligibilityChecks.map((line) => (
                  <li key={line} className="flex items-start gap-2 text-[14px] text-brand-black/80">
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-brand-black/10 bg-white p-5">
              <h4 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-black/70">
                Take with you
              </h4>
              <ul className="mt-3 space-y-2">
                {collectionDocs.map((line) => (
                  <li key={line} className="flex items-start gap-2 text-[14px] text-brand-black/80">
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-black" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="sticky top-24">
            <div className="relative overflow-hidden rounded-3xl bg-white p-3 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.25)] ring-1 ring-black/[0.05]">
              <img
                src={pvcExplainer}
                alt="Anatomy of a Nigerian Permanent Voter Card showing the delimitation, name, date of birth, occupation, address, gender, VIN and other key fields"
                className="block h-auto w-full rounded-2xl"
              />
            </div>
            <p className="mt-3 text-center text-[12px] text-brand-black/55">
              Anatomy of your PVC — every field on the card explained.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActionCardsSection() {
  return (
    <section id="action-cards" className="bg-white text-brand-black">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28 xl:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-green">
            <span aria-hidden="true" className="h-px w-6 bg-brand-green" />
            Choose your path
            <span aria-hidden="true" className="h-px w-6 bg-brand-green" />
          </span>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Where are you on your PVC journey?
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-brand-black/65">
            Pick the option that best describes you. We&apos;ll guide you through the next step
            with the right INEC information and links.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {actionCards.map((card) => {
            const Icon = card.icon;
            const a = accentClasses[card.accent];
            return (
              <article
                key={card.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-black/[0.06] transition hover:-translate-y-1 hover:shadow-[0_24px_50px_-26px_rgb(0_0_0/0.25)]"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-6 top-0 h-[3px] rounded-b-full bg-gradient-to-r from-brand-green via-brand-black/20 to-brand-red opacity-70"
                />
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${a.iconBg} ${a.iconText}`}>
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <p className={`mt-4 text-[10px] font-semibold uppercase tracking-[0.24em] ${a.chip}`}>
                  {card.label}
                </p>
                <h3 className="mt-1 text-[17px] font-semibold leading-tight tracking-tight">
                  {card.title}
                </h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-brand-black/65">
                  {card.description}
                </p>
                <a
                  href={card.href}
                  {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`mt-5 inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-white transition ${a.cta}`}
                >
                  {card.cta}
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      icon: UserPlus,
      title: "Register with INEC",
      body: "Visit your nearest INEC office during the Continuous Voter Registration window or apply online.",
    },
    {
      icon: Fingerprint,
      title: "Capture biometrics",
      body: "Submit your fingerprints and facial scan. Your data is encrypted onto your card's secure chip.",
    },
    {
      icon: CreditCard,
      title: "Collect your PVC",
      body: "Return to the LGA office during the announced collection window to pick up your card in person.",
    },
    {
      icon: Vote,
      title: "Use it on election day",
      body: "Present your PVC at your polling unit to be accredited and cast your ballot.",
    },
  ] as const;

  return (
    <section className="bg-brand-black text-white">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28 xl:px-16">
        <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-green">
              <span aria-hidden="true" className="h-px w-6 bg-brand-green" />
              From start to ballot
            </span>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Four steps from registration to voting.
            </h2>
          </div>
          <p className="text-[15px] leading-relaxed text-white/70">
            Whether you&apos;re registering for the first time or replacing a lost card, the journey
            with INEC follows the same simple path. Here is what to expect.
          </p>
        </div>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="relative rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10 backdrop-blur"
              >
                <span className="absolute right-5 top-5 text-[40px] font-bold leading-none text-white/10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-green/15 text-brand-green ring-1 ring-brand-green/25">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[16px] font-semibold leading-tight">{step.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/70">{step.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function ComplaintSection() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      fullName: String(formData.get("fullName") ?? "").trim(),
      contact: String(formData.get("contact") ?? "").trim(),
      state: String(formData.get("state") ?? "").trim(),
      problem: String(formData.get("problem") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/pvc-complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setSubmitError(data?.error ?? "Unable to submit complaint right now.");
        return;
      }

      form.reset();
      setSubmitted(true);
    } catch {
      setSubmitError("Unable to submit complaint right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#fafaf7] text-brand-black">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[radial-gradient(ellipse_at_left,rgba(0,166,81,0.12),transparent_60%)]"
      />
      <div className="relative mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6 lg:px-10 lg:py-24 xl:px-16">
        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_30px_70px_-30px_rgb(0_0_0/0.22)] ring-1 ring-black/[0.05]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
            <div className="relative bg-gradient-to-br from-brand-black via-[#0a1f12] to-brand-green p-8 text-white sm:p-10 lg:p-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white ring-1 ring-white/20 backdrop-blur">
                <Megaphone aria-hidden="true" className="h-3.5 w-3.5" />
                Report a problem
              </span>
              <h2 className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Having problems collecting your PVC?
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-white/85">
                Tell us what happened at the INEC office — long queues, missing card, wrong details
                or staff misconduct. The OK Movement legal & advocacy team logs every report and
                escalates patterns to INEC leadership.
              </p>

              <ul className="mt-6 space-y-2.5 text-[13px] text-white/85">
                {[
                  "Provide your personal detail, location and describe your challenges",
                  "Your request will be reviewed by OK Movement coordinators",
                  "Patterns of obstruction are escalated to INEC and the press",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a
                  href="mailto:admin@okmovement.org"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-[13px] font-semibold ring-1 ring-white/15 transition hover:bg-white/15"
                >
                  <Mail aria-hidden="true" className="h-4 w-4 text-brand-green" />
                  admin@okmovement.org
                </a>
                <a
                  href="/home/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-[13px] font-semibold ring-1 ring-white/15 transition hover:bg-white/15"
                >
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-brand-green" />
                  Contact the team
                </a>
              </div>
            </div>

            <div className="p-8 sm:p-10 lg:p-12">
              {submitted ? (
                <div className="flex h-full min-h-[24rem] flex-col items-center justify-center text-center">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                    <CheckCircle2 aria-hidden="true" className="h-8 w-8" />
                  </span>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight">
                    Thank you — your report has been logged.
                  </h3>
                  <p className="mt-2 max-w-sm text-[14px] text-brand-black/65">
                    A coordinator will follow up with you by email or phone within 48 hours. Your
                    voice keeps INEC accountable.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-black/15 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-black transition hover:border-brand-green hover:text-brand-green"
                  >
                    Submit another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-4">
                  {submitError ? (
                    <p className="rounded-xl border border-brand-red/20 bg-brand-red/5 px-3 py-2 text-xs text-brand-red">
                      {submitError}
                    </p>
                  ) : null}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-black/60">
                      Your name <span className="text-brand-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="Adaeze Okafor"
                      className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[14px] outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-black/60">
                      Phone or email <span className="text-brand-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="contact"
                      required
                      placeholder="0803 000 0000 or you@email.com"
                      className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[14px] outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-black/60">
                      State
                    </label>
                    <select
                      name="state"
                      defaultValue=""
                      className="mt-2 w-full appearance-none rounded-xl border border-black/10 bg-white bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2300a651%22 stroke-width=%223%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[right_1rem_center] bg-no-repeat px-4 py-3 pr-10 text-[14px] outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
                    >
                      <option value="" disabled>
                        Select your state
                      </option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-black/60">
                      Describe the problem <span className="text-brand-red">*</span>
                    </label>
                    <textarea
                      name="problem"
                      required
                      rows={5}
                      placeholder="Tell us what happened. The more detail, the better we can help."
                      className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[14px] outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand-green px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_40px_-16px_rgb(0_166_81/0.55)] transition hover:bg-brand-black disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? "Submitting…" : "Submit complaint"}
                    {!submitting && (
                      <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    )}
                  </button>
                  <p className="text-center text-[11px] text-brand-black/50">
                    We never share your contact details with third parties without your
                    permission.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
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
    <section className="bg-white text-brand-black">
      <div className="mx-auto w-full max-w-[1100px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28 xl:px-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-green">
              <span aria-hidden="true" className="h-px w-6 bg-brand-green" />
              FAQ
            </span>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Common questions about your PVC.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-brand-black/65">
              Everything you need to know — from registration through collection to using your card
              on election day. Can&apos;t find your answer? Reach out to the OK Movement team.
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

function KeyDatesSection() {
  return (
    <section className="bg-[#0a1f12] text-white">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20 xl:px-16">
        <div className="mb-10 overflow-hidden rounded-3xl border border-brand-green/30 bg-gradient-to-br from-brand-green/15 via-white/[0.04] to-transparent p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-green text-white shadow-[0_18px_40px_-16px_rgb(0_166_81/0.65)]">
                <Megaphone aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-green/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-green ring-1 ring-brand-green/30">
                  Latest INEC announcement
                </span>
                <h3 className="mt-3 text-balance text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
                  CVR Phase 3 begins{" "}
                  <span className="text-brand-green">May 11, 2026</span>
                </h3>
                <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-white/75">
                  The Independent National Electoral Commission has announced that the third and
                  final phase of the nationwide Continuous Voter Registration will commence on
                  May&nbsp;11, 2026, as preparations intensify ahead of the 2027 general elections.
                </p>
              </div>
            </div>
            <a
              href="#action-cards"
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-white px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-green transition hover:bg-brand-green hover:text-white lg:self-auto"
            >
              Get registered
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-green">
              <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
              Mark your calendar
            </span>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Don&apos;t miss the next INEC window.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
              Continuous Voter Registration and PVC collection happen in time-limited phases. Sign
              up for our reminders so you never miss the date for your state.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("You're on the reminder list — we'll alert you before each INEC window opens.");
            }}
            className="flex flex-col gap-3 rounded-2xl bg-white/[0.05] p-5 ring-1 ring-white/10 backdrop-blur sm:flex-row sm:items-center"
          >
            <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/15 text-brand-green ring-1 ring-brand-green/25 sm:inline-flex">
              <Clock aria-hidden="true" className="h-5 w-5" />
            </span>
            <input
              type="email"
              required
              placeholder="Your email address"
              className="flex-1 rounded-xl border border-white/15 bg-transparent px-4 py-3 text-[14px] text-white placeholder:text-white/45 outline-none transition focus:border-brand-green"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-brand-green px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-brand-green"
            >
              Notify me
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function GetYourPvcPage() {
  useEffect(() => {
    document.title = "Get Your PVC · OK Movement";
  }, []);

  return (
    <main className="min-h-screen bg-white text-brand-black">
      <HomeSiteHeader />
      <HeroSection />
      <WhatIsPVCSection />
      <ActionCardsSection />
      <ComplaintSection />
      <FAQSection />
      <KeyDatesSection />
      <HomeFooterSection />
    </main>
  );
}
