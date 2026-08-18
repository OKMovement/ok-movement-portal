import type { Metadata } from "next";

/**
 * Single source of truth for every SEO-facing value on the site.
 * Override the canonical origin per-environment with NEXT_PUBLIC_SITE_URL.
 */
export const siteConfig = {
  name: "OK Movement",
  legalName: "OK Movement",
  tagline: "Character. Competence. Compassion. Capacity. Commitment.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://okmovement.ng").replace(/\/+$/, ""),
  locale: "en_NG",
  description:
    "The OK Movement is a people-powered Nigerian initiative behind Peter Obi and Rabiu Kwankwaso — restoring accountable leadership through character, competence, compassion, capacity and commitment.",
  ogImage: "/opengraph.jpg",
  ogImageWidth: 1280,
  ogImageHeight: 720,
  ogImageAlt: "OK Movement — a people-powered movement for a better Nigeria",
  twitterHandle: "@OK2027movement",
  contactEmail: "info@okmovement.ng",
  keywords: [
    "OK Movement",
    "Obi Kwankwaso",
    "Peter Obi",
    "Rabiu Kwankwaso",
    "Nigeria 2027 election",
    "Nigerian politics",
    "PVC registration",
    "INEC election calendar",
    "voting procedures Nigeria",
    "good governance Nigeria",
    "national rebirth",
  ],
  sameAs: [
    "https://www.facebook.com/share/1CYctYbA2m/?mibextid=wwXIfr",
    "https://x.com/OK2027movement",
    "https://www.instagram.com/p/DXM5eXZDKZ0/?igsh=ZWNpbmhudXJxdDJy",
    "https://www.youtube.com/@OKMediaChannel",
  ],
} as const;

/** Turns a site-relative path into a fully-qualified canonical URL. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageMetadataInput = {
  /** Page-specific title. Rendered as "<title> | OK Movement" via the root template. */
  title: string;
  description: string;
  /** Site-relative path used for the canonical URL and OG url. */
  path: string;
  keywords?: readonly string[];
  /** Site-relative or absolute image path. Defaults to the shared OG image. */
  image?: string;
  imageAlt?: string;
  /** Real pixel dimensions of `image` — crawlers reject mismatched values. */
  imageWidth?: number;
  imageHeight?: number;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
};

/**
 * Builds a complete, canonicalised Metadata object for a route so every page
 * ships consistent title/description/canonical/OG/Twitter tags.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  image = siteConfig.ogImage,
  imageAlt = siteConfig.ogImageAlt,
  imageWidth = siteConfig.ogImageWidth,
  imageHeight = siteConfig.ogImageHeight,
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    keywords: keywords ? [...keywords] : [...siteConfig.keywords],
    alternates: { canonical: url },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: type === "profile" ? "profile" : type,
      url,
      siteName: siteConfig.name,
      title: `${title} | ${siteConfig.name}`,
      description,
      locale: siteConfig.locale,
      images: [{ url: imageUrl, width: imageWidth, height: imageHeight, alt: imageAlt }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [imageUrl],
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                              JSON-LD builders                              */
/* -------------------------------------------------------------------------- */

type JsonLdObject = Record<string, unknown>;

export const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
export const WEBSITE_ID = `${siteConfig.url}/#website`;

export function organizationSchema(): JsonLdObject {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    alternateName: "Obi-Kwankwaso Movement",
    url: siteConfig.url,
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.svg"),
      caption: `${siteConfig.name} logo`,
    },
    image: absoluteUrl(siteConfig.ogImage),
    email: siteConfig.contactEmail,
    areaServed: { "@type": "Country", name: "Nigeria" },
    sameAs: [...siteConfig.sameAs],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "general enquiries",
        email: siteConfig.contactEmail,
        availableLanguage: ["English"],
        areaServed: "NG",
      },
    ],
  };
}

export function websiteSchema(): JsonLdObject {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "en-NG",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function webPageSchema({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): JsonLdObject {
  const url = absoluteUrl(path);
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: "en-NG",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    primaryImageOfPage: absoluteUrl(siteConfig.ogImage),
  };
}

/** `trail` excludes the implicit "Home" crumb, which is prepended here. */
export function breadcrumbSchema(trail: readonly { name: string; path: string }[]): JsonLdObject {
  const items = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: readonly { q: string; a: string }[]): JsonLdObject {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export function personSchema({
  name,
  description,
  path,
  image,
  jobTitle,
}: {
  name: string;
  description: string;
  path: string;
  image: string;
  jobTitle?: string;
}): JsonLdObject {
  const url = absoluteUrl(path);
  return {
    "@type": "Person",
    "@id": `${url}#person`,
    name,
    description,
    ...(jobTitle ? { jobTitle } : {}),
    url,
    image: absoluteUrl(image),
    nationality: { "@type": "Country", name: "Nigeria" },
    affiliation: { "@id": ORGANIZATION_ID },
  };
}

/** Wraps one or more schema nodes into a single `@graph` document. */
export function jsonLdGraph(...nodes: JsonLdObject[]): JsonLdObject {
  return { "@context": "https://schema.org", "@graph": nodes };
}
