"use client";

import Image from "next/image";

import type { TestimonialPair } from "@/lib/get-testimonial-pairs";
import { homeCampaignSection } from "./home-data";
import { useReveal } from "./use-reveal";
import PrincipalCard from "./principals/principal-card";
import PrincipalsCtaSection from "./principals/principals-cta-section";
import { movementStats, principalCards } from "./principals/principals-content";
import PrincipalsHeader from "./principals/principals-header";
import PrincipalsVoicesSection from "./principals/principals-voices-section";

type HomePrincipalsSectionProps = {
  testimonialPairs: TestimonialPair[];
};

export default function HomePrincipalsSection({ testimonialPairs }: HomePrincipalsSectionProps) {
  const sectionRef = useReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id={homeCampaignSection.id}
      aria-labelledby="principals-heading"
      className="relative overflow-hidden border-t border-rule bg-paper-sunk py-20 text-body sm:py-24 lg:py-32"
    >
      {/* Logo watermark — the background device on light sections. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[min(60%,44rem)] select-none opacity-[0.06]"
      >
        <Image
          src="/images/new-logo.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 44rem, 60vw"
          className="object-contain object-right"
        />
      </div>

      <div className="relative mx-auto w-[min(100%-2rem,82rem)]">
        <PrincipalsHeader
          eyebrow={homeCampaignSection.eyebrow}
          description={homeCampaignSection.description}
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 md:gap-8 lg:mt-20">
          {principalCards.map((principal, idx) => (
            <PrincipalCard
              key={principal.name}
              {...principal}
              index={String(idx + 1).padStart(2, "0")}
              offset={idx === 1}
            />
          ))}
        </div>

        <PrincipalsVoicesSection cards={testimonialPairs} />

        <PrincipalsCtaSection ctaHref="/home/get-involved" stats={movementStats} />
      </div>
    </section>
  );
}
