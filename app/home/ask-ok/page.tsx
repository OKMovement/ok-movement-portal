import type { Metadata } from "next";
import AskOkPage from "../../../components/home/ask-ok-page";
import JsonLd from "@/components/seo/json-ld";
import { breadcrumbSchema, buildPageMetadata, jsonLdGraph, webPageSchema } from "@/lib/seo";

const path = "/home/ask-ok";
const title = "Ask OK — Your Questions, Answered";
const description =
  "Ask anything about the OK Movement, the 2027 elections, your PVC or voting procedures, and get a clear answer instantly from the OK Movement assistant.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path,
  keywords: [
    "Ask OK",
    "OK Movement questions",
    "Nigeria election questions",
    "PVC questions",
    "OK Movement assistant",
  ],
});

export default function Page() {
  return (
    <>
      <AskOkPage />
      <JsonLd
        data={jsonLdGraph(
          webPageSchema({ title, description, path }),
          breadcrumbSchema([{ name: "Ask OK", path }]),
        )}
      />
    </>
  );
}
