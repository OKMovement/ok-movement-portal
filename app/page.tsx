import type { Metadata } from "next";
import HomeHero from "@/components/home/home-hero";
import { getTestimonialPairs } from "@/lib/get-testimonial-pairs";
import JsonLd from "@/components/seo/json-ld";
import {
  buildPageMetadata,
  jsonLdGraph,
  siteConfig,
  webPageSchema,
} from "@/lib/seo";

const title = "A New Dawn for Nigeria";
const description =
  "Join the OK Movement — the people-powered campaign behind Peter Obi and Rabiu Kwankwaso to restore accountable leadership, better healthcare, education and security across Nigeria.";

export const metadata: Metadata = {
  ...buildPageMetadata({ title, description, path: "/" }),
  // Homepage leads with the brand rather than the "%s | OK Movement" template.
  title: { absolute: `${siteConfig.name} — ${title}` },
};

export default function Page() {
  const testimonialPairs = getTestimonialPairs();
  return (
    <>
      <HomeHero testimonialPairs={testimonialPairs} />
      <JsonLd data={jsonLdGraph(webPageSchema({ title, description, path: "/" }))} />
    </>
  );
}
