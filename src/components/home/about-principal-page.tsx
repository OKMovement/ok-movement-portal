"use client";

import { ArrowUpRight, FileText, Quote } from "lucide-react";
import type { AboutPrincipal } from "./about-principal-data";
import HomeFooterSection from "./home-footer-section";
import HomeSiteHeader from "./home-site-header";

type AboutPrincipalPageProps = {
  principal: AboutPrincipal;
};

function TricolorRule() {
  return (
    <span aria-hidden="true" className="flex h-[2px] w-16 overflow-hidden rounded-full">
      <span className="h-full flex-1 bg-brand-green" />
      <span className="h-full flex-1 bg-brand-black" />
      <span className="h-full flex-1 bg-brand-red" />
    </span>
  );
}

export default function AboutPrincipalPage({ principal }: AboutPrincipalPageProps) {
  const [galleryPrimary, gallerySecondary] = principal.gallery;

  return (
    <main className="min-h-screen bg-white text-brand-black">
      <HomeSiteHeader />

      {/* HERO ------------------------------------------------------- */}
      <section
        id="principal-hero"
        className="relative isolate min-h-[34rem] overflow-hidden sm:min-h-[40rem] lg:min-h-[46rem]"
      >
        <img
          src={principal.heroImage}
          alt={principal.heroAlt}
          className="absolute inset-0 h-full w-full object-cover object-right"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-brand-black/85 via-brand-black/55 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-black/70 to-transparent"
        />

        <div className="relative z-10 mx-auto flex min-h-[34rem] w-[min(100%-2rem,80rem)] flex-col justify-end pb-14 pt-24 sm:min-h-[40rem] sm:pb-16 sm:pt-28 lg:min-h-[46rem]">
          {/* Title block */}
          <div className="max-w-3xl">
            <div className="flex items-center gap-4">
              <TricolorRule />
              <p className="text-[11px] font-medium uppercase tracking-[0.46em] text-white/80">
                {principal.eyebrow} the Principal
              </p>
            </div>
            <h1 className="mt-5 text-2xl font-medium leading-[0.95] text-white sm:text-6xl lg:text-8xl">
              {principal.title}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/80 sm:text-lg">
              {principal.introHeading}.
            </p>
          </div>
        </div>
      </section>

      {/* INTRO / STORY --------------------------------------------- */}
      <section
        id="principal-story"
        className="relative bg-white px-4 py-20 sm:py-24 lg:py-28"
      >
        <div className="mx-auto grid w-[min(100%-1rem,72rem)] gap-12 lg:grid-cols-[18rem_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <TricolorRule />
            <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.46em] text-brand-red">
              Introduction
            </p>
            <h2 className="mt-4 text-3xl font-medium leading-tight text-brand-black sm:text-4xl">
              {principal.introHeading}
            </h2>
            <p className="mt-5 text-sm uppercase tracking-[0.32em] text-black/55">
              {principal.name}
            </p>
          </div>

          <div className="space-y-6 text-lg leading-relaxed text-black/75">
            {principal.introParagraphs.map((paragraph, index) => (
              <p
                key={paragraph}
                className={
                  index === 0
                    ? "text-xl leading-relaxed text-brand-black sm:text-2xl"
                    : undefined
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ASYMMETRIC GALLERY ---------------------------------------- */}
      {galleryPrimary ? (
        <section className="bg-[#f5f5f3] px-4 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid w-[min(100%-1rem,76rem)] gap-5 lg:grid-cols-12 lg:gap-6">
            <figure className="relative overflow-hidden rounded-[14px] bg-brand-black lg:col-span-7">
              <img
                src={galleryPrimary.src}
                alt={galleryPrimary.alt}
                className="h-[22rem] w-full object-cover transition duration-700 hover:scale-[1.02] sm:h-[28rem] lg:h-[34rem]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-brand-black/80 via-brand-black/30 to-transparent p-5 text-xs uppercase tracking-[0.32em] text-white/85">
                <span>{galleryPrimary.alt}</span>
                <span className="text-white/60">01</span>
              </figcaption>
            </figure>

            {gallerySecondary ? (
              <figure className="relative overflow-hidden rounded-[14px] bg-brand-black lg:col-span-5">
                <img
                  src={gallerySecondary.src}
                  alt={gallerySecondary.alt}
                  className="h-[22rem] w-full object-cover transition duration-700 hover:scale-[1.02] sm:h-[28rem] lg:h-[34rem]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-brand-black/80 via-brand-black/30 to-transparent p-5 text-xs uppercase tracking-[0.32em] text-white/85">
                  <span>{gallerySecondary.alt}</span>
                  <span className="text-white/60">02</span>
                </figcaption>
              </figure>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* PULL QUOTE ------------------------------------------------ */}
      <section className="relative overflow-hidden bg-white px-4 py-20 sm:py-24 lg:py-28">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 mx-auto h-px w-[min(100%-2rem,72rem)] bg-gradient-to-r from-transparent via-brand-black/15 to-transparent"
        />
        <div className="mx-auto w-[min(100%-1rem,60rem)] text-center">
          <Quote
            aria-hidden="true"
            className="mx-auto h-10 w-10 text-brand-green sm:h-12 sm:w-12"
          />
          <blockquote className="mt-6 text-2xl font-medium leading-snug text-brand-black sm:text-3xl lg:text-4xl">
            <span className="bg-gradient-to-r from-brand-green via-brand-black to-brand-red bg-clip-text text-transparent">
              &ldquo;{principal.quote}&rdquo;
            </span>
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-3">
            <TricolorRule />
            <p className="text-[11px] font-medium uppercase tracking-[0.46em] text-black/65">
              {principal.name}
            </p>
            <TricolorRule />
          </div>
        </div>
      </section>

      {/* SECOND PARAGRAPHS ----------------------------------------- */}
      <section className="bg-white px-4 pb-20 sm:pb-24 lg:pb-28">
        <div className="mx-auto w-[min(100%-1rem,52rem)]">
          <div className="space-y-6 text-lg leading-relaxed text-black/75">
            {principal.secondParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* WIDE IMAGE WITH CAPTION ----------------------------------- */}
      <section className="relative isolate overflow-hidden bg-brand-black">
        <img
          src={principal.wideImage.src}
          alt={principal.wideImage.alt}
          className="h-[24rem] w-full object-cover opacity-80 sm:h-[32rem] lg:h-[40rem]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-brand-black/85 via-brand-black/30 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 mx-auto w-[min(100%-2rem,76rem)] pb-10 sm:pb-14">
          <div className="flex items-center gap-4">
            <TricolorRule />
            <p className="text-[11px] font-medium uppercase tracking-[0.46em] text-white/75">
              On the Ground
            </p>
          </div>
          <p className="mt-3 max-w-2xl text-lg font-medium leading-snug text-white sm:text-xl">
            {principal.wideImage.alt}
          </p>
        </div>
      </section>

      {/* TRACK RECORD CARD ----------------------------------------- */}
      <section className="bg-white px-4 py-20 sm:py-24">
        <div className="mx-auto w-[min(100%-1rem,72rem)]">
          <div className="relative overflow-hidden rounded-[18px] border border-black/8 bg-[#f8f7f4] p-8 shadow-[0_24px_48px_-28px_rgb(0_0_0/0.25)] sm:p-12">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 flex h-[3px]"
            >
              <span className="h-full flex-1 bg-brand-green" />
              <span className="h-full flex-1 bg-brand-black" />
              <span className="h-full flex-1 bg-brand-red" />
            </span>

            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
              <div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-brand-green" aria-hidden="true" />
                  <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-brand-red">
                    Track Record
                  </p>
                </div>
                <h2 className="mt-4 text-3xl font-medium leading-tight text-brand-black sm:text-4xl">
                  {principal.ctaLabel}
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-black/70">
                  Read the full background, public-service record, and policy commitments that
                  shape {principal.name.split(" ")[0]}'s contribution to the OK Movement.
                </p>
              </div>

              <a
                href={principal.ctaHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[12px] bg-brand-black px-7 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_18px_36px_-14px_rgb(0_0_0/0.6)] transition hover:bg-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
              >
                Open Document
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* GET INVOLVED CTA ------------------------------------------ */}
      <section
        id="get-involved-principal"
        className="relative isolate overflow-hidden bg-brand-green px-4 py-20 text-center text-white sm:py-24 lg:py-28"
      >
        <span aria-hidden="true" className="absolute inset-x-0 top-0 flex h-[3px]">
          <span className="h-full flex-1 bg-white/40" />
          <span className="h-full flex-1 bg-brand-black/60" />
          <span className="h-full flex-1 bg-brand-red" />
        </span>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-brand-red/30 blur-3xl"
        />

        <div className="relative mx-auto w-[min(100%-1rem,52rem)]">
          <div className="flex items-center justify-center gap-4">
            <TricolorRule />
            <p className="text-[11px] font-medium uppercase tracking-[0.46em] text-white/85">
              Get Involved
            </p>
            <TricolorRule />
          </div>
          <h2 className="mx-auto mt-5 text-3xl font-medium leading-tight sm:text-4xl lg:text-5xl">
            Our movement is powered by working people.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Join the volunteers, organisers and citizens building a credible Nigeria — one block,
            ward and conversation at a time.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/home#get-involved-movement"
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[10px] bg-brand-red px-8 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_36px_-12px_rgb(224_40_40/0.55)] transition hover:bg-brand-black sm:w-auto"
            >
              Join the Movement
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={principal.ctaHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[10px] border border-white/40 bg-white/10 px-8 text-sm font-semibold uppercase tracking-[0.16em] text-white backdrop-blur transition hover:bg-white hover:text-brand-green sm:w-auto"
            >
              {principal.ctaLabel}
            </a>
          </div>
        </div>
      </section>

      <HomeFooterSection />
    </main>
  );
}