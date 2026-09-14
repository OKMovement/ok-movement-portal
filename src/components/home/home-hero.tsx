"use client";

import { ArrowRight, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import type { TestimonialPair } from "@/lib/get-testimonial-pairs";
import HomeDonationBanner from "./home-donation-banner";
import HomeFooterSection from "./home-footer-section";
import HomeOurMovementSection from "./home-our-movement-section";
import HomePrincipalsSection from "./home-principals-section";
import HomeSiteHeader from "./home-site-header";

const SLIDE_INTERVAL_MS = 7000;

const heroDuoImage = "/assets/hero_duo_trimmed.png";
const duoImage = "/assets/obi_kwankwaso_duo_hires_trimmed.png";
const ndcImage = "/assets/NDC_-_Peter_and_Kwankwaso_1_1778425496977.png";

type HeroSlide = {
  id: string;
  /** Two-digit index printed in the gutter — the slides are an ordered sequence. */
  index: string;
  eyebrow: string;
  headline: ReactNode;
  /** Plain-text mirror of `headline`, announced when the slide changes. */
  headlineText: string;
  tagline: string;
  /** Cut-out PNGs sit on the paper; photographs bleed and are feathered. */
  image: { src: string; position: string; fit: "contain" | "cover" };
  /** Only the opening slide carries the sunrise wash; it is literally about dawn. */
  dawnWash?: boolean;
};

const SLIDES: HeroSlide[] = [
  {
    id: "new-dawn",
    index: "01",
    eyebrow: "Obi · Kwankwaso · 2027",
    headlineText: "A New Dawn in Nigeria",
    headline: (
      <>
        A <span className="text-green-deep">New Dawn</span>
        <br />
        in Nigeria
      </>
    ),
    tagline:
      "The OK Movement unveils national and state structures to unite Nigerians, restore accountable leadership, and drive a true national rebirth.",
    image: { src: heroDuoImage, position: "right bottom", fit: "contain" },
    dawnWash: true,
  },
  {
    id: "the-ticket",
    index: "02",
    eyebrow: "One ticket · One Nigeria",
    headlineText: "Two leaders. One ticket. One Nigeria.",
    headline: (
      <>
        Two leaders.
        <br />
        <span className="text-green-deep">One ticket.</span>
        <br />
        One Nigeria.
      </>
    ),
    tagline:
      "Peter Obi and Rabiu Kwankwaso — north and south, experience and integrity — standing together on a single ticket to rebuild Nigeria.",
    image: { src: duoImage, position: "right bottom", fit: "contain" },
  },
  {
    id: "ndc-opposition",
    index: "03",
    eyebrow: "NDC · True opposition · 2027",
    headlineText: "The face of true opposition in Nigeria",
    headline: (
      <>
        The face of
        <br />
        <span className="text-green-deep">true opposition</span>
        <br />
        in Nigeria
      </>
    ),
    tagline:
      "Our two principals have aligned with the Nigeria Democratic Congress to form a formidable opposition and drive the new Nigeria we all want.",
    image: { src: ndcImage, position: "right center", fit: "cover" },
  },
];

const MOMENTUM = [
  { value: "36", label: "States organised" },
  { value: "120+", label: "Local chapters" },
  { value: "25k", label: "Active volunteers" },
];

function TricolorRule({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`rule-tricolor ${className}`}>
      <span className="bg-brand-green" />
      <span className="bg-paper-sunk" />
      <span className="bg-brand-red" />
    </span>
  );
}

function HeroActions() {
  return (
    <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
      <Link
        href="/home/get-involved"
        className="group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-md bg-green-deep px-7 text-sm font-semibold tracking-wide text-white shadow-green transition duration-200 hover:-translate-y-0.5 hover:bg-ink active:translate-y-0 active:scale-[0.99]"
      >
        Get involved
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </Link>
      <Link
        href="/home/donations"
        className="group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-md border border-rule-strong bg-paper-raised px-7 text-sm font-semibold tracking-wide text-ink shadow-1 transition duration-200 hover:-translate-y-0.5 hover:border-brand-red hover:text-brand-red active:translate-y-0 active:scale-[0.99]"
      >
        <Heart aria-hidden="true" className="h-4 w-4 fill-brand-red text-brand-red" />
        Donate to the movement
      </Link>
    </div>
  );
}

function Momentum() {
  return (
    <dl className="mt-11 grid max-w-xl grid-cols-3 border-t border-rule pt-6">
      {MOMENTUM.map((item, idx) => (
        <div
          key={item.label}
          className={idx > 0 ? "border-l border-rule pl-5 sm:pl-7" : "pr-5"}
        >
          <dt className="sr-only">{item.label}</dt>
          <dd>
            <span className="block font-display text-3xl font-bold leading-none tracking-tight text-ink tabular-nums sm:text-[2.5rem]">
              {item.value}
            </span>
            <span
              aria-hidden="true"
              className="mt-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted"
            >
              {item.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

type HomeHeroProps = {
  testimonialPairs: TestimonialPair[];
};

export default function HomeHero({ testimonialPairs }: HomeHeroProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  // All three slide images sit inside the viewport, so loading="lazy" would not
  // actually defer them. Mount each one only once its slide has been shown.
  const [mountedSlides, setMountedSlides] = useState<number[]>([0]);

  const slide = SLIDES[activeSlide]!;

  const goTo = useCallback((index: number) => {
    setActiveSlide(((index % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Mount the *next* slide's artwork shortly after the current one settles, so
  // a slide never arrives before its portrait has loaded. The delay keeps the
  // extra image off the critical path for the opening slide's LCP.
  useEffect(() => {
    const next = (activeSlide + 1) % SLIDES.length;
    setMountedSlides((mounted) =>
      mounted.includes(activeSlide) ? mounted : [...mounted, activeSlide],
    );

    const id = window.setTimeout(() => {
      setMountedSlides((mounted) =>
        mounted.includes(next) ? mounted : [...mounted, next],
      );
    }, 1200);
    return () => window.clearTimeout(id);
  }, [activeSlide]);

  useEffect(() => {
    if (reduceMotion || isHovered || SLIDES.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveSlide((i) => (i + 1) % SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, isHovered]);

  return (
    <>
      <HomeSiteHeader />
      <main id="main-content" className="bg-paper text-body">
        <section
          id="home-hero"
          aria-roledescription="carousel"
          aria-label="OK Movement campaign highlights"
          className="relative isolate overflow-hidden border-b border-rule bg-paper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocusCapture={() => setIsHovered(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setIsHovered(false);
            }
          }}
        >
          {/* Sunrise wash — slide 01 only, and it earns its place: the slide is
              about a new dawn. Every other slide sits on clean paper. */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_118%,rgb(247_201_104/0.38)_0%,rgb(247_201_104/0.10)_38%,transparent_64%)] transition-opacity duration-700 ${
              slide.dawnWash ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Portraits. Only the opening slide is eager — the other two used to
              pull 3.5 MB of PNG before anyone had scrolled. */}
          {SLIDES.map((item, idx) => {
            const isPhoto = item.image.fit === "cover";
            return (
              <div
                key={`art-${item.id}`}
                aria-hidden="true"
                className={`pointer-events-none absolute inset-y-0 right-0 -z-10 hidden transition-opacity duration-700 ease-out lg:block ${
                  isPhoto ? "w-[62%]" : "w-[58%]"
                } ${idx === activeSlide ? "opacity-100" : "opacity-0"}`}
                // Neither artwork is a clean cut-out: the photograph carries its
                // own background, and the "trimmed" PNGs keep an opaque studio
                // floor. Both are feathered so they sit on the paper instead of
                // reading as a pasted rectangle.
                style={
                  isPhoto
                    ? {
                        maskImage:
                          "linear-gradient(to right, transparent 0%, black 26%, black 100%)",
                        WebkitMaskImage:
                          "linear-gradient(to right, transparent 0%, black 26%, black 100%)",
                      }
                    : {
                        maskImage:
                          "linear-gradient(to right, transparent 0%, black 14%), linear-gradient(to bottom, black 82%, transparent 99%)",
                        WebkitMaskImage:
                          "linear-gradient(to right, transparent 0%, black 14%), linear-gradient(to bottom, black 82%, transparent 99%)",
                        maskComposite: "intersect",
                        WebkitMaskComposite: "source-in",
                      }
                }
              >
                {mountedSlides.includes(idx) ? (
                  <Image
                    src={item.image.src}
                    alt=""
                    fill
                    priority={idx === 0}
                    sizes="(min-width: 1024px) 62vw, 100vw"
                    style={{ objectPosition: item.image.position }}
                    className={
                    isPhoto ? "object-cover" : "object-contain mix-blend-multiply"
                  }
                  />
                ) : null}
              </div>
            );
          })}

          {/* Keeps the headline readable where it crosses the artwork. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 -z-10 hidden w-[56%] bg-gradient-to-r from-paper via-paper/92 to-transparent lg:block"
          />

          <div className="relative mx-auto w-[min(100%-2rem,82rem)] pb-14 pt-12 lg:flex lg:min-h-[min(100dvh-6.5rem,46rem)] lg:items-center lg:pb-24 lg:pt-20">
            <div className="max-w-[40rem]">
              <div className="flex items-center gap-4">
                <TricolorRule className="h-[3px] w-14 rounded-full" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-muted">
                  {slide.eyebrow}
                </span>
              </div>

              <h1 className="mt-7 font-display text-display-1 font-extrabold leading-[0.92] tracking-[-0.035em] text-balance text-ink">
                {slide.headline}
              </h1>

              <p className="mt-7 max-w-[46ch] text-lead leading-relaxed text-body text-pretty">
                {slide.tagline}
              </p>

              {/* Mobile art: one shared portrait rather than a per-slide
                  variant, placed with the headline instead of below the stats. */}
              <div
                className="relative mx-auto mt-9 w-[min(100%,20rem)] lg:hidden"
                // The PNG keeps an opaque studio floor at its base; fading the
                // bottom edge stops it reading as a pale box on the paper.
                style={{
                  maskImage: "linear-gradient(to bottom, black 72%, transparent 97%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 72%, transparent 97%)",
                }}
              >
                <Image
                  src={duoImage}
                  alt="Peter Obi and Rabiu Kwankwaso"
                  width={1024}
                  height={1024}
                  sizes="320px"
                  className="h-auto w-full object-contain mix-blend-multiply"
                />
              </div>

              <HeroActions />
              <Momentum />
            </div>
          </div>

          {/* Slide controls. The index numeral doubles as position feedback. */}
          <div className="relative mx-auto flex w-[min(100%-2rem,82rem)] items-center gap-5 border-t border-rule py-5">
            <span
              aria-hidden="true"
              className="font-display text-sm font-bold tabular-nums text-faint"
            >
              {slide.index}
              <span className="mx-1.5 text-rule-strong">/</span>
              {String(SLIDES.length).padStart(2, "0")}
            </span>

            <div className="flex items-center gap-2.5">
              {SLIDES.map((item, idx) => {
                const isActive = idx === activeSlide;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goTo(idx)}
                    aria-current={isActive ? "true" : undefined}
                    aria-label={`Show slide ${idx + 1}: ${item.headlineText}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-10 bg-green-deep"
                        : "w-4 bg-rule-strong hover:bg-muted"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Slide changes are announced without moving focus. */}
          <p aria-live="polite" className="sr-only">
            {`Slide ${activeSlide + 1} of ${SLIDES.length}: ${slide.headlineText}`}
          </p>
        </section>

        <HomeOurMovementSection />
        <HomePrincipalsSection testimonialPairs={testimonialPairs} />
        <HomeDonationBanner />
      </main>
      <HomeFooterSection />
    </>
  );
}
