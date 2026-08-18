import type { Metadata } from "next";
import TechVolunteerPage from "@/components/home/tech-volunteer-page";
import JsonLd from "@/components/seo/json-ld";
import { VOLUNTEER_FAQS } from "../../../lib/tech-volunteers-data";
import {
  breadcrumbSchema,
  buildPageMetadata,
  faqSchema,
  jsonLdGraph,
  webPageSchema,
} from "@/lib/seo";

const path = "/home/tech-volunteer";
const title = "Tech Volunteers — Code, Design & Build the Rebirth";
const description =
  "Volunteer your engineering, design, data or storytelling skills to the OK Movement. Remote-friendly roles for Nigerians at home and in the diaspora, vetted and credited.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path,
  keywords: [
    "tech volunteers Nigeria",
    "volunteer developer Nigeria election",
    "OK Movement tech volunteers",
    "remote volunteering Nigeria",
    "diaspora tech volunteers",
    "designer volunteer Nigeria",
  ],
});

export default function Page() {
  return (
    <>
      <TechVolunteerPage />
      <JsonLd
        data={jsonLdGraph(
          webPageSchema({ title, description, path }),
          breadcrumbSchema([{ name: "Tech Volunteers", path }]),
          faqSchema(VOLUNTEER_FAQS),
        )}
      />
    </>
  );
}
