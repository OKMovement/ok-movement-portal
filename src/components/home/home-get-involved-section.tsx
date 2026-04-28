"use client";

import { homeGetInvolvedSection } from "./home-data";
import HomeSignupForm from "./home-signup-form";

export default function HomeGetInvolvedSection() {
  return (
    <section
      id={homeGetInvolvedSection.id}
      className="relative overflow-hidden bg-white"
      aria-labelledby="get-involved-heading"
    >
      <div className="relative min-h-[30rem] sm:min-h-[36rem] lg:min-h-[42rem]">
        <img
          src={homeGetInvolvedSection.imageSrc}
          alt={homeGetInvolvedSection.imageAlt}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(0_0_0_/_0.92)_0%,rgb(0_166_81_/_0.78)_34%,rgb(224_40_40_/_0.35)_62%,rgb(224_40_40_/_0.12)_78%,transparent_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[30rem] w-[min(100%-1.5rem,70rem)] items-center py-12 sm:min-h-[36rem] sm:py-14 lg:min-h-[42rem] lg:py-16">
          <article className="w-full max-w-[34rem] text-white">
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