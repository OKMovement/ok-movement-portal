"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  HandHeart,
  Heart,
  Mail,
} from "lucide-react";

import HomeFooterSection from "../home-footer-section";
import HomeSiteHeader from "../home-site-header";
import { useReveal } from "../use-reveal";
import DiasporaRegistrationSection from "./diaspora-registration";
import { LogoWatermark, SectionHeader, TricolorRule } from "./diaspora-shared";
import {
  diasporaFaqs,
  diasporaPillars,
  diasporaStats,
  diasporaSupportKinds,
} from "@/data/diaspora-data";

const HERO_IMAGE = "/images/bg-5.jpeg";

export default function DiasporaCanadaPage() {
  const pageRef = useReveal<HTMLDivElement>();

  return (
    <div ref={pageRef}>
      <HomeSiteHeader />

      <main id="main-content" className="bg-paper text-body">
        {/* HERO ----------------------------------------------------- */}
        <section
          aria-labelledby="canada-heading"
          className="grain grain-on-ink relative isolate overflow-hidden bg-ink text-white"
        >
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <Image
              src={HERO_IMAGE}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-35"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/40"
          />

          <div className="relative mx-auto w-[min(100%-2rem,82rem)] pb-20 pt-20 sm:pb-24 lg:pb-28 lg:pt-28">
            <div className="max-w-[46rem]">
              <div className="flex items-center gap-4">
                <TricolorRule />
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/70">
                  OK Movement · Canada
                </p>
              </div>

              <h1
                id="canada-heading"
                className="mt-8 font-display text-display-1 font-extrabold leading-[0.94] tracking-[-0.035em] text-balance"
              >
                Nigerians in Canada.
                <br />
                <span className="text-green-ink">Never far from the fight.</span>
              </h1>
              <p className="mt-7 max-w-[56ch] text-lead leading-relaxed text-white/75 text-pretty">
                Wherever you are across Canada — Toronto, Calgary, Vancouver, Montréal, Winnipeg,
                Halifax — you still carry Nigeria. Mobilise, sensitise, volunteer or give so
                credible candidates are elected to serve the people back home.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#registration"
                  className="group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-md bg-brand-green px-7 text-sm font-semibold tracking-wide text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-ink active:translate-y-0 active:scale-[0.99]"
                >
                  Join from Canada
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </a>
                <a
                  href="#support"
                  className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-md border border-white/25 px-7 text-sm font-semibold tracking-wide text-white transition duration-200 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-ink active:translate-y-0"
                >
                  <Heart aria-hidden="true" className="h-4 w-4" />
                  Support from Canada
                </a>
              </div>

              <p className="mt-7 text-sm text-white/55">
                Outside Canada?{" "}
                <Link
                  href="/diaspora"
                  className="font-semibold text-green-ink underline underline-offset-4 transition-colors duration-200 hover:text-white"
                >
                  Go to the international diaspora page
                </Link>
                .
              </p>
            </div>

            <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-white/15 pt-8 lg:mt-20 lg:grid-cols-3">
              {diasporaStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{`${stat.label} — ${stat.helper}`}</dt>
                  <dd>
                    <span className="block font-display text-4xl font-extrabold leading-none tracking-[-0.03em] tabular-nums sm:text-[2.75rem]">
                      {stat.value}
                    </span>
                    <span
                      aria-hidden="true"
                      className="mt-2.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-white/60"
                    >
                      {stat.label}
                    </span>
                    <span aria-hidden="true" className="mt-1 block text-[11px] text-white/40">
                      {stat.helper}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* FOUR WAYS TO SERVE --------------------------------------- */}
        <section
          aria-labelledby="ways-heading"
          className="relative overflow-hidden bg-paper py-20 sm:py-24 lg:py-28"
        >
          <LogoWatermark />
          <div className="relative z-10 mx-auto w-[min(100%-2rem,82rem)]">
            <SectionHeader
              id="ways-heading"
              eyebrow="Four ways to serve"
              heading={
                <>
                  Distance is <span className="text-green-deep">not absence.</span>
                </>
              }
              standfirst="Whether you have an hour a week, a network in your Canadian city, professional skills or the means to give — there is a direct line from where you are to the Nigeria we all want."
            />

            <div className="mt-14 grid gap-6 md:grid-cols-2 md:gap-8 lg:mt-20">
              {diasporaPillars.map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                  <article
                    key={pillar.title}
                    className={`reveal flex flex-col border border-rule bg-paper-raised p-7 shadow-1 sm:p-9 ${
                      index % 2 === 1 ? "md:mt-12" : ""
                    }`}
                    style={{ "--reveal-delay": `${(index % 2) * 120}ms` } as React.CSSProperties}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <Icon aria-hidden="true" className="h-6 w-6 text-green-deep" />
                      <span
                        aria-hidden="true"
                        className="font-display text-sm font-bold tabular-nums text-faint"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-6 max-w-[18ch] font-display text-2xl font-extrabold leading-tight tracking-[-0.025em] text-ink text-balance">
                      {pillar.title}
                    </h3>
                    <p className="mt-4 max-w-[58ch] leading-relaxed text-body text-pretty">
                      {pillar.body}
                    </p>
                    <ul className="mt-6 space-y-2.5 border-t border-rule pt-5 text-sm text-body">
                      {pillar.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2.5">
                          <CheckCircle2
                            aria-hidden="true"
                            className="mt-0.5 h-4 w-4 shrink-0 text-green-deep"
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Country pre-selected; the visitor can still change it. */}
        <DiasporaRegistrationSection
          defaultCountry="Canada"
          eyebrow="Step in"
          heading="Register with the Canada desk."
          intro="Tell us where in Canada you are and how you would like to serve. A coordinator will reach out within 1–2 business days — in your time zone."
          formHeading="How will you serve from Canada?"
        />

        {/* SUPPORT -------------------------------------------------- */}
        <section
          id="support"
          aria-labelledby="support-heading"
          className="relative overflow-hidden bg-paper py-20 sm:py-24 lg:py-28"
        >
          <LogoWatermark />
          <div className="relative z-10 mx-auto w-[min(100%-2rem,82rem)]">
            <SectionHeader
              id="support-heading"
              eyebrow="Support from Canada"
              heading={
                <>
                  Send more than <span className="text-green-deep">money home.</span>
                </>
              }
              standfirst="Pointed at citizen organising, Canadian generosity funds voter education, ward-level mobilisation and credible representation back home."
            />

            <dl className="mt-14 border-t border-rule lg:mt-20">
              {diasporaSupportKinds.map((kind) => {
                const Icon = kind.icon;
                return (
                  <div
                    key={kind.title}
                    className="reveal grid gap-5 border-b border-rule py-9 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-14"
                  >
                    <dt>
                      <Icon aria-hidden="true" className="h-6 w-6 text-green-deep" />
                      <span className="mt-4 block font-display text-xl font-extrabold tracking-[-0.025em] text-ink sm:text-2xl">
                        {kind.title}
                      </span>
                    </dt>
                    <dd>
                      <p className="max-w-[62ch] leading-relaxed text-body text-pretty">
                        {kind.short}
                      </p>
                      <ul className="mt-5 space-y-2.5 text-sm text-body">
                        {kind.examples.map((example) => (
                          <li key={example} className="flex gap-2.5">
                            <CheckCircle2
                              aria-hidden="true"
                              className="mt-0.5 h-4 w-4 shrink-0 text-green-deep"
                            />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                );
              })}
            </dl>

            <div className="reveal mt-10 grid gap-3 sm:grid-cols-2">
              <Link
                href="/home/contact"
                className="group flex items-center gap-3.5 border border-rule bg-paper-raised p-5 transition duration-200 hover:-translate-y-0.5 hover:border-green-deep"
              >
                <Mail aria-hidden="true" className="h-5 w-5 shrink-0 text-green-deep" />
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-faint">
                    Email
                  </span>
                  <span className="text-sm font-semibold text-ink">Contact the diaspora desk</span>
                </span>
              </Link>
              <Link
                href="/diaspora"
                className="group flex items-center gap-3.5 border border-rule bg-paper-raised p-5 transition duration-200 hover:-translate-y-0.5 hover:border-green-deep"
              >
                <HandHeart aria-hidden="true" className="h-5 w-5 shrink-0 text-ink" />
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-faint">
                    Outside Canada?
                  </span>
                  <span className="text-sm font-semibold text-ink">
                    Use the international diaspora page
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* CANADIAN CHAPTERS ---------------------------------------- */}
        <section
          aria-labelledby="chapters-heading"
          className="grain grain-on-ink relative overflow-hidden bg-green-deep py-20 text-white sm:py-24 lg:py-28"
        >
          <div className="relative mx-auto grid w-[min(100%-2rem,82rem)] gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
            <div>
              <div className="flex items-center gap-4">
                <TricolorRule />
                <p className="font-display text-[11px] font-bold uppercase tracking-[0.28em] text-white/80">
                  Canadian chapters
                </p>
              </div>
              <h2
                id="chapters-heading"
                className="mt-7 max-w-[16ch] font-display text-display-2 font-extrabold leading-[0.96] tracking-[-0.03em] text-balance"
              >
                Bring the movement to your Canadian city.
              </h2>
              <p className="mt-6 max-w-[58ch] text-lead leading-relaxed text-white/80 text-pretty">
                Ontario to British Columbia, Alberta to Nova Scotia — Nigerians across Canada are
                organising under the OK Movement banner. Join the chapter near you, or be the one
                who starts it.
              </p>
              <a
                href="#registration"
                className="group mt-9 inline-flex min-h-13 items-center gap-2.5 rounded-md bg-white px-7 py-3.5 text-sm font-semibold tracking-wide text-green-deep transition duration-200 hover:-translate-y-0.5 hover:bg-ink hover:text-white active:translate-y-0 active:scale-[0.99]"
              >
                Start or join a chapter
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>

            <div className="border-l-2 border-white/30 pl-7 lg:pl-10">
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.28em] text-white/70">
                Why chapters matter
              </p>
              <p className="mt-4 max-w-[46ch] leading-relaxed text-white/85 text-pretty">
                A chapter turns scattered goodwill into organised power: one voice to your
                city&rsquo;s Nigerian community, one channel for verified updates, and one engine
                pointing resources exactly where they count back home.
              </p>
              <p className="mt-7 border-t border-white/20 pt-6 text-sm leading-relaxed text-white/80">
                <span className="block font-display text-[11px] font-bold uppercase tracking-[0.28em] text-white">
                  First in your city?
                </span>
                <span className="mt-2 block">
                  Select <span className="font-semibold text-white">Lead a City Chapter</span> when
                  registering and the desk will send you a starter kit.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* FAQ ------------------------------------------------------ */}
        <section
          aria-labelledby="faq-heading"
          className="relative border-t border-rule bg-paper-sunk py-20 sm:py-24 lg:py-28"
        >
          <div className="mx-auto grid w-[min(100%-2rem,82rem)] gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
            <div className="reveal lg:sticky lg:top-28 lg:self-start">
              <TricolorRule />
              <p className="mt-5 font-display text-[11px] font-bold uppercase tracking-[0.28em] text-green-deep">
                Good to know
              </p>
              <h2
                id="faq-heading"
                className="mt-4 font-display text-display-3 font-extrabold leading-[0.98] tracking-[-0.025em] text-ink text-balance"
              >
                Quick answers for Nigerians in Canada.
              </h2>
              <p className="mt-5 text-sm text-muted">
                {diasporaFaqs.length} questions we get most often.
              </p>
            </div>

            <ul className="reveal border-t border-rule">
              {diasporaFaqs.map((faq, index) => (
                <li key={faq.q}>
                  <details className="group border-b border-rule">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-5 py-5 [&::-webkit-details-marker]:hidden">
                      <span className="flex gap-4">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 font-display text-xs font-bold tabular-nums text-faint"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="max-w-[46ch] font-display text-lg font-bold leading-snug tracking-[-0.015em] text-ink">
                          {faq.q}
                        </span>
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className="mt-1 h-5 w-5 shrink-0 text-faint transition-transform duration-200 group-open:rotate-180 group-open:text-green-deep"
                      />
                    </summary>
                    <p className="max-w-[64ch] pb-6 pl-8 leading-relaxed text-body text-pretty">
                      {faq.a}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CLOSING CTA ---------------------------------------------- */}
        <section
          aria-labelledby="canada-cta-heading"
          className="grain grain-on-ink relative overflow-hidden bg-ink-raised text-white"
        >
          <TricolorRule className="absolute inset-x-0 top-0 h-1 w-full" />
          <div className="relative mx-auto grid w-[min(100%-2rem,82rem)] gap-10 py-20 sm:py-24 lg:grid-cols-[1.4fr_auto] lg:items-end lg:gap-20">
            <div>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.28em] text-green-ink">
                The assignment
              </p>
              <h2
                id="canada-cta-heading"
                className="mt-4 max-w-[20ch] font-display text-display-2 font-extrabold leading-[0.96] tracking-[-0.03em] text-balance"
              >
                From Canada, Nigeria is counting on you.
              </h2>
              <p className="mt-6 max-w-[56ch] text-lead leading-relaxed text-white/70 text-pretty">
                Twenty twenty-seven is not a spectator sport. Mobilise your networks, fund the work
                and help take our country back — one credible vote at a time.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:pb-2">
              <a
                href="#registration"
                className="group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-md bg-brand-green px-8 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-green transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-ink active:translate-y-0 active:scale-[0.99]"
              >
                Join from Canada
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </a>
              <Link
                href="/home/contact"
                className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-md border border-white/25 px-8 text-sm font-semibold uppercase tracking-[0.12em] text-white transition duration-200 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-ink active:translate-y-0"
              >
                Talk to the desk
              </Link>
            </div>
          </div>
        </section>
      </main>

      <HomeFooterSection />
    </div>
  );
}
