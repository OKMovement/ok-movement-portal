"use client";

import { Download, FileImage, Loader2, Play } from "lucide-react";
import { useEffect, useState } from "react";
import HomeFooterSection from "./home-footer-section";
import HomeSiteHeader from "./home-site-header";

type CampaignMaterial = {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  linkUrl: string;
  category: string;
};

type CampaignMaterialsPageProps = { type: "designs" | "videos" };

export default function CampaignMaterialsPage({ type }: CampaignMaterialsPageProps) {
  const isVideo = type === "videos";
  const [items, setItems] = useState<CampaignMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const categories = isVideo ? ["campaign-video"] : ["campaign-flier", "campaign-banner"];
    Promise.all(categories.map((category) => fetch(`/api/media?category=${category}`, { cache: "no-store" }).then((response) => response.json())))
      .then((results) => setItems(results.flatMap((result) => result.media ?? [])))
      .finally(() => setLoading(false));
  }, [isVideo]);

  const title = isVideo ? "Campaign Videos" : "Fliers & Banner Designs";
  const description = isVideo
    ? "Watch and share official OK Movement campaign videos."
    : "Download official campaign fliers and banner designs to print, share, and use in your community.";

  return (
    <main className="min-h-screen bg-[#fafaf7] text-brand-black">
      <HomeSiteHeader />
      <section className="border-b border-brand-black/10 bg-brand-black px-4 py-16 text-white sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-green">Campaign Materials</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">{description}</p>
        </div>
      </section>
      <section className="mx-auto w-[min(100%-2rem,76rem)] py-12 sm:py-16">
        {loading ? (
          <div className="flex items-center gap-3 py-16 text-brand-black/60"><Loader2 className="h-5 w-5 animate-spin" /> Loading materials…</div>
        ) : items.length === 0 ? (
          <div className="border border-dashed border-brand-black/20 bg-white px-6 py-16 text-center">
            <FileImage className="mx-auto h-8 w-8 text-brand-green" />
            <h2 className="mt-4 text-xl font-semibold">Materials are coming soon</h2>
            <p className="mt-2 text-sm text-brand-black/60">Please check back for official campaign resources.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="overflow-hidden border border-brand-black/10 bg-white">
                {isVideo ? (
                  <video controls preload="metadata" poster={item.imageUrl} className="aspect-video w-full bg-brand-black object-cover">
                    <source src={item.linkUrl} />
                    Your browser does not support video playback.
                  </video>
                ) : (
                  <img src={item.imageUrl} alt={item.title} className="aspect-[4/3] w-full object-cover" />
                )}
                <div className="p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-green">{item.category.replace("campaign-", "")}</p>
                  <h2 className="mt-2 text-lg font-semibold">{item.title}</h2>
                  {item.description ? <p className="mt-2 text-sm leading-relaxed text-brand-black/65">{item.description}</p> : null}
                  <a href={item.linkUrl || item.imageUrl} download={!isVideo} target={isVideo ? "_blank" : undefined} rel={isVideo ? "noreferrer" : undefined} className="mt-5 inline-flex min-h-11 items-center gap-2 bg-brand-black px-4 text-sm font-semibold text-white transition hover:bg-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green">
                    {isVideo ? <Play className="h-4 w-4 fill-current" /> : <Download className="h-4 w-4" />}
                    {isVideo ? "Open video" : "Download design"}
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <HomeFooterSection />
    </main>
  );
}
