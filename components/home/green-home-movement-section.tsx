import Image from "next/image";
import Link from "next/link";

import { homeMovementSection } from "@/components/home/home-data";

export default function GreenHomeMovementSection() {
  return (
    <section
      id={homeMovementSection.id}
      className="relative overflow-hidden bg-white py-14 text-brand-black sm:py-20 flex items-center"
      aria-labelledby="movement-heading"
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

      {/* <HomeWaveAccent side="left" widthClassName="w-56" /> */}

      <div className="relative items-center z-10 mx-auto flex w-[min(100%-1.5rem,90rem)] justify-center">
        <article className="w-full max-w-[1000px] bg-transparent text-center">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-brand-red">
Get Involved
          </p>
          <h2 id="movement-heading" className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
            How to get Involved 
          </h2>
          <p className="mx-auto w-full mt-5 max-w-[800px] text-balance text-base font-medium leading-relaxed text-black/75 sm:mt-6 sm:text-lg lg:text-xl">
            The OK Movement is committed to building stronger, more connected communities through advocacy, awareness, and collective action. A key part of achieving this mission is forming meaningful partnerships that empower individuals at the grassroots level and create sustainable support systems.
          </p>

          <div className="mx-auto mt-8 flex w-full max-w-[28rem] justify-center bg-white  sm:mt-10">
            <Link
              href={homeMovementSection.ctaHref}
              className="inline-flex shadow-2xl rounded-[10px] min-h-12 w-[13.5rem] items-center justify-center border-2 border-brand-green px-6 text-sm font-medium uppercase tracking-[0.15em] text-brand-green transition hover:bg-brand-green hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green sm:min-h-14 sm:w-[16rem] sm:px-8 sm:text-base"
            >
              {homeMovementSection.ctaLabel} <span aria-hidden="true" className="ml-2">→</span>
            </Link>
            {/* <div aria-hidden="true" className="hidden flex-1 bg-white sm:block" /> */}
          </div>
        </article>
      </div>
    </section>
  );
}
