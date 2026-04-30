import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "react-international-phone/style.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "900"],
  display: "swap",
  variable: "--font-poppins",
});
 
export const metadata: Metadata = {
  title: "OK Movement",
  description: "OK Movement — a movement for a better Nigeria.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "OK Movement",
    description: "OK Movement — a movement for a better Nigeria.",
    images: ["/opengraph.jpg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
