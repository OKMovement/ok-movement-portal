"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type TestimonialCard = {
  id: string;
  frontSrc: string;
  backSrc: string;
  alt: string;
};

type HomeTestimonialMarqueeProps = {
  cards: TestimonialCard[];
};

export default function HomeTestimonialMarquee({ cards }: HomeTestimonialMarqueeProps) {
  const [flippedCardKey, setFlippedCardKey] = useState<string | null>(null);

  const duplicatedCards = useMemo(() => [...cards, ...cards], [cards]);

  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="relative left-1/2 mt-8 w-[min(100vw-1.5rem,96rem)] -translate-x-1/2 md:mt-10 xl:mt-12">
      <div className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent sm:w-14" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent sm:w-14" />

        <div className="answers-marquee flex w-max gap-3 sm:gap-4 lg:gap-5">
          {duplicatedCards.map((card, index) => {
            const cardKey = `${card.id}-${index}`;

            return (
              <button
                key={cardKey}
                type="button"
                data-flipped={flippedCardKey === cardKey}
                className="answer-card group relative h-[20rem] w-[18rem] shrink-0 rounded-[4px] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green sm:h-[26rem] sm:w-[22rem]"
                aria-label={`Flip testimonial card: ${card.alt}`}
                onClick={() => {
                  setFlippedCardKey((current) => (current === cardKey ? null : cardKey));
                }}
              >
                <div className="answer-card-inner relative h-full w-full rounded-[4px] shadow-[0_14px_24px_rgb(0_0_0_/_0.18)]">
                  <div className="answer-card-face answer-card-front relative h-full w-full overflow-hidden rounded-[4px]">
                    <Image
                      src={card.frontSrc}
                      alt={card.alt}
                      fill
                      sizes="(max-width: 640px) 18rem, 22rem"
                      className="object-cover"
                    />
                  </div>
                  <div className="answer-card-face answer-card-back relative h-full w-full overflow-hidden rounded-[4px]">
                    <Image
                      src={card.backSrc}
                      alt={`${card.alt} (back)`}
                      fill
                      sizes="(max-width: 640px) 18rem, 22rem"
                      className="object-cover"
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
