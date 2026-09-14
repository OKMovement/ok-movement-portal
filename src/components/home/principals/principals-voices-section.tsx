import type { TestimonialPair } from "@/lib/get-testimonial-pairs";
import HomeTestimonialMarquee from "./home-slider";

type PrincipalsVoicesSectionProps = {
  cards: TestimonialPair[];
};

export default function PrincipalsVoicesSection({ cards }: PrincipalsVoicesSectionProps) {
  return (
    <div className="mt-24 lg:mt-32">
      <div className="reveal grid gap-6 border-t border-rule pt-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16">
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.28em] text-green-deep">
          In their own words
        </p>
        <div>
          <h3 className="max-w-[20ch] font-display text-display-3 font-extrabold leading-[0.98] tracking-[-0.025em] text-ink text-balance">
            Real positions on the issues defining{" "}
            <span className="text-green-deep">Nigeria&rsquo;s future</span>
          </h3>
          <p className="mt-5 max-w-[62ch] leading-relaxed text-body text-pretty">
            From governance and corruption to youth, security and education — straight from Peter
            Obi and Rabiu Kwankwaso. Select any card to turn it over.
          </p>
        </div>
      </div>
      <HomeTestimonialMarquee cards={cards} />
    </div>
  );
}
