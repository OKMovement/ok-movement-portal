import type { Metadata } from "next";
import OurMovementPage from "@/components/home/our-movement-page";
import JsonLd from "@/components/seo/json-ld";
import { breadcrumbSchema, buildPageMetadata, jsonLdGraph, webPageSchema } from "@/lib/seo";

const path = "/home/our-movement";
const title = "Our Movement";
const description =
  "Inside the OK Movement: the vision, national and state structures, and the five standards — character, competence, compassion, capacity and commitment — behind Nigeria's push for accountable leadership.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path,
  keywords: [
    "OK Movement vision",
    "OK Movement structure",
    "accountable leadership Nigeria",
    "national rebirth Nigeria",
    "Obi Kwankwaso movement",
  ],
});

export default function Page() {
  return (
    <>
      <OurMovementPage />
      <JsonLd
        data={jsonLdGraph(
          webPageSchema({ title, description, path }),
          breadcrumbSchema([{ name: title, path }]),
        )}
      />
    </>
  );
}
