import type { Metadata } from "next";
import GetYourPvcPage from "@/components/home/get-your-pvc-page";
import JsonLd from "@/components/seo/json-ld";
import { pvcFaqs } from "@/components/home/faq-data";
import {
  breadcrumbSchema,
  buildPageMetadata,
  faqSchema,
  jsonLdGraph,
  webPageSchema,
} from "@/lib/seo";

const path = "/home/getyourpvc";
const title = "Get Your PVC — Register, Collect & Verify";
const description =
  "A step-by-step guide to your Permanent Voter Card: who is eligible, how to register with INEC, where to collect your PVC, how to transfer or replace it, and what to do if collection goes wrong.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path,
  keywords: [
    "get PVC Nigeria",
    "PVC registration",
    "Permanent Voter Card",
    "INEC voter registration",
    "PVC collection centre",
    "transfer PVC",
    "replace lost PVC",
    "CVR Nigeria",
  ],
});

export default function Page() {
  return (
    <>
      <GetYourPvcPage />
      <JsonLd
        data={jsonLdGraph(
          webPageSchema({ title, description, path }),
          breadcrumbSchema([{ name: "Get Your PVC", path }]),
          faqSchema(pvcFaqs),
        )}
      />
    </>
  );
}
