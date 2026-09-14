import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      // Admin media uploads are served from Cloudinary.
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Campaign-film poster fallback when the media API has no entry yet.
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
    // Modern formats cut LCP weight, which feeds Core Web Vitals.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        // Crawlers must never index API responses.
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
