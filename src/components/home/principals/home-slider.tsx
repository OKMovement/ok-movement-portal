"use client";

import Image from "next/image";
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

type FlipCardProps = {
  card: TestimonialCard;
  cardKey: string;
  isFlipped: boolean;
  onToggle: () => void;
  sizeClass: string;
  sizes: string;
  eager?: boolean;
};

function FlipCard({
  card,
  isFlipped,
  onToggle,
  sizeClass,
  sizes,
  eager = false,
}: FlipCardProps) {
  return (
    <button
      type="button"
      data-flipped={isFlipped}
      aria-pressed={isFlipped}
      aria-label={`${card.alt}. Select to turn the card over.`}
      onClick={onToggle}
      className={`answer-card group relative shrink-0 rounded-sm text-left ${sizeClass}`}
    >
      <div className="answer-card-inner relative h-full w-full rounded-sm shadow-3">
        <div className="answer-card-face answer-card-front relative h-full w-full overflow-hidden rounded-sm">
          <Image
            src={card.frontSrc}
            alt={card.alt}
            fill
            loading={eager ? "eager" : "lazy"}
            sizes={sizes}
            className="object-cover"
          />
        </div>
        <div className="answer-card-face answer-card-back relative h-full w-full overflow-hidden rounded-sm">
          <Image src={card.backSrc} alt="" fill sizes={sizes} className="object-cover" />
        </div>
      </div>
    </button>
  );
}

export default function HomeTestimonialMarquee({ cards }: HomeTestimonialMarqueeProps) {
  const [flippedCardKey, setFlippedCardKey] = useState<string | null>(null);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);

  // The clone exists only to make the loop seamless; it is hidden from
  // assistive tech and the tab order so every card is announced once.
  const clonedCards = useMemo(() => [...cards], [cards]);

  const handleMobileScroll = (direction: "left" | "right") => {
    const track = mobileTrackRef.current;
    if (!track) return;
    const step = track.clientWidth * 0.82;
    track.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
  };

  const toggle = (key: string) =>
    setFlippedCardKey((current) => (current === key ? null : key));

  if (cards.length === 0) return null;

  return (
    <div className="relative left-1/2 mt-10 w-[min(100vw-2rem,112rem)] -translate-x-1/2 xl:mt-14">
      <div className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-paper-sunk to-transparent sm:w-16"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-paper-sunk to-transparent sm:w-16"
        />

        {/* Mobile: a real scroll track, driven by the buttons below. */}
        <div
          ref={mobileTrackRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden"
        >
          {cards.map((card, index) => {
            const cardKey = `${card.id}-mobile`;
            return (
              <FlipCard
                key={cardKey}
                card={card}
                cardKey={cardKey}
                isFlipped={flippedCardKey === cardKey}
                onToggle={() => toggle(cardKey)}
                sizeClass="h-[24rem] w-[21rem]"
                sizes="21rem"
                eager={index === 0}
              />
            );
          })}
        </div>

        {/* Desktop: the marquee. Pauses on hover and on focus-within. */}
        <div className="answers-marquee hidden w-max gap-4 md:flex lg:gap-5">
          {cards.map((card, index) => {
            const cardKey = `${card.id}-desktop`;
            return (
              <FlipCard
                key={cardKey}
                card={card}
                cardKey={cardKey}
                isFlipped={flippedCardKey === cardKey}
                onToggle={() => toggle(cardKey)}
                sizeClass="h-[30rem] w-[25rem]"
                sizes="25rem"
                eager={index === 0}
              />
            );
          })}
          <div aria-hidden="true" className="flex gap-4 lg:gap-5">
            {clonedCards.map((card) => (
              <div
                key={`${card.id}-clone`}
                className="relative h-[30rem] w-[25rem] shrink-0 overflow-hidden rounded-sm shadow-3"
              >
                <Image src={card.frontSrc} alt="" fill sizes="25rem" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3 md:hidden">
        <button
          type="button"
          onClick={() => handleMobileScroll("left")}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-rule-strong bg-paper-raised text-ink transition duration-200 hover:border-green-deep hover:text-green-deep active:scale-95 md:hidden"
          aria-label="Previous quote cards"
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => handleMobileScroll("right")}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-rule-strong bg-paper-raised text-ink transition duration-200 hover:border-green-deep hover:text-green-deep active:scale-95 md:hidden"
          aria-label="Next quote cards"
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
