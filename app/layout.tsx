import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const siteTitle = "OK Movement | Obi/Kwankwaso 2027";
const siteDescription =
  "The OK Movement is a people-powered initiative uniting Nigerians around accountable leadership, integrity, competence, and national rebirth.";
const productionUrl = "https://www.okmovement.org";

function getSiteUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    productionUrl;

  return new URL(siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`);
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "900"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: siteTitle,
    template: "%s | OK Movement",
  },
  alternates: {
    canonical: "/",
  },
  description: siteDescription,
  applicationName: "OK Movement",
  keywords: [
    "OK Movement",
    "Obi Kwankwaso 2027",
    "Obi/Kwankwaso 2027",
    "Peter Obi",
    "Rabiu Kwankwaso",
    "Nigeria leadership",
    "accountable governance",
    "New Nigeria",
  ],
  authors: [{ name: "OK Movement" }],
  creator: "OK Movement",
  publisher: "OK Movement",
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: "OK Movement",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
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
  icons: {
    icon: [{ url: "/images/logo.png", type: "image/png" }],
    shortcut: ["/images/logo.png"],
    apple: [{ url: "/images/logo.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
