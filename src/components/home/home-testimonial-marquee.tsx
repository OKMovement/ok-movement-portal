"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";

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
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);

  const duplicatedCards = useMemo(() => [...cards, ...cards], [cards]);

  const handleMobileScroll = (direction: "left" | "right") => {
    const track = mobileTrackRef.current;
    if (!track) return;

    const scrollStep = track.clientWidth * 0.82;
    const offset = direction === "left" ? -scrollStep : scrollStep;
    track.scrollBy({ left: offset, behavior: "smooth" });
  };

  if (cards.length === 0) return null;

  return (
    <div className="relative left-1/2 mt-8 w-[min(100vw-1.5rem,112rem)] -translate-x-1/2 md:mt-10 xl:mt-12">
      <div className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent sm:w-14"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent sm:w-14"
        />

        {/* Mobile: manual horizontal scroll */}
        <div
          ref={mobileTrackRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden"
        >
          {cards.map((card, index) => {
            const cardKey = `${card.id}-mobile-${index}`;

            return (
              <button
                key={cardKey}
                type="button"
                data-flipped={flippedCardKey === cardKey}
                className="answer-card group relative h-[24rem] w-[21rem] shrink-0 rounded-[8px] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                aria-label={`Flip testimonial card: ${card.alt}`}
                onClick={() =>
                  setFlippedCardKey((current) => (current === cardKey ? null : cardKey))
                }
              >
                <div className="answer-card-inner relative h-full w-full rounded-[8px] shadow-[0_14px_24px_rgb(0_0_0_/_0.18)]">
                  <div className="answer-card-face answer-card-front relative h-full w-full overflow-hidden rounded-[8px]">
                    <img
                      src={card.frontSrc}
                      alt={card.alt}
                      className="h-full w-full object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>
                  <div className="answer-card-face answer-card-back relative h-full w-full overflow-hidden rounded-[8px]">
                    <img
                      src={card.backSrc}
                      alt={`${card.alt} (back)`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Desktop: auto-sliding marquee */}
        <div className="answers-marquee hidden w-max gap-3 md:flex md:gap-4 lg:gap-5">
          {duplicatedCards.map((card, index) => {
            const cardKey = `${card.id}-desktop-${index}`;

            return (
              <button
                key={cardKey}
                type="button"
                data-flipped={flippedCardKey === cardKey}
                className="answer-card group relative h-[32rem] w-[27rem] shrink-0 rounded-[8px] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                aria-label={`Flip testimonial card: ${card.alt}`}
                onClick={() =>
                  setFlippedCardKey((current) => (current === cardKey ? null : cardKey))
                }
              >
                <div className="answer-card-inner relative h-full w-full rounded-[8px] shadow-[0_14px_24px_rgb(0_0_0_/_0.18)]">
                  <div className="answer-card-face answer-card-front relative h-full w-full overflow-hidden rounded-[8px]">
                    <img
                      src={card.frontSrc}
                      alt={card.alt}
                      className="h-full w-full object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>
                  <div className="answer-card-face answer-card-back relative h-full w-full overflow-hidden rounded-[8px]">
                    <img
                      src={card.backSrc}
                      alt={`${card.alt} (back)`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Elegant prev / next indicators below the slide (mobile only — desktop auto-slides) */}
      <div className="mt-7 flex items-center justify-center gap-4 sm:gap-5 md:hidden">
        <button
          type="button"
          onClick={() => handleMobileScroll("left")}
          className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-brand-green/30 bg-white text-brand-green shadow-[0_10px_24px_-10px_rgb(0_166_81/0.45)] transition hover:border-brand-green hover:bg-brand-green hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          aria-label="Previous testimonial"
        >
          <ChevronLeft
            aria-hidden="true"
            className="h-5 w-5 transition group-hover:-translate-x-0.5"
          />
        </button>

        <span
          aria-hidden="true"
          className="h-px w-14 rounded-full bg-gradient-to-r from-brand-green/45 via-brand-black/20 to-brand-red/45"
        />

        <button
          type="button"
          onClick={() => handleMobileScroll("right")}
          className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-brand-red/30 bg-white text-brand-red shadow-[0_10px_24px_-10px_rgb(224_40_40/0.45)] transition hover:border-brand-red hover:bg-brand-red hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          aria-label="Next testimonial"
        >
          <ChevronRight
            aria-hidden="true"
            className="h-5 w-5 transition group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </div>
  );
}