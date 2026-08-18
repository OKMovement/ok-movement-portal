import type { Metadata } from "next";
import MediaGalleryPage from "@/components/home/media-gallery-page";
import JsonLd from "@/components/seo/json-ld";
import { breadcrumbSchema, buildPageMetadata, jsonLdGraph, webPageSchema } from "@/lib/seo";

const path = "/home/media-gallery";
const title = "Media Gallery";
const description =
  "Photos, videos and press material from OK Movement rallies, town halls and community engagements across Nigeria and the diaspora.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path,
  keywords: [
    "OK Movement photos",
    "OK Movement videos",
    "Peter Obi rally photos",
    "Rabiu Kwankwaso photos",
    "Nigeria campaign media",
  ],
});

export default function Page() {
  return (
    <>
      <MediaGalleryPage />
      <JsonLd
        data={jsonLdGraph(
          webPageSchema({ title, description, path }),
          breadcrumbSchema([{ name: title, path }]),
        )}
      />
    </>
  );
}
