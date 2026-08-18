import type { Metadata } from "next";
import UpcomingEventsPage from "@/components/home/upcoming-events-page";
import JsonLd from "@/components/seo/json-ld";
import { breadcrumbSchema, buildPageMetadata, jsonLdGraph, webPageSchema } from "@/lib/seo";

const path = "/home/upcoming-events";
const title = "Upcoming Events";
const description =
  "Rallies, town halls, voter-education sessions and community meetings across Nigeria and the diaspora. Find an OK Movement event near you and register to attend.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path,
  keywords: [
    "OK Movement events",
    "Nigeria political rally",
    "town hall Nigeria",
    "voter education events",
    "campaign events 2027",
  ],
});

export default function Page() {
  return (
    <>
      <UpcomingEventsPage />
      <JsonLd
        data={jsonLdGraph(
          webPageSchema({ title, description, path }),
          breadcrumbSchema([{ name: title, path }]),
        )}
      />
    </>
  );
}
