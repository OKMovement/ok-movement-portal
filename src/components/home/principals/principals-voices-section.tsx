import { Quote } from "lucide-react";
import type { TestimonialPair } from "@/lib/get-testimonial-pairs";
import HomeTestimonialMarquee from "./home-slider";

type PrincipalsVoicesSectionProps = {
  cards: TestimonialPair[];
};

export default function PrincipalsVoicesSection({
  cards,
}: PrincipalsVoicesSectionProps) {

  return (
    <div className="mt-20 lg:mt-24">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-green ring-1 ring-brand-green/20 shadow-sm">
          <Quote aria-hidden="true" className="h-3.5 w-3.5" />
          In Their Own Words
        </div>
        <h3 className="mt-5 text-balance text-3xl font-medium tracking-tight text-brand-black sm:text-4xl lg:text-[2.6rem]">
          Real positions on the issues defining{" "}
          <span className="text-brand-green">Nigeria's future</span>
        </h3>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-base leading-relaxed text-brand-black/65 sm:text-[17px]">
          From governance and corruption to youth, security, and education —
          hear directly from Peter Obi and Rabiu Kwankwaso. Tap any card to flip
          and see more.
        </p>
      </div>
      <HomeTestimonialMarquee cards={cards} />
    </div>
  );
}
