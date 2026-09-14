import type { Metadata } from "next";
import { Archivo, Poppins } from "next/font/google";
import "./globals.css";
import "react-international-phone/style.css";
import AskOkFab from "../components/ask-ok-fab";
import JsonLd from "@/components/seo/json-ld";
import { jsonLdGraph, organizationSchema, siteConfig, websiteSchema } from "@/lib/seo";

// Weights match what the markup actually uses. 900 was downloaded and never
// referenced; 500 was referenced and never loaded, so it rendered synthesised.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-poppins",
});

// Display face for headlines, stats and index numerals. Archivo's tight
// apertures and full weight range give the campaign headlines poster presence
// that Poppins alone cannot carry.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — A New Dawn for Nigeria`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "politics",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/images/new-logo.png", type: "image/png" }],
    shortcut: "/images/new-logo.png",
    apple: "/images/new-logo.png",
  },
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false, email: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — A New Dawn for Nigeria`,
    description: siteConfig.description,
    locale: siteConfig.locale,
    images: [
      {
        url: siteConfig.ogImage,
        width: siteConfig.ogImageWidth,
        height: siteConfig.ogImageHeight,
        alt: siteConfig.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: `${siteConfig.name} — A New Dawn for Nigeria`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  // Fill these in from Search Console / Bing Webmaster Tools when available.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : {},
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  // No maximumScale: capping zoom at 1 blocks pinch-to-zoom (WCAG 1.4.4).
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-NG" className={`${poppins.variable} ${archivo.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
        <AskOkFab />
        <JsonLd data={jsonLdGraph(organizationSchema(), websiteSchema())} />
      </body>
    </html>
  );
}
