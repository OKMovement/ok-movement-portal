import { readdirSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { homeCampaignSection } from "@/components/home/home-data";
import HomeTestimonialMarquee from "@/components/home/home-testimonial-marquee";

type TestimonialPair = {
  id: string;
  frontSrc: string;
  backSrc: string;
  alt: string;
};

function formatAltFromId(id: string) {
  return id
    .split("-")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function getTestimonialPairs() {
  const answersDirectory = path.join(process.cwd(), "public", "answers");
  const answerFiles = readdirSync(answersDirectory);
  const pairMap = new Map<string, { frontSrc?: string; backSrc?: string }>();

  for (const fileName of answerFiles) {
    const match = fileName.match(/^(.+)-([12])\.(png|jpe?g|webp|avif)$/i);
    if (!match) {
      continue;
    }

    const [, id, side] = match;
    const pair = pairMap.get(id) ?? {};
    const filePath = `/answers/${fileName}`;

    if (side === "1") {
      pair.frontSrc = filePath;
    } else {
      pair.backSrc = filePath;
    }

    pairMap.set(id, pair);
  }

  return Array.from(pairMap.entries())
    .map(([id, pair]) => {
      if (!pair.frontSrc || !pair.backSrc) {
        return null;
      }

      return {
        id,
        frontSrc: pair.frontSrc,
        backSrc: pair.backSrc,
        alt: formatAltFromId(id),
      } satisfies TestimonialPair;
    })
    .filter((pair): pair is TestimonialPair => pair !== null)
    .sort((a, b) => a.id.localeCompare(b.id));
}

export default function HomeCampaignSection() {
  const testimonialPairs = getTestimonialPairs();

  return (
    <section
      id={homeCampaignSection.id}
      className="relative overflow-hidden bg-white py-14 text-brand-black sm:py-20 lg:py-24"
      aria-labelledby="campaign-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-0 flex translate-x-3 select-none opacity-[0.08] sm:translate-x-12"
      >
        <Image
          src="/images/new-logo.png"
          alt=""
          width={620}
          height={1240}
          sizes="(max-width: 640px) 9rem, (max-width: 768px) 12rem, (max-width: 1024px) 16rem, 20rem"
          className="h-full w-auto max-w-none object-contain object-right"
        />
      </div>

      <div className="relative z-10 mx-auto w-[min(100%-1.5rem,82rem)] md:pr-16 lg:pr-24">
        <header className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.45em] text-brand-red">
            {homeCampaignSection.eyebrow}
          </p>
          <h2 id="campaign-heading" className="mt-3 text-3xl font-medium tracking-tight text-brand-black sm:text-4xl lg:text-5xl">
            {homeCampaignSection.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-black/65 sm:text-lg">
            {homeCampaignSection.description}
          </p>
        </header>

        <details className="group mx-auto mt-8 w-full max-w-2xl bg-white shadow-[0_18px_38px_rgb(0_0_0_/_0.12)] md:mt-10 xl:mt-12">
          <summary className="flex min-h-20 rounded-[10px] cursor-pointer list-none items-center justify-between gap-4 bg-brand-green px-5 text-left text-xl font-medium text-white transition hover:bg-brand-black [&::-webkit-details-marker]:hidden sm:px-7 sm:text-2xl">
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
                <span className="block text-lg font-medium text-brand-black sm:text-xl">
                  {item.label}
                </span>
                <span className="mt-2 block text-sm font-medium leading-relaxed text-black/65 sm:text-base">
                  {item.description}
                </span>
              </Link>
            ))}
          </div>
        </details>

        <HomeTestimonialMarquee cards={testimonialPairs} />
      </div>
    </section>
  );
}
