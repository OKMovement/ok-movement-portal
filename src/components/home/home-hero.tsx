"use client";

import { ArrowUpRight, Handshake, QrCode } from "lucide-react";
import { useState } from "react";

import type { TestimonialPair } from "@/lib/get-testimonial-pairs";
import HomeDonationBanner from "./home-donation-banner";
import HomeElectionHero from "./home-election-hero";
import HomeFooterSection from "./home-footer-section";
import HomeOurMovementSection from "./home-our-movement-section";
import HomePartnershipModal, { SUPERGROUP_URL } from "./home-partnership-modal";
import HomePrincipalsSection from "./home-principals-section";
import HomeShareSection from "./home-share-section";
import HomeSiteHeader from "./home-site-header";
import HomeTakePartSection from "./home-take-part-section";

type HomeHeroProps = {
  testimonialPairs: TestimonialPair[];
};

/**
 * Landing page order is deliberate: the election and the countdown first, then
 * what you can do about it, then the tools to tell people, then the story
 * behind the movement.
 */
export default function HomeHero({ testimonialPairs }: HomeHeroProps) {
  const [announcementOpen, setAnnouncementOpen] = useState(false);

  return (
    <>
      <HomeSiteHeader />
      <main id="main-content" className="bg-paper text-body">
        <HomeElectionHero />
        <HomeTakePartSection />
        <HomeShareSection />

        {/* Smart Ballot partnership — a way to take part, so it sits with the actions. */}
        <section
          aria-labelledby="partnership-strip-heading"
          className="grain grain-on-ink relative overflow-hidden border-b-2 border-ink bg-ink text-white"
        >
          <div className="relative mx-auto flex w-[min(100%-2rem,82rem)] flex-col gap-6 py-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[52ch]">
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.28em] text-[#f7c968]">
                New partnership · Smart Ballot
              </p>
              <h2
                id="partnership-strip-heading"
                className="mt-2 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl"
              >
                One network. One movement.
              </h2>
              <p className="mt-2 text-white/80">
                OK Movement and Smart Ballot are connecting all 176,846 polling units into one
                grassroots network. Join the SuperChat and find your people.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={SUPERGROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="sticker sticker-press group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-lg !border-white bg-[#f7c968] px-7 text-sm font-extrabold uppercase tracking-[0.1em] text-ink !shadow-[5px_5px_0_0_#ffffff]"
              >
                <Handshake aria-hidden="true" className="h-4 w-4" />
                Join the SuperChat
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <button
                type="button"
                onClick={() => setAnnouncementOpen(true)}
                className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-lg border-2 border-white/60 px-7 text-sm font-extrabold uppercase tracking-[0.1em] text-white transition duration-200 hover:bg-white hover:text-ink"
              >
                <QrCode aria-hidden="true" className="h-4 w-4" />
                Scan code to join
              </button>
            </div>
          </div>
        </section>

        <HomeOurMovementSection />
        <HomePrincipalsSection testimonialPairs={testimonialPairs} />
        <HomeDonationBanner />
      </main>
      <HomeFooterSection />
      {announcementOpen ? (
        <HomePartnershipModal onClose={() => setAnnouncementOpen(false)} />
      ) : null}
    </>
  );
}
