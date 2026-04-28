import Image from "next/image";
import Link from "next/link";

import type { AboutPrincipal } from "@/components/home/about-principal-data";
import HomeFooterSection from "@/components/home/home-footer-section";
import HomeSiteHeader from "@/components/home/home-site-header";

type AboutPrincipalPageProps = {
  principal: AboutPrincipal;
};

function ImagePair({ images }: { images: AboutPrincipal["gallery"] }) {
  return (
    <div className="mx-auto grid w-[min(100%-2rem,70rem)] gap-5 py-16 sm:py-20 lg:grid-cols-2 lg:py-24">
      {images.map((image) => (
        <div key={image.src} className="relative min-h-[19rem] overflow-hidden bg-black sm:min-h-[24rem] lg:min-h-[27rem]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export default function AboutPrincipalPage({ principal }: AboutPrincipalPageProps) {
  return (
    <main className="min-h-screen bg-white text-brand-black">
      <HomeSiteHeader />

      <section className="relative isolate min-h-[31rem] overflow-hidden sm:min-h-[36rem] lg:min-h-[42rem]">
        <Image
          src={principal.heroImage}
          alt={principal.heroAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        {/* <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(0_0_0_/_0.82)_0%,rgb(0_166_81_/_0.58)_42%,rgb(224_40_40_/_0.22)_72%,transparent_100%)]" /> */}
        {/* <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(0deg,rgb(0_166_81_/_0.72)_0%,rgb(0_166_81_/_0.22)_62%,transparent_100%)]" /> */}

        <div className="relative z-10 mx-auto flex min-h-[31rem] w-[min(100%-2rem,75rem)] items-end pb-16 pt-20 sm:min-h-[36rem] sm:pb-20 lg:min-h-[42rem]">
          <div className="max-w-3xl">
            <p className="text-xl font-medium uppercase tracking-[0.48em] text-white/75">
              {principal.eyebrow}
            </p>
            <h1 className="mt-4 text-5xl font-medium leading-[0.95] text-white sm:text-6xl lg:text-8xl">
              {principal.title}
            </h1>
          </div>
        </div>
      </section>

      <ImagePair images={principal.gallery} />

      <div className="mx-auto grid w-[min(100%-2rem,60rem)] gap-5 py-16 sm:py-20 lg:grid-cols-2">
        {[...principal.gallery].reverse().map((image) => (
          <div key={`second-${image.src}`} className="relative min-h-[18rem] overflow-hidden bg-black sm:min-h-[22rem]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="relative min-h-[24rem] overflow-hidden bg-brand-black sm:min-h-[32rem] lg:min-h-[38rem]">
        <Image
          src={principal.wideImage.src}
          alt={principal.wideImage.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <section className="bg-brand-green/10 px-4 py-16 text-center sm:py-20 lg:py-24">
        <p className="text-sm font-medium uppercase tracking-[0.45em] text-brand-red">
          Get Involved
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-medium leading-tight text-brand-green sm:text-5xl">
          Our movement is powered by working people
        </h2>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/home#get-involved"
            className="inline-flex min-h-14 w-full items-center justify-center bg-brand-red px-8 text-base font-medium uppercase tracking-wide text-white transition hover:bg-brand-black sm:w-auto"
          >
            Join the Movement
          </Link>
          <Link
            href={principal.ctaHref}
            className="inline-flex min-h-14 w-full items-center justify-center border-2 border-brand-green px-8 text-base font-medium uppercase tracking-wide text-brand-green transition hover:bg-brand-green hover:text-white sm:w-auto"
          >
            {principal.ctaLabel}
          </Link>
        </div>
      </section>

      <HomeFooterSection />
    </main>
  );
}
