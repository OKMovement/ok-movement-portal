import type { Metadata } from "next";
import DonationsPage from "@/components/home/donations-page";
import JsonLd from "@/components/seo/json-ld";
import { breadcrumbSchema, buildPageMetadata, jsonLdGraph, webPageSchema } from "@/lib/seo";

const path = "/home/donations";
const title = "Donate";
const description = "Support the OK Movement with a secure online donation or contribute campaign materials, goods, and professional services.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path,
  keywords: ["donate OK Movement", "support OK Movement", "Nigeria grassroots donations", "Paystack donation Nigeria"],
});

export default function Page() {
  return (
    <>
      <DonationsPage />
      <JsonLd data={jsonLdGraph(webPageSchema({ title, description, path }), breadcrumbSchema([{ name: title, path }]))} />
    </>
  );
}
