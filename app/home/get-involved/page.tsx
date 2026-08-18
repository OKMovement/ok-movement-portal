import type { Metadata } from "next";
import { Suspense } from "react";
import GetInvolvedPage from "@/components/home/get-involved-page";
import JsonLd from "@/components/seo/json-ld";
import { breadcrumbSchema, buildPageMetadata, jsonLdGraph, webPageSchema } from "@/lib/seo";

const path = "/home/get-involved";
const title = "Get Involved";
const description =
  "Join the OK Movement. Sign up as a member, volunteer in your state or the diaspora, donate, or help mobilise your community for Nigeria's national rebirth.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path,
  keywords: [
    "join OK Movement",
    "volunteer Nigeria election",
    "OK Movement membership",
    "donate OK Movement",
    "diaspora Nigerians volunteer",
  ],
});

export default function Page() {
  return (
    <>
      <Suspense
        fallback={
          <main className="min-h-screen bg-[#f7f7f4]">
            <div className="mx-auto w-[min(100%-2rem,80rem)] px-4 py-24 text-sm text-black/60">
              Loading get involved page...
            </div>
          </main>
        }
      >
        <GetInvolvedPage />
      </Suspense>
      <JsonLd
        data={jsonLdGraph(
          webPageSchema({ title, description, path }),
          breadcrumbSchema([{ name: title, path }]),
        )}
      />
    </>
  );
}
