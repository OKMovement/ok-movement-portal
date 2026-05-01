"use client";

import { ArrowUpRight, Quote, Sparkles } from "lucide-react";
import { homeCampaignSection, homeMovementSection } from "./home-data";
import HomeTestimonialMarquee from "./home-testimonial-marquee";
const peterObiPortrait = "/Peter.png";
const kwankwasoPortrait = "/Kwankwaso.png";

type TestimonialPair = {
  id: string;
  frontSrc: string;
  backSrc: string;
  alt: string;
};

// Only references files that actually exist in /public/answers/.
// When a topic only has one image the same file is used for both faces
// (so the flip animation still works without producing a broken image).
const ANSWER_PAIRS: TestimonialPair[] = [
  { id: "bad-governance", front: "bad-governance-1", back: "bad-governance-1", alt: "On Bad Governance" },
  { id: "change", front: "change-1", back: "change-1", alt: "On Change" },
  { id: "children", front: "children-1", back: "children-1", alt: "On Children & Education" },
  { id: "collective", front: "collective-1", back: "collective-1", alt: "On Collective Action" },
  { id: "corruption", front: "corruption-1", back: "corruption-2", alt: "On Corruption" },
  { id: "diaspora", front: "diaspora-1", back: "diaspora-1", alt: "On the Diaspora" },
  { id: "fight", front: "fight-1", back: "fight-2", alt: "On the Fight Ahead" },
  { id: "governance", front: "governance-1", back: "governance-2", alt: "On Governance" },
  { id: "leadership", front: "leadership-2", back: "leadership-3", alt: "On Leadership" },
  { id: "on-hope", front: "on-hope-1", back: "on-hope-1", alt: "On Hope" },
  { id: "on-youth", front: "on-youth-1", back: "on-youths-2", alt: "On the Youth" },
  { id: "potential", front: "potential-1", back: "potential-2", alt: "On Nigeria's Potential" },
  { id: "production", front: "production-1", back: "production-2", alt: "On Production" },
  { id: "progress", front: "progress-1", back: "progress-2", alt: "On Progress" },
  { id: "saving", front: "saving-1", back: "saving-2", alt: "On Saving Nigeria" },
  { id: "security", front: "security-1", back: "security-1", alt: "On Security" },
  { id: "borrowing", front: "borrowing-2", back: "borrowing-2", alt: "On Borrowing" },
  { id: "type", front: "type-1", back: "type-1", alt: "On the Type of Leaders We Need" },
].map(({ id, front, back, alt }) => ({
  id,
  frontSrc: `/answers/${front}.jpeg`,
  backSrc: `/answers/${back}.jpeg`,
  alt,
}));

type PrincipalCardProps = {
  imageSrc: string;
  name: string;
  badge: string;
  description: string;
  href: string;
  accent: "green" | "red";
};

const principals: PrincipalCardProps[] = [
  {
    imageSrc: peterObiPortrait,
    name: "Peter Obi",
    badge: "Discipline · Integrity · Service",
    description:
      "A reform-minded former governor known for prudent stewardship of public funds, evidence-based policy, and a relentless focus on production over consumption.",
    href: "/home/about/peter-obi",
    accent: "green",
  },
  {
    imageSrc: kwankwasoPortrait,
    name: "Rabiu Kwankwaso",
    badge: "Grassroots · Education · Empowerment",
    description:
      "A grassroots leader whose record in Kano centers on transformative human-capital investment — from free education to mass scholarships and women's empowerment.",
    href: "/home/about/rabiu-kwankwaso",
    accent: "red",
  },
];

function PrincipalCard({
  imageSrc,
  name,
  badge,
  description,
  href,
  accent,
}: PrincipalCardProps) {
  const accentBg = accent === "green" ? "bg-brand-green" : "bg-brand-red";
  const accentText = accent === "green" ? "text-brand-green" : "text-brand-red";
  const ringClass =
    accent === "green"
      ? "group-hover:ring-brand-green/30"
      : "group-hover:ring-brand-red/30";

  return (
    <a
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_24px_50px_-28px_rgb(0_0_0/0.35)] ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-[0_32px_60px_-24px_rgb(0_0_0/0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
    >
      <div
        className={`relative overflow-hidden ${accentBg} ring-1 transition ${ringClass}`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/[0.12] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-black/[0.18] blur-2xl"
        />
        <div className="relative flex aspect-[4/3] items-end justify-end px-6 pt-6">
          <img
            src={imageSrc}
            alt={`Portrait of ${name}`}
            className="h-full w-auto max-h-[22rem] object-contain object-right-bottom drop-shadow-[0_18px_30px_rgb(0_0_0/0.35)] transition duration-500 group-hover:scale-[1.02]"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-brand-black sm:text-[1.6rem]">
            {name}
          </h3>
          <p className={`mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${accentText}`}>
            {badge}
          </p>
        </div>
        <p className="text-sm leading-relaxed text-brand-black/70 sm:text-[15px]">
          {description}
        </p>
        <div className={`mt-auto inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] ${accentText}`}>
          About {name.split(" ")[0]}
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </a>
  );
}

export default function HomePrincipalsSection() {
  return (
    <section
      id={homeCampaignSection.id}
      aria-labelledby="principals-heading"
      className="relative overflow-hidden bg-[#fafaf7] py-16 text-brand-black sm:py-20 lg:py-28"
    >
      {/* Watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-0 flex select-none opacity-[0.05]"
      >
        <img
          src="/images/new-logo.png"
          alt=""
          className="h-full w-auto max-w-none object-contain object-right"
        />
      </div>

      {/* Ambient red glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 z-0 h-72 w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgb(224_40_40/0.10),transparent_70%)]"
      />

      <div className="relative z-10 mx-auto w-[min(100%-1.5rem,82rem)]">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-3">
            <span className="h-[2px] w-10 rounded-full bg-brand-green" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-red">
              {homeCampaignSection.eyebrow}
            </span>
            <span className="h-[2px] w-10 rounded-full bg-brand-red" />
          </div>
          <h2
            id="principals-heading"
            className="mt-5 text-balance text-4xl font-medium leading-[1.05] tracking-tight text-brand-black sm:text-5xl lg:text-[3.4rem]"
          >
            Meet the Leaders of the{" "}
            <span className="text-brand-green">OK Movement</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-brand-black/70 sm:text-lg">
            {homeCampaignSection.description}
          </p>
        </div>

        {/* Principal cards */}
        <div className="mt-12 grid gap-6 sm:gap-8 md:grid-cols-2 lg:mt-16">
          {principals.map((p) => (
            <PrincipalCard key={p.name} {...p} />
          ))}
        </div>

        {/* Quote / Issues sub-section */}
        {/* <div className="mt-20 lg:mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-green ring-1 ring-brand-green/20 shadow-sm">
              <Quote aria-hidden="true" className="h-3.5 w-3.5" />
              In Their Own Words
            </div>
            <h3 className="mt-5 text-balance text-3xl font-medium tracking-tight text-brand-black sm:text-4xl lg:text-[2.6rem]">
              Real positions on the issues defining{" "}
              <span className="text-brand-green">Nigeria's future</span>
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-balance text-base leading-relaxed text-brand-black/65 sm:text-[17px]">
              From governance and corruption to youth, security, and education —
              hear directly from Peter Obi and Rabiu Kwankwaso. Tap any card to
              flip and see more.
            </p>
          </div>

          <div className="relative mt-10 overflow-hidden rounded-3xl bg-white shadow-[0_30px_60px_-30px_rgb(0_0_0/0.25)] ring-1 ring-black/5 lg:mt-12">
            <div className="px-2 pb-6 pt-6 sm:px-4 sm:pb-8 sm:pt-8">
              <HomeTestimonialMarquee cards={ANSWER_PAIRS} />
            </div>
          </div>
        </div> */}

        {/* Get Involved closing CTA */}
        <div
          id="get-involved-movement"
          className="relative mt-20 overflow-hidden rounded-3xl bg-brand-green text-white shadow-[0_30px_60px_-30px_rgb(0_166_81/0.45)] lg:mt-24"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/[0.08] blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-black/[0.20] blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand-green via-white/70 to-brand-red"
          />

          <div className="relative grid gap-10 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-14 lg:px-16 lg:py-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white ring-1 ring-white/20 backdrop-blur">
                <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                Get Involved
              </div>
              <h3 className="mt-4 text-balance text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl lg:text-[2.6rem]">
                Be part of the rebirth. Join the movement.
              </h3>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                The OK Movement is committed to building stronger, more
                connected communities through advocacy, awareness, and
                collective action — with meaningful partnerships that empower
                Nigerians at the grassroots.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={homeMovementSection.ctaHref}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] border border-white/30 bg-white/10 px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white backdrop-blur transition hover:bg-white hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-h-[3.25rem]"
                >
                  Learn How
                </a>
              </div>
            </div>

            {/* Pillar stats grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { stat: "36", label: "States organized" },
                { stat: "120+", label: "Local chapters" },
                { stat: "25k", label: "Active volunteers" },
                { stat: "5 C's", label: "Of OK leadership" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-white/[0.10] p-4 ring-1 ring-white/15 backdrop-blur sm:p-5"
                >
                  <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {item.stat}
                  </p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white/75">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}