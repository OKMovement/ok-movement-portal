import type { Metadata } from "next";
import VotingProceduresPage from "@/components/home/voting-procedures-page";
import JsonLd from "@/components/seo/json-ld";
import { votingProcedureFaqs } from "@/components/home/faq-data";
import {
  breadcrumbSchema,
  buildPageMetadata,
  faqSchema,
  jsonLdGraph,
  webPageSchema,
} from "@/lib/seo";

const path = "/home/votingprocedures";
const title = "Voting Procedures — What Happens on Election Day";
const description =
  "How voting actually works in Nigeria: accreditation with BVAS, polling unit hours, marking your ballot correctly, your rights as a voter, what not to bring, and how to report irregularities.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path,
  keywords: [
    "voting procedures Nigeria",
    "how to vote Nigeria",
    "BVAS accreditation",
    "polling unit rules",
    "voter rights Nigeria",
    "INEC election day",
    "Form EC8A",
  ],
});

export default function Page() {
  return (
    <>
      <VotingProceduresPage />
      <JsonLd
        data={jsonLdGraph(
          webPageSchema({ title, description, path }),
          breadcrumbSchema([{ name: "Voting Procedures", path }]),
          faqSchema(votingProcedureFaqs),
        )}
      />
    </>
  );
}
