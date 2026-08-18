import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AboutPrincipalPage from "@/components/home/about-principal-page";
import { aboutPrincipals } from "@/components/home/about-principal-data";
import JsonLd from "@/components/seo/json-ld";
import {
  breadcrumbSchema,
  buildPageMetadata,
  jsonLdGraph,
  personSchema,
  webPageSchema,
} from "@/lib/seo";

type RouteParams = { slug: string };

function getPrincipal(slug: string) {
  return aboutPrincipals[slug as keyof typeof aboutPrincipals] ?? null;
}

/** First two intro paragraphs, trimmed to a search-friendly meta description. */
function toDescription(principal: NonNullable<ReturnType<typeof getPrincipal>>) {
  const raw = principal.introParagraphs[0] ?? principal.introHeading;
  return raw.length > 300 ? `${raw.slice(0, 297).trimEnd()}…` : raw;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const principal = getPrincipal(slug);

  if (!principal) {
    return {
      title: "Profile not found",
      robots: { index: false, follow: false },
    };
  }

  return buildPageMetadata({
    title: `${principal.name} — ${principal.introHeading}`,
    description: toDescription(principal),
    path: `/home/about/${principal.slug}`,
    type: "profile",
    image: principal.heroImage,
    imageAlt: principal.heroAlt,
    imageWidth: 2048,
    imageHeight: 1152,
    keywords: [
      principal.name,
      `${principal.name} profile`,
      `${principal.name} track record`,
      "OK Movement",
      "Nigeria 2027 election",
      "Nigerian leadership",
    ],
  });
}

export default async function Page({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const principal = getPrincipal(slug);

  if (!principal) {
    notFound();
  }

  const path = `/home/about/${principal.slug}`;
  const title = `${principal.name} — ${principal.introHeading}`;
  const description = toDescription(principal);

  return (
    <>
      <AboutPrincipalPage principal={principal} />
      <JsonLd
        data={jsonLdGraph(
          webPageSchema({ title, description, path }),
          breadcrumbSchema([
            { name: "Our Movement", path: "/home/our-movement" },
            { name: principal.name, path },
          ]),
          personSchema({
            name: principal.name,
            description,
            path,
            image: principal.heroImage,
          }),
        )}
      />
    </>
  );
}

export function generateStaticParams(): RouteParams[] {
  return Object.keys(aboutPrincipals).map((slug) => ({ slug }));
}
