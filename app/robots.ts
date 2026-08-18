import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // Staging/preview deployments must never be indexed.
  const isProduction = process.env.NEXT_PUBLIC_SITE_URL
    ? !/vercel\.app|netlify\.app|localhost/i.test(process.env.NEXT_PUBLIC_SITE_URL)
    : process.env.NODE_ENV === "production";

  if (!isProduction) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/_next/"],
      },
      // Keep the aggressive SEO crawlers off the site's crawl budget.
      { userAgent: "AhrefsBot", disallow: "/" },
      { userAgent: "SemrushBot", disallow: "/" },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
