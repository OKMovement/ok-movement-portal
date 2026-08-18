import type { Metadata } from "next";

/**
 * Everything under the (admin) route group is private. Belt-and-braces with
 * the robots.txt disallow — robots.txt stops crawling, this stops indexing of
 * any URL that gets discovered another way (e.g. an external link).
 */
export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
