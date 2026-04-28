import Image from "next/image";
import Link from "next/link";

import { homeIssuesSection } from "@/components/home/home-data";

export default function HomeIssuesSection() {
  return (
    <section
      id={homeIssuesSection.id}
      className="grid bg-brand-green lg:grid-cols-2"
      aria-labelledby="issues-heading"
    >
      <div className="relative min-h-[22rem] lg:min-h-[30rem]">
        <Image
          src={homeIssuesSection.imageSrc}
          alt={homeIssuesSection.imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgb(0_0_0_/_0.4)_0%,rgb(0_166_81_/_0.08)_58%,transparent_100%)]" />

        <button
          type="button"
          className="absolute left-1/2 top-1/2 inline-flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white/95 text-white transition hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:h-28 sm:w-28 sm:border-[6px] lg:h-36 lg:w-36 lg:border-[9px]"
          aria-label="Play campaign video"
        >
          <span
            aria-hidden="true"
            className="ml-1.5 h-0 w-0 border-y-[12px] border-y-transparent border-l-[18px] border-l-white sm:ml-2 sm:border-y-[16px] sm:border-l-[24px] lg:border-y-[22px] lg:border-l-[34px]"
          />
        </button>
      </div>

      <article className="flex min-h-[22rem] items-center px-6 py-10 sm:px-10 sm:py-12 lg:min-h-[30rem] lg:px-16 lg:py-14">
        <div className="w-full max-w-xl">
          <p className="text-sm font-medium uppercase tracking-[0.45em] text-white/75">
            {homeIssuesSection.eyebrow}
          </p>
          <h2 id="issues-heading" className="mt-4 text-4xl font-medium tracking-tight text-white sm:text-5xl lg:text-6xl">
            {homeIssuesSection.title}
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-[1.4] text-white/88 sm:text-xl lg:mt-8 lg:text-2xl">
            {homeIssuesSection.description}
          </p>

          <Link
            href={homeIssuesSection.ctaHref}
            className="mt-8 rounded-[10px] inline-flex min-h-12 min-w-[12rem] items-center justify-center bg-brand-red px-6 text-sm font-medium uppercase tracking-[0.16em] text-white transition hover:bg-brand-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-h-14 sm:min-w-[14rem] sm:px-8 sm:text-base"
          >
            {homeIssuesSection.ctaLabel}
          </Link>
        </div>
      </article>
    </section>
  );
}
