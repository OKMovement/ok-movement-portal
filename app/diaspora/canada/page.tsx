import type { Metadata } from "next";
import DiasporaCanadaPage from "@/components/home/diaspora/canada-page";
import JsonLd from "@/components/seo/json-ld";
import { breadcrumbSchema, buildPageMetadata, jsonLdGraph, webPageSchema } from "@/lib/seo";

const path = "/diaspora/canada";
const title = "Canada Diaspora Community";
const description =
  "Join the OK Movement in Canada — register with the diaspora desk, start or join a chapter in your Canadian city, and support credible leadership back home.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path,
  keywords: [
    "OK Movement Canada",
    "Nigerians in Canada",
    "Nigerian diaspora Canada",
    "Obi Kwankwaso Canada",
  ],
});

export default function Page() {
  return (
    <>
      <DiasporaCanadaPage />
      <JsonLd
        data={jsonLdGraph(
          webPageSchema({ title, description, path }),
          breadcrumbSchema([
            { name: "Diaspora Community", path: "/diaspora" },
            { name: "Canada", path },
          ]),
          // The FAQ answers are shared with /diaspora, which already declares
          // them — declaring the same set twice would compete with itself.
        )}
      />
    </>
  );
}
