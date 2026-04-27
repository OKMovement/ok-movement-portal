import Image from "next/image";
import Link from "next/link";

import { homeGetInvolvedSection } from "@/components/home/home-data";
import HomeSignupForm from "@/components/home/home-signup-form";

export default function HomeGetInvolvedSection() {
  return (
    <section
      id={homeGetInvolvedSection.id}
      className="relative overflow-hidden bg-white"
      aria-labelledby="get-involved-heading"
    >
      <div className="relative z-20 mx-auto w-[min(100%-1.5rem,72rem)] py-6 sm:py-8 lg:py-10">
        <div className="flex justify-center sm:justify-start">
          <Link
            href={homeGetInvolvedSection.topCtaHref}
            className="inline-flex min-h-12 w-full items-center justify-center border-[3px] border-brand-green bg-white px-6 text-sm font-medium uppercase tracking-[0.14em] text-brand-green transition hover:bg-brand-green hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green sm:min-h-14 sm:w-auto sm:min-w-[16rem] sm:px-8 sm:text-base lg:min-h-16 lg:min-w-[19rem] lg:border-4 lg:px-10 lg:text-lg"
          >
            {homeGetInvolvedSection.topCtaLabel} <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>
      </div>

      <div className="relative min-h-[30rem] sm:min-h-[36rem] lg:min-h-[42rem]">
        <Image
          src={homeGetInvolvedSection.imageSrc}
          alt={homeGetInvolvedSection.imageAlt}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(0_0_0_/_0.92)_0%,rgb(0_166_81_/_0.78)_34%,rgb(224_40_40_/_0.35)_62%,rgb(224_40_40_/_0.12)_78%,transparent_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[30rem] w-[min(100%-1.5rem,70rem)] items-center py-12 sm:min-h-[36rem] sm:py-14 lg:min-h-[42rem] lg:py-16">
          <article className="w-full max-w-[34rem] text-white">
            <p className="text-sm font-medium uppercase tracking-[0.45em] text-white/75">
              {homeGetInvolvedSection.eyebrow}
            </p>
            <h2 id="get-involved-heading" className="mt-3 text-5xl font-medium leading-[0.95] sm:mt-4 sm:text-6xl lg:text-7xl">
              {homeGetInvolvedSection.title}
            </h2>

            <HomeSignupForm
              formIdPrefix="footer-get-involved"
              submitLabel={homeGetInvolvedSection.submitLabel}
              ariaLabel="Get involved signup"
              className="mt-6 w-full max-w-[31rem]"
              buttonClassName="bg-brand-red hover:bg-brand-green"
            />
          </article>
        </div>
      </div>
    </section>
  );
}
