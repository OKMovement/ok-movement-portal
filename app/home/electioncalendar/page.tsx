import type { Metadata } from "next";
import ElectionCalendarPage from "@/components/home/election-calendar-page";
import JsonLd from "@/components/seo/json-ld";
import { electionCalendarFaqs } from "@/components/home/faq-data";
import {
  breadcrumbSchema,
  buildPageMetadata,
  faqSchema,
  jsonLdGraph,
  webPageSchema,
} from "@/lib/seo";

const path = "/home/electioncalendar";
const title = "Nigeria Election Calendar 2026 & 2027";
const description =
  "Every date that decides Nigeria's next chapter — INEC's revised timetable for the 2027 Presidential, National Assembly, Governorship and State Assembly elections, plus off-cycle state votes in 2026.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path,
  keywords: [
    "Nigeria election calendar 2027",
    "INEC timetable 2027",
    "2027 presidential election date",
    "governorship election 2027",
    "off-cycle elections Nigeria",
    "National Assembly election date",
  ],
});

export default function Page() {
  return (
    <>
      <ElectionCalendarPage />
      <JsonLd
        data={jsonLdGraph(
          webPageSchema({ title, description, path }),
          breadcrumbSchema([{ name: "Election Calendar", path }]),
          faqSchema(electionCalendarFaqs),
        )}
      />
    </>
  );
}
