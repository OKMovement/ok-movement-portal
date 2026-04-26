import type { Metadata } from "next";

import { aboutPrincipals } from "@/components/home/about-principal-data";
import AboutPrincipalPage from "@/components/home/about-principal-page";

const principal = aboutPrincipals["rabiu-kwankwaso"];

export const metadata: Metadata = {
  title: "About Rabiu Kwankwaso",
  description:
    "Learn more about Rabiu Kwankwaso's public-service record and role in the OK Movement.",
};

export default function RabiuKwankwasoAboutPage() {
  return <AboutPrincipalPage principal={principal} />;
}
