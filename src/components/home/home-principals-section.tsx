"use client";

import type { TestimonialPair } from "@/lib/get-testimonial-pairs";
import { homeCampaignSection, homeMovementSection } from "./home-data";
import PrincipalCard from "./principals/principal-card";
import PrincipalsCtaSection from "./principals/principals-cta-section";
import { movementStats, principalCards } from "./principals/principals-content";
import PrincipalsHeader from "./principals/principals-header";
import PrincipalsVoicesSection from "./principals/principals-voices-section";

type HomePrincipalsSectionProps = {
  testimonialPairs: TestimonialPair[];
};

export default function HomePrincipalsSection({ testimonialPairs }: HomePrincipalsSectionProps) {
  return (
    <section
      id={homeCampaignSection.id}
      aria-labelledby="principals-heading"
      className="relative overflow-hidden bg-[#fafaf7] py-16 text-brand-black sm:py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-0 flex select-none opacity-[0.05]"
      >
        <img src="/images/new-logo.png" alt="" className="h-full w-auto max-w-none object-contain object-right" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 z-0 h-72 w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgb(224_40_40/0.10),transparent_70%)]"
      />

      <div className="relative z-10 mx-auto w-[min(100%-1.5rem,82rem)]">
        <PrincipalsHeader
          eyebrow={homeCampaignSection.eyebrow}
          description={homeCampaignSection.description}
        />

        <div className="mt-12 grid gap-6 sm:gap-8 md:grid-cols-2 lg:mt-16">
          {principalCards.map((principal) => (
            <PrincipalCard key={principal.name} {...principal} />
          ))}
        </div>

        <PrincipalsVoicesSection cards={testimonialPairs} />

        <PrincipalsCtaSection ctaHref={homeMovementSection.ctaHref} stats={movementStats} />
      </div>
    </section>
  );
}
