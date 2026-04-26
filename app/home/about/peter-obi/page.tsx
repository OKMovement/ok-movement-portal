import type { Metadata } from "next";

import { aboutPrincipals } from "@/components/home/about-principal-data";
import AboutPrincipalPage from "@/components/home/about-principal-page";

const principal = aboutPrincipals["peter-obi"];

export const metadata: Metadata = {
  title: "About Peter Obi",
  description:
    "Learn more about Peter Obi's public-service record and role in the OK Movement.",
};

export default function PeterObiAboutPage() {
  return <AboutPrincipalPage principal={principal} />;
}
