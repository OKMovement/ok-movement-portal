import type { Metadata } from "next";
import DiasporaPage from "@/components/home/diaspora-page";
import JsonLd from "@/components/seo/json-ld";
import { breadcrumbSchema, buildPageMetadata, jsonLdGraph, webPageSchema } from "@/lib/seo";

const path = "/diaspora";
const title = "Diaspora Community";
const description = "Join the OK Movement Diaspora community and connect with Nigerians around the world.";

export const metadata: Metadata = buildPageMetadata({ title, description, path, keywords: ["OK Movement diaspora", "Nigerians abroad", "diaspora community"] });

export default function Page() {
  return <><DiasporaPage /><JsonLd data={jsonLdGraph(webPageSchema({ title, description, path }), breadcrumbSchema([{ name: title, path }]))} /></>;
}
