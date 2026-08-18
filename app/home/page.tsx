import type { Metadata } from "next";
import HomeHero from "@/components/home/home-hero";
import { getTestimonialPairs } from "@/lib/get-testimonial-pairs";
import { absoluteUrl, siteConfig } from "@/lib/seo";

const title = "A New Dawn for Nigeria";
const description =
  "Join the OK Movement — the people-powered campaign behind Peter Obi and Rabiu Kwankwaso to restore accountable leadership, better healthcare, education and security across Nigeria.";

/**
 * `/home` renders the same content as `/`, so it canonicalises to `/` and is
 * excluded from the sitemap. Search engines consolidate all ranking signals
 * on the root URL.
 */
export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — ${title}` },
  description,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${title}`,
    description,
    locale: siteConfig.locale,
    images: [
      {
        url: absoluteUrl(siteConfig.ogImage),
        width: 1200,
        height: 630,
        alt: siteConfig.ogImageAlt,
      },
    ],
  },
};

export default function Page() {
  const testimonialPairs = getTestimonialPairs();
  return <HomeHero testimonialPairs={testimonialPairs} />;
}
