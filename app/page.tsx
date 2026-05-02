import HomeHero from "@/components/home/home-hero";
import { getTestimonialPairs } from "@/lib/get-testimonial-pairs";

export default function Page() {
  const testimonialPairs = getTestimonialPairs();
  return <HomeHero testimonialPairs={testimonialPairs} />;
}
