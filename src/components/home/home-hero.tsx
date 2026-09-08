"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Heart } from "lucide-react";

const heroDuoImage = "/assets/hero_duo_trimmed.png";
const ndcImage = "/assets/NDC_-_Peter_and_Kwankwaso_1_1778425496977.png";
const  duoImage = "/assets/obi_kwankwaso_duo_hires_trimmed.png";
// const heroImage = "/assets/For_Hero_Section_1777401527163.png";
// const ndcImage = "/assets/NDC_-_Peter_and_Kwankwaso_1_1778425496977.png";
// const pvcImage = "/assets/Get_your_voters_card_1778431731228.png";
import type { TestimonialPair } from "@/lib/get-testimonial-pairs";
import HomeDonationBanner from "./home-donation-banner";
import HomeFooterSection from "./home-footer-section";
import HomeOurMovementSection from "./home-our-movement-section";
import HomePrincipalsSection from "./home-principals-section";
import HomeSiteHeader from "./home-site-header";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
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

function HeroPrimaryActions() {
  return (
    <div className="mt-8 grid w-full max-w-[34rem] gap-3 sm:grid-cols-2">
      <Link
        href="/home/get-involved"
        className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-brand-green px-6 text-sm font-semibold text-white shadow-[0_16px_30px_-16px_rgb(0_166_81/0.65)] transition hover:-translate-y-0.5 hover:bg-brand-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-green"
      >
        Get Involved
        <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
      <Link
        href="/home/donations"
        className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-brand-red px-6 text-sm font-semibold text-white shadow-[0_16px_30px_-16px_rgb(224_40_40/0.65)] transition hover:-translate-y-0.5 hover:bg-brand-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-red"
      >
        <Heart aria-hidden="true" className="h-4 w-4 fill-current" />
        Donate to the Movement
      </Link>
    </div>
  );
}

interface HeroSlide {
  id: string;
  /** Light slides render on white backgrounds with dark text. */
  theme: "light" | "dark";
  eyebrow: string;
  headline: ReactNode;
  tagline: string;
  cta: ReactNode;
  /** Full-bleed desktop background node (image/gradients/overlays). */
  desktopBackground: ReactNode;
  /** Full literal Tailwind classes — accent color per slide. */
  accentChipClass: string;
  accentTaglineClass: string;
  accentDotActiveClass: string;
  /** Big ghost number rendered on desktop. */
  number: string;
  /** Optional secondary inline CTA shown under the primary CTA on this slide. */
  secondary?: ReactNode;
  /** Optional slide-specific mobile visual rendered between the tagline and the CTA. */
  mobileVisual?: ReactNode;
}

const SLIDES: HeroSlide[] = [
  {
    id: "new-dawn",
    theme: "light",
    number: "01",
    eyebrow: "Obi · Kwankwaso · 2027",
    accentChipClass: "border-emerald-600/35 bg-emerald-50/70 text-emerald-800",
    accentTaglineClass: "border-brand-green",
    accentDotActiveClass: "bg-brand-green shadow-[0_0_12px_rgb(0_166_81/0.6)]",
    headline: (
      <>
        <span className="text-brand-black">A</span>{" "}
        <span className="text-brand-green">
          New Dawn
        </span>
        <br />
        <span className="text-brand-black">in Nigeria</span>
      </>
    ),
    tagline:
      "The OK Movement unveils national and state structures to unite Nigerians, restore accountable leadership, and drive a true national rebirth.",
    cta: <HeroPrimaryActions />,
    desktopBackground: (
      <>
        {/* White poster base */}
        <div className="absolute inset-0 bg-white" />
        {/* Sunrise glow — the "new dawn" */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_115%,rgb(252_211_77/0.35)_0%,rgb(252_211_77/0.10)_35%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_12%_15%,rgb(0_166_81/0.14)_0%,transparent_50%)]" />
        {/* Oversized concentric rays */}
        <div className="absolute -bottom-[40rem] left-1/2 h-[80rem] w-[80rem] -translate-x-1/2 rounded-full border border-brand-black/[0.05]" />
        <div className="absolute -bottom-[30rem] left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full border border-brand-black/[0.06]" />
        <div className="absolute -bottom-[20rem] left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full border border-brand-black/[0.08]" />
        {/* Halftone texture */}
        <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(rgba(4,18,11,0.7)_1px,transparent_1px)] [background-size:26px_26px]" />
        {/* Leaders — full height right */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 hidden w-[62%] items-end justify-end lg:flex"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-16 bottom-0 top-24 rounded-full bg-[radial-gradient(ellipse_at_55%_70%,rgb(0_166_81/0.18)_0%,rgb(252_211_77/0.16)_45%,transparent_75%)] blur-3xl"
          />
          <img
            src={heroDuoImage}
            alt=""
            className="relative h-full w-full object-contain object-right-bottom drop-shadow-[0_40px_90px_rgba(4,18,11,0.30)]"
          />
        </div>
        {/* Text-side contrast */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent"
        />
        {/* Tricolor baseline */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 flex h-1.5">
          <span className="h-full flex-1 bg-brand-green" />
          <span className="h-full flex-1 bg-white" />
          <span className="h-full flex-1 bg-brand-red" />
        </div>
      </>
    ),
  },
  {
    id: "the-ticket",
    theme: "light",
    number: "02",
    eyebrow: "One Ticket · One Nigeria",
    accentChipClass: "border-emerald-600/35 bg-emerald-50/70 text-emerald-800",
    accentTaglineClass: "border-brand-green",
    accentDotActiveClass: "bg-brand-green shadow-[0_0_12px_rgb(0_166_81/0.6)]",
    headline: (
      <>
        <span className="text-brand-black">Two Leaders.</span>
        <br />
        <span className="text-brand-green">
          One Ticket.
        </span>
        <br />
        <span className="text-brand-black">One Nigeria.</span>
      </>
    ),
    tagline:
      "Peter Obi and Rabiu Kwankwaso — north and south, experience and integrity — standing together on a single ticket to rebuild Nigeria.",
    cta: <HeroPrimaryActions />,
    mobileVisual: (
      <div className="relative mt-7 w-full max-w-[21rem] lg:hidden">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgb(0_166_81/0.14)_0%,rgb(252_211_77/0.10)_50%,transparent_72%)] blur-2xl"
        />
        <img
          src={duoImage}
          alt="Peter Obi and Rabiu Kwankwaso"
          className="relative w-full drop-shadow-[0_24px_50px_rgba(4,18,11,0.22)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-1 h-28 bg-gradient-to-t from-white via-white/80 to-transparent"
        />
      </div>
    ),
    desktopBackground: (
      <>
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_70%,rgb(252_211_77/0.14)_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_12%_18%,rgb(0_166_81/0.12)_0%,transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(rgba(4,18,11,0.7)_1px,transparent_1px)] [background-size:24px_24px]" />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 hidden w-[68%] items-end justify-end lg:flex"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-16 bottom-0 top-24 rounded-full bg-[radial-gradient(ellipse_at_55%_70%,rgb(0_166_81/0.18)_0%,rgb(252_211_77/0.14)_45%,transparent_75%)] blur-3xl"
          />
          <img
            src={duoImage}
            alt=""
            className="relative h-full w-full object-contain object-right-bottom drop-shadow-[0_40px_90px_rgba(4,18,11,0.30)]"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent"
        />
      </>
    ),
  },
  {
    id: "ndc-opposition",
    theme: "light",
    number: "03",
    eyebrow: "NDC · True Opposition · 2027",
    accentChipClass: "border-sky-600/35 bg-sky-50/70 text-sky-800",
    accentTaglineClass: "border-sky-500",
    accentDotActiveClass: "bg-sky-500 shadow-[0_0_12px_rgb(14_165_233/0.6)]",
    headline: (
      <>
        <span className="text-brand-black">The Face of</span>
        <br />
        <span className="text-blue-700">
          True Opposition
        </span>
        <br />
        <span className="text-brand-black">in Nigeria</span>
      </>
    ),
    tagline:
      "Our two principals has finally aligned with the Nigeria Democratic Congress (NDC) to form a formidable opposition that will drive the new Nigeria we all desire.",
    cta: <HeroPrimaryActions />,
    desktopBackground: (
      <>
        <div className="absolute inset-0 bg-white" />
        <img
          src={ndcImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-right"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/20"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_55%,rgb(96_165_250/0.14)_0%,transparent_55%)]"
        />
      </>
    ),
  },
];


function HeroStats({ isLight }: { isLight: boolean }) {
  const stats = [
    { value: "36", label: "States organized" },
    { value: "120+", label: "Local chapters" },
    { value: "25k", label: "Active volunteers" },
  ];
  return (
    <div
      className={`absolute inset-x-0 bottom-0 z-20 hidden border-t backdrop-blur-[2px] lg:block ${
        isLight
          ? "border-brand-black/10 bg-gradient-to-t from-white/70 via-white/35 to-transparent"
          : "border-white/10 bg-gradient-to-t from-black/55 via-black/25 to-transparent"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-3 px-24 py-5">
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            className={`flex items-baseline gap-3 ${
              idx > 0 ? (isLight ? "border-l border-brand-black/10 pl-8" : "border-l border-white/10 pl-8") : ""
            }`}
          >
            <span
              className={`text-3xl font-medium tracking-tight ${isLight ? "text-brand-black" : "text-white"}`}
            >
              {stat.value}
            </span>
            <span
              className={`text-sm uppercase tracking-[0.14em] ${
                isLight ? "text-neutral-600" : "text-white/70"
              }`}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

type HomeHeroProps = {
  testimonialPairs: TestimonialPair[];
};

export default function HomeHero({ testimonialPairs }: HomeHeroProps) {
 const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeSlideId = SLIDES[activeSlide]?.id;
  const isLight = SLIDES[activeSlide]?.theme === "light";

  useEffect(() => {
    if (isPaused || SLIDES.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsPaused(false);
        }}
        aria-roledescription="carousel"
        aria-label="OK Movement hero slideshow"
      >
        {/* MOBILE / TABLET — designed backgrounds (no photo) — slide-aware */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-700 ease-out lg:hidden ${
            activeSlideId === "new-dawn" ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-white" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_115%,rgb(252_211_77/0.30)_0%,rgb(252_211_77/0.08)_35%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_12%_15%,rgb(0_166_81/0.14)_0%,transparent_50%)]" />
          <div className="absolute -bottom-[24rem] left-1/2 h-[48rem] w-[48rem] -translate-x-1/2 rounded-full border border-brand-black/[0.06]" />
          <div className="absolute -bottom-[16rem] left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full border border-brand-black/[0.08]" />
          <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(rgba(4,18,11,0.7)_1px,transparent_1px)] [background-size:26px_26px]" />
          <div className="absolute inset-x-0 bottom-0 flex h-1.5">
            <span className="h-full flex-1 bg-brand-green" />
            <span className="h-full flex-1 bg-white" />
            <span className="h-full flex-1 bg-brand-red" />
          </div>
        </div>

        {/* MOBILE / TABLET — ticket slide background (white + green/gold tints) */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-700 ease-out lg:hidden ${
            activeSlideId === "the-ticket" ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-white" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_8%,rgb(0_166_81/0.14)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_88%_18%,rgb(252_211_77/0.16)_0%,transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_92%_88%,rgb(224_40_40/0.08)_0%,transparent_45%)]" />
          <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(rgba(4,18,11,0.7)_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        {/* MOBILE / TABLET — NDC slide background (white + light blue) */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-700 ease-out lg:hidden ${
            activeSlideId === "ndc-opposition" ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-white" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_8%,rgb(96_165_250/0.20)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_88%_18%,rgb(125_211_252/0.16)_0%,transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_92%_88%,rgb(59_130_246/0.12)_0%,transparent_45%)]" />
          <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(rgba(7,11,46,0.6)_1px,transparent_1px)] [background-size:22px_22px]" />
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
            {slide.desktopBackground}
          </div>
        ))}

        {/* Shared edge fades (top/bottom) on desktop — dark slides only */}
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 hidden h-32 bg-gradient-to-b from-brand-black/70 to-transparent transition-opacity duration-700 lg:block ${
            isLight ? "opacity-0" : "opacity-100"
          }`}
        />
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-brand-black/75 to-transparent transition-opacity duration-700 lg:block ${
            isLight ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Slide content (cross-fades) */}
        <div className="relative z-10 mx-auto flex w-[min(100%-2rem,80rem)] flex-col pb-16 pt-12 sm:pb-20 sm:pt-14 lg:min-h-[54rem] lg:justify-center lg:pb-28 lg:pt-24">
          {/* MOBILE-only LIVE chip */}
          <div className="lg:hidden">
            <span
              className={`inline-flex items-center gap-2.5 rounded-full border px-3 py-1.5 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.45)] backdrop-blur ${
                isLight ? "border-brand-black/10 bg-brand-black/[0.04]" : "border-white/15 bg-white/[0.06]"
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-green shadow-[0_0_10px_rgb(0_166_81/0.9)]" />
              </span>
              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${
                  isLight ? "text-brand-black/80" : "text-white/90"
                }`}
              >
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
                  inert={!isActive}
                  aria-roledescription="slide"
                  aria-label={`Slide ${idx + 1} of ${SLIDES.length}`}
                  className={`max-w-2xl transition-all duration-700 ease-out ${
                    isActive
                      ? "relative opacity-100 translate-y-0"
                      : "pointer-events-none absolute inset-0 opacity-0 -translate-y-2"
                  }`}
                >
                  {/* Eyebrow chip */}
                  <span
                    className={`inline-flex items-center gap-3 rounded-full border bg-white/[0.04] px-4 py-1.5 backdrop-blur ${slide.accentChipClass}`}
                  >
                    <TricolorRule />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.34em] sm:text-[11px]">
                      {slide.eyebrow}
                    </span>
                  </span>

                  <h1 className="mt-6 text-left text-[3.25rem] font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-[5.5rem]">
                    {slide.headline}
                  </h1>

                  <p
                    className={`mt-6 max-w-[34rem] border-l-2 pl-4 text-left text-base leading-relaxed sm:text-lg lg:text-xl ${
                      slide.theme === "light" ? "text-neutral-700" : "text-white/85"
                    } ${slide.accentTaglineClass}`}
                  >
                    {slide.tagline}
                  </p>

                  {slide.mobileVisual}

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
                          className="relative overflow-hidden rounded-2xl border border-brand-black/10 bg-white/70 px-3 py-3.5 text-center backdrop-blur-md"
                        >
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-brand-green/40 to-transparent"
                          />
                          <div className="text-2xl font-semibold tracking-tight text-brand-black">
                            {stat.value}
                          </div>
                          <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
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

          {/* Slideshow controls */}
          <div className="relative z-30 mt-8 flex items-center gap-4 lg:absolute lg:bottom-28 lg:right-10 lg:mt-0 lg:justify-end">
            <button
              type="button"
              aria-label="Previous slide"
              data-testid="button-hero-prev"
              onClick={() => goTo(activeSlide - 1)}
              className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition ${
                isLight
                  ? "border-brand-black/15 bg-brand-black/[0.04] text-brand-black/70 hover:border-brand-black/40 hover:text-brand-black"
                  : "border-white/20 bg-white/[0.06] text-white/80 hover:border-white/45 hover:text-white"
              }`}
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>
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
                        ? `w-8 ${slide.accentDotActiveClass}`
                        : isLight
                          ? "w-3 bg-brand-black/20 hover:bg-brand-black/40"
                          : "w-3 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                );
              })}
            </div>
            <button
              type="button"
              aria-label="Next slide"
              data-testid="button-hero-next"
              onClick={() => goTo(activeSlide + 1)}
              className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition ${
                isLight
                  ? "border-brand-black/15 bg-brand-black/[0.04] text-brand-black/70 hover:border-brand-black/40 hover:text-brand-black"
                  : "border-white/20 bg-white/[0.06] text-white/80 hover:border-white/45 hover:text-white"
              }`}
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>

        <HeroStats isLight={isLight} />
      </section>
      <HomeOurMovementSection />
      <HomePrincipalsSection testimonialPairs={testimonialPairs} />
      <HomeDonationBanner />
      <HomeFooterSection />
    </main>
  );
}
