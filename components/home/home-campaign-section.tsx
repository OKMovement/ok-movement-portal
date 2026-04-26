import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { homeCampaignSection } from "@/components/home/home-data";
import HomeWaveAccent from "@/components/home/home-wave-accent";

export default function HomeCampaignSection() {
  return (
    <section
      id={homeCampaignSection.id}
      className="relative overflow-hidden bg-white py-14 text-brand-black sm:py-20 lg:py-24"
      aria-labelledby="campaign-heading"
    >
      <HomeWaveAccent side="right" widthClassName="w-56" />

      <div className="relative mx-auto w-[min(100%-1.5rem,82rem)] md:pr-16 lg:pr-24">
        <header className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.45em] text-brand-red">
            {homeCampaignSection.eyebrow}
          </p>
          <h2 id="campaign-heading" className="mt-3 text-3xl font-black tracking-tight text-brand-black sm:text-4xl lg:text-5xl">
            {homeCampaignSection.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-black/65 sm:text-lg">
            {homeCampaignSection.description}
          </p>
        </header>

        <details className="group mx-auto mt-8 w-full max-w-2xl bg-white shadow-[0_18px_38px_rgb(0_0_0_/_0.12)] md:mt-10 xl:mt-12">
          <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-4 bg-brand-green px-5 text-left text-xl font-black text-white transition hover:bg-brand-black [&::-webkit-details-marker]:hidden sm:px-7 sm:text-2xl">
            <span>{homeCampaignSection.title}</span>
            <ChevronDown aria-hidden="true" className="h-6 w-6 shrink-0 transition group-open:rotate-180" />
          </summary>

          <div className="divide-y divide-black/10 border border-t-0 border-black/10">
            {homeCampaignSection.items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="block px-5 py-5 transition hover:bg-brand-green/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red sm:px-7 sm:py-6"
              >
                <span className="block text-lg font-black text-brand-black sm:text-xl">
                  {item.label}
                </span>
                <span className="mt-2 block text-sm font-medium leading-relaxed text-black/65 sm:text-base">
                  {item.description}
                </span>
              </Link>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}
