import Link from "next/link";

import { homeMovementSection } from "@/components/home/home-data";
import HomeWaveAccent from "@/components/home/home-wave-accent";

export default function HomeMovementSection() {
  return (
    <section
      id={homeMovementSection.id}
      className="relative overflow-hidden bg-white py-14 text-brand-black sm:py-20 lg:py-24"
      aria-labelledby="movement-heading"
    >
      <HomeWaveAccent side="left" widthClassName="w-56" />

      <div className="relative mx-auto flex w-[min(100%-1.5rem,70rem)] justify-center md:pl-20 lg:pl-24">
        <article className="w-full max-w-4xl bg-transparent text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-brand-red">
            {homeMovementSection.eyebrow}
          </p>
          <h2 id="movement-heading" className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            {homeMovementSection.title}
          </h2>
          <p className="mx-auto mt-5 max-w-4xl text-balance text-base font-medium leading-relaxed text-black/75 sm:mt-6 sm:text-lg lg:text-xl">
            {homeMovementSection.description}
          </p>

          <div className="mx-auto mt-8 flex w-full max-w-[28rem] justify-center bg-white shadow-[0_14px_30px_rgb(0_0_0_/_0.1)] sm:mt-10 sm:max-w-[32rem]">
            <Link
              href={homeMovementSection.ctaHref}
              className="inline-flex min-h-12 w-[13.5rem] items-center justify-center border-2 border-brand-green px-6 text-sm font-black uppercase tracking-[0.15em] text-brand-green transition hover:bg-brand-green hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green sm:min-h-14 sm:w-[16rem] sm:px-8 sm:text-base"
            >
              {homeMovementSection.ctaLabel} <span aria-hidden="true" className="ml-2">→</span>
            </Link>
            <div aria-hidden="true" className="hidden flex-1 bg-white sm:block" />
          </div>
        </article>
      </div>
    </section>
  );
}
