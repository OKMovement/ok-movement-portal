"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
const heroImage = "/assets/For_Hero_Section_1777401527163.png";
const ndcImage = "/assets/NDC_-_Peter_and_Kwankwaso_1_1778425496977.png";
const pvcImage = "/assets/Get_your_voters_card_1778431731228.png";
import type { TestimonialPair } from "@/lib/get-testimonial-pairs";
import HomeFooterSection from "./home-footer-section";
import HomeOurMovementSection from "./home-our-movement-section";
import HomePrincipalsSection from "./home-principals-section";
import HomeSignupForm from "./home-signup-form";
import HomeSiteHeader from "./home-site-header";
import { ReactNode, useEffect, useState } from "react";
const SLIDE_INTERVAL_MS = 4000;

function TricolorRule() {
  return (
    <span aria-hidden="true" className="flex h-[2px] w-16 overflow-hidden rounded-full">
      <span className="h-full flex-1 bg-brand-green" />
      <span className="h-full flex-1 bg-white/70" />
      <span className="h-full flex-1 bg-brand-red" />
    </span>
  );
}

function HeroSignupCard() {
  return (
    <div className="mt-8 w-full max-w-[34rem]">
      <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-3 backdrop-blur-md shadow-[0_30px_60px_-20px_rgb(0_0_0/0.55)] sm:p-4">
        <div className="mb-3 flex items-center gap-2 px-2 sm:px-3">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brand-green" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
            Join the movement
          </p>
        </div>
        <HomeSignupForm
          formIdPrefix="hero"
          submitLabel="Get Involved"
          ariaLabel="Get involved"
          className="w-full"
          buttonClassName="bg-brand-green hover:bg-brand-green/90 shadow-[0_18px_36px_-10px_rgb(0_166_81/0.55)]"
        />
      </div>
      <p className="mt-3 flex items-center gap-2 px-1 text-[12px] leading-relaxed text-white/75">
        <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-white/65" />
        <span>Your details are private. We never sell or share your information.</span>
      </p>
    </div>
  );
}
function PvcCallToAction() {
  return (
    <div className="mt-8 flex w-full max-w-[34rem] flex-col gap-4">
      <a
        href="https://www.inecnigeria.org/guidelines-for-registration/"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex w-fit items-center gap-3 rounded-full bg-brand-green px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_22px_46px_-14px_rgb(0_166_81/0.7)] transition hover:bg-white hover:text-brand-black sm:px-8 sm:py-4 sm:text-[13px]"
      >
        Start the Process Today
        <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </a>
      <p className="flex items-center gap-2 text-[12px] leading-relaxed text-white/75">
        <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-white/65" />
        <span>Your PVC, Your Voice, Your Power!</span>
      </p>
    </div>
  );
}
function NdcCallToAction() {
  return (
    <div className="mt-8 flex w-full max-w-[34rem] flex-col gap-4">
      <a
        href="https://membership.ndcnigeria.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex w-fit items-center gap-3 rounded-full bg-brand-green px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_22px_46px_-14px_rgb(0_166_81/0.7)] transition hover:bg-white hover:text-brand-black sm:px-8 sm:py-4 sm:text-[13px]"
      >
        Join the NDC Now
        <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </a>
      <p className="flex items-center gap-2 text-[12px] leading-relaxed text-white/75">
        <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-white/65" />
        <span>Nigeria Democratic Congress · The new opposition platform.</span>
      </p>
    </div>
  );
}

interface HeroSlide {
  id: string;
  eyebrow: string;
  headline: ReactNode;
  tagline: string;
  cta: ReactNode;
  desktopImage: string;
  desktopImageObjectClass: string;
  desktopOverlay: ReactNode;
  /** Optional secondary inline CTA shown under the primary CTA on this slide. */
  secondary?: ReactNode;
}
function HeroStats() {
  const stats = [
    { value: "36", label: "States organized" },
    { value: "120+", label: "Local chapters" },
    { value: "25k", label: "Active volunteers" },
  ];
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 hidden border-t border-white/10 bg-gradient-to-t from-black/55 via-black/25 to-transparent backdrop-blur-[2px] lg:block">
      <div className="mx-auto grid max-w-7xl grid-cols-3 px-24 py-5">
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            className={`flex items-baseline gap-3 ${idx > 0 ? "border-l border-white/10 pl-8" : ""}`}
          >
            <span className="text-3xl font-medium tracking-tight text-white">{stat.value}</span>
            <span className="text-sm uppercase tracking-[0.14em] text-white/70">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
const SLIDES: HeroSlide[] = [
  {
    id: "new-dawn",
    eyebrow: "Obi · Kwankwaso · 2027",
    headline: (
      <>
        A
        <br />
        <span className="bg-gradient-to-r from-white via-emerald-50 to-emerald-200 bg-clip-text text-transparent drop-shadow-[0_2px_18px_rgba(0,166,81,0.35)]">
          New Dawn
        </span>
        <br />
        <span className="text-white/90">in Nigeria</span>
      </>
    ),
    tagline:
      "The OK Movement unveils national and state structures to unite Nigerians, restore accountable leadership, and drive a true national rebirth.",
    cta: <HeroSignupCard />,
    desktopImage: heroImage,
    desktopImageObjectClass: "object-cover object-right",
    desktopOverlay: (
      <>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-brand-black/90 via-brand-black/60 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_55%,rgb(0_166_81/0.28)_0%,transparent_55%)]"
        />
      </>
    ),
    secondary: (
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/80">
        <a
          href="#movement-heading"
          className="group inline-flex items-center gap-2 font-medium text-white transition hover:text-emerald-200"
        >
          Learn about our movement
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </a>
        <span className="hidden h-3 w-px bg-white/20 sm:inline-block" />
        <span className="text-white/60">A people-powered campaign for 2027.</span>
      </div>
    ),
  },
  {
    id: "ndc-opposition",
    eyebrow: "NDC · True Opposition · 2027",
    headline: (
      <>
        <span className="text-white/90">The</span>
        <br />
        <span className="text-white/90">Face of True</span>
        <br />
        <span className="bg-gradient-to-r from-white via-emerald-50 to-emerald-200 bg-clip-text text-transparent drop-shadow-[0_2px_18px_rgba(0,166,81,0.35)]">
          Opposition
        </span>
        <br />
        <span className="text-white/90">in Nigeria</span>
      </>
    ),
    tagline:
      "Our two principals has finally aligned with the Nigeria Democratic Congress (NDC) to form a formidable opposition that will drive the new Nigeria we all desire.",
    cta: <NdcCallToAction />,
    desktopImage: ndcImage,
    desktopImageObjectClass: "object-cover object-right",
    desktopOverlay: (
      <>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#0b0f3a]/95 via-[#0b0f3a]/65 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_55%,rgb(0_166_81/0.22)_0%,transparent_55%)]"
        />
      </>
    ),
  },
  {
    id: "pvc-power",
    eyebrow: "Your Vote · Your Power · 2027",
    headline: (
      <>
        <span className="text-white/90">Have</span>
        <br />
        <span className="text-white/90">You Got Your</span>
        <br />
        <span className="bg-gradient-to-r from-white via-emerald-50 to-emerald-200 bg-clip-text text-transparent drop-shadow-[0_2px_18px_rgba(0,166,81,0.35)]">
          Permanent
        </span>
        <br />
        <span className="text-white/90">Voter Card (PVC)?</span>
      </>
    ),
    tagline:
      "It is time to register to get your Permanent Voter Card (PVC). Remember your PVC is your power to secure the new Nigeria we all desire.",
    cta: <PvcCallToAction />,
    desktopImage: pvcImage,
    desktopImageObjectClass: "object-cover object-right",
    desktopOverlay: (
      <>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#04331a]/95 via-[#04331a]/55 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_55%,rgb(0_166_81/0.30)_0%,transparent_55%)]"
        />
      </>
    ),
  },
];
type HomeHeroProps = {
  testimonialPairs: TestimonialPair[];
};

export default function HomeHero({ testimonialPairs }: HomeHeroProps) {
     const [activeSlide, setActiveSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
  
    useEffect(() => {
      if (isPaused || SLIDES.length <= 1) return;
      const id = window.setInterval(() => {
        setActiveSlide((i) => (i + 1) % SLIDES.length);
      }, SLIDE_INTERVAL_MS);
      return () => window.clearInterval(id);
    }, [isPaused]);
  
    function goTo(index: number) {
      setActiveSlide(((index % SLIDES.length) + SLIDES.length) % SLIDES.length);
    }
  return (
    <main className="min-h-screen bg-white text-white">
      <HomeSiteHeader />
        <section
        id="home-hero"
        className="relative isolate overflow-hidden bg-brand-black lg:min-h-[54rem]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-roledescription="carousel"
        aria-label="OK Movement hero slideshow"
      >
        {/* MOBILE / TABLET — designed backgrounds (no photo) — slide-aware */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-700 ease-out lg:hidden ${
            activeSlide === 0 ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_8%,rgb(0_166_81/0.45)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_88%_18%,rgb(0_166_81/0.18)_0%,transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_92%_88%,rgb(224_40_40/0.22)_0%,transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgb(255_255_255/0.05)_0%,transparent_60%)]" />
          <div
            className="absolute inset-0 opacity-[0.10] [background-image:radial-gradient(rgba(255,255,255,0.55)_1px,transparent_1px)] [background-size:22px_22px]"
          />
          <div className="absolute -top-10 right-[-3rem] h-[3px] w-72 -rotate-[18deg] rounded-full opacity-60 blur-[0.5px]">
            <span className="absolute inset-0 flex">
              <span className="h-full flex-1 bg-brand-green" />
              <span className="h-full flex-1 bg-white/60" />
              <span className="h-full flex-1 bg-brand-red" />
            </span>
          </div>
          <div className="absolute left-1/2 top-[28%] h-72 w-72 -translate-x-1/2 rounded-full bg-[conic-gradient(from_140deg,rgb(0_166_81/0.18),transparent_45%,rgb(224_40_40/0.10),transparent_85%)] blur-2xl" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-brand-black via-brand-black/55 to-transparent" />
        </div>

        {/* MOBILE / TABLET — PVC slide background (deep green + emerald glows) */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-700 ease-out lg:hidden ${
            activeSlide === 2 ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#02220f_0%,#053d1c_45%,#0a6b32_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_8%,rgb(16_185_129/0.55)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_88%_18%,rgb(110_231_183/0.30)_0%,transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_92%_88%,rgb(0_166_81/0.35)_0%,transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgb(255_255_255/0.06)_0%,transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.10] [background-image:radial-gradient(rgba(220,252,231,0.55)_1px,transparent_1px)] [background-size:22px_22px]" />
          <div className="absolute left-1/2 top-[28%] h-72 w-72 -translate-x-1/2 rounded-full bg-[conic-gradient(from_140deg,rgb(0_166_81/0.28),transparent_45%,rgb(187_247_208/0.14),transparent_85%)] blur-2xl" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-brand-black via-brand-black/55 to-transparent" />
        </div>

        {/* MOBILE / TABLET — NDC slide background (dark + light blue) */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-700 ease-out lg:hidden ${
            activeSlide === 1 ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Deep navy base */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#070b2e_0%,#0b1450_45%,#142a8a_100%)]" />
          {/* Light-blue glow top-left */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_8%,rgb(96_165_250/0.55)_0%,transparent_55%)]" />
          {/* Sky-blue accent top-right */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_88%_18%,rgb(125_211_252/0.30)_0%,transparent_45%)]" />
          {/* Indigo glow bottom-right */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_92%_88%,rgb(59_130_246/0.28)_0%,transparent_45%)]" />
          {/* Soft white center wash */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgb(255_255_255/0.06)_0%,transparent_60%)]" />
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-[0.10] [background-image:radial-gradient(rgba(186,230,253,0.55)_1px,transparent_1px)] [background-size:22px_22px]" />
          {/* Conic shimmer in blues */}
          <div className="absolute left-1/2 top-[28%] h-72 w-72 -translate-x-1/2 rounded-full bg-[conic-gradient(from_140deg,rgb(96_165_250/0.22),transparent_45%,rgb(186_230_253/0.12),transparent_85%)] blur-2xl" />
          {/* Bottom transition into next section */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-brand-black via-brand-black/55 to-transparent" />
        </div>

        {/* DESKTOP — cinematic backgrounds (cross-fading slides) */}
        {SLIDES.map((slide, idx) => (
          <div
            key={`bg-${slide.id}`}
            aria-hidden="true"
            className={`absolute inset-0 hidden transition-opacity duration-700 ease-out lg:block ${
              idx === activeSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.desktopImage}
              alt=""
              className={`absolute inset-0 h-full w-full ${slide.desktopImageObjectClass}`}
            />
            {slide.desktopOverlay}
          </div>
        ))}

        {/* Shared edge fades (top/bottom) on desktop */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 hidden h-32 bg-gradient-to-b from-brand-black/70 to-transparent lg:block"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-brand-black/75 to-transparent lg:block"
        />

        {/* Slide content (cross-fades) */}
        <div className="relative z-10 mx-auto flex w-[min(100%-2rem,80rem)] flex-col pb-16 pt-12 sm:pb-20 sm:pt-14 lg:min-h-[54rem] lg:justify-center lg:pb-28 lg:pt-24">
          {/* MOBILE-only LIVE chip */}
          <div className="lg:hidden">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.45)] backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-green shadow-[0_0_10px_rgb(0_166_81/0.9)]" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/90">
                Official · 2027 Campaign
              </span>
            </span>
          </div>

          {/* Slide stack */}
          <div className="relative mt-5 lg:mt-0">
            {SLIDES.map((slide, idx) => {
              const isActive = idx === activeSlide;
              return (
                <article
                  key={slide.id}
                  aria-hidden={!isActive}
                  aria-roledescription="slide"
                  aria-label={`Slide ${idx + 1} of ${SLIDES.length}`}
                  className={`max-w-2xl transition-all duration-700 ease-out ${
                    isActive
                      ? "relative opacity-100 translate-y-0"
                      : "pointer-events-none absolute inset-0 opacity-0 -translate-y-2"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <TricolorRule />
                    <p className="text-[11px] font-medium uppercase tracking-[0.46em] text-white/80">
                      {slide.eyebrow}
                    </p>
                  </div>

                  <h1 className="mt-5 text-left text-[3.25rem] font-medium leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-[5.75rem]">
                    {slide.headline}
                  </h1>

                  <p className="mt-6 max-w-[34rem] text-left text-base leading-relaxed text-white/85 sm:text-lg lg:text-xl">
                    {slide.tagline}
                  </p>

                  {/* MOBILE-only momentum stat strip — only on first slide */}
                  {idx === 0 ? (
                    <div className="mt-7 grid grid-cols-3 gap-2.5 lg:hidden">
                      {[
                        { value: "36", label: "States" },
                        { value: "120+", label: "Chapters" },
                        { value: "25k", label: "Volunteers" },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3.5 text-center backdrop-blur-md"
                        >
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          />
                          <div className="text-2xl font-semibold tracking-tight text-white">
                            {stat.value}
                          </div>
                          <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {slide.cta}
                  {slide.secondary}
                </article>
              );
            })}
          </div>

          {/* Slideshow controls — dot indicators only */}
          <div className="relative z-30 mt-8 flex items-center gap-3 lg:absolute lg:bottom-28 lg:right-10 lg:mt-0 lg:justify-end">
            <div className="flex items-center gap-2" role="tablist" aria-label="Slide selector">
              {SLIDES.map((slide, idx) => {
                const isActive = idx === activeSlide;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Go to slide ${idx + 1}`}
                    onClick={() => goTo(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-8 bg-brand-green shadow-[0_0_12px_rgb(0_166_81/0.6)]"
                        : "w-3 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <HeroStats />
      </section>
      <HomeOurMovementSection />
      <HomePrincipalsSection testimonialPairs={testimonialPairs} />
      <HomeFooterSection />
    </main>
  );
}