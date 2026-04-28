import { notFound } from "next/navigation";
import AboutPrincipalPage from "@/components/home/about-principal-page";
import { aboutPrincipals } from "@/components/home/about-principal-data";

type RouteParams = { slug: string };

export default async function Page({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const principal = aboutPrincipals[slug as keyof typeof aboutPrincipals];

  if (!principal) {
    notFound();
  }

  return <AboutPrincipalPage principal={principal} />;
}

export function generateStaticParams(): RouteParams[] {
  return Object.keys(aboutPrincipals).map((slug) => ({ slug }));
}
