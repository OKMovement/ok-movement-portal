import HomeHero from "@/components/home/home-hero";
import { getTestimonialPairs } from "@/lib/get-testimonial-pairs";
import AskOkFab from "../../components/ask-ok-fab";

export default function Page() {
  const testimonialPairs = getTestimonialPairs();
  return (
    <>
      <HomeHero testimonialPairs={testimonialPairs} />;
      {/* <AskOkFab /> */}
    </>
);
}
