import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { aboutPrincipals } from "@/components/home/about-principal-data";

type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

/**
 * `/home` is intentionally absent: it renders the same content as `/` and
 * canonicalises to it, so only `/` belongs in the sitemap.
 */
const staticEntries: Entry[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/home/our-movement", changeFrequency: "weekly", priority: 0.9 },
  { path: "/home/get-involved", changeFrequency: "weekly", priority: 0.9 },
  { path: "/home/getyourpvc", changeFrequency: "weekly", priority: 0.9 },
  { path: "/home/electioncalendar", changeFrequency: "weekly", priority: 0.9 },
  { path: "/home/votingprocedures", changeFrequency: "weekly", priority: 0.8 },
  { path: "/home/upcoming-events", changeFrequency: "daily", priority: 0.8 },
  { path: "/home/tech-volunteer", changeFrequency: "weekly", priority: 0.7 },
  { path: "/home/media-gallery", changeFrequency: "weekly", priority: 0.6 },
  { path: "/home/ask-ok", changeFrequency: "monthly", priority: 0.6 },
  { path: "/home/contact", changeFrequency: "monthly", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const principalEntries: MetadataRoute.Sitemap = Object.keys(aboutPrincipals).map((slug) => ({
    url: absoluteUrl(`/home/about/${slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    ...staticEntries.map((entry) => ({
      url: absoluteUrl(entry.path),
      lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    })),
    ...principalEntries,
  ];
}
