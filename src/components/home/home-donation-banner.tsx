import { ArrowUpRight, Heart, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function HomeDonationBanner() {
  return (
    <section
      aria-labelledby="donation-banner-heading"
      className="bg-[#fafaf7] px-3 pb-16 pt-4 sm:px-4 sm:pb-20 lg:pb-28"
    >
      <div className="relative mx-auto w-full max-w-[80rem] overflow-hidden rounded-[1.75rem] bg-brand-black px-6 py-10 text-white shadow-[0_32px_80px_-38px_rgba(4,18,11,0.75)] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 flex h-1.5">
          <span className="flex-1 bg-brand-green" />
          <span className="flex-1 bg-white" />
          <span className="flex-1 bg-brand-red" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-brand-green/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-brand-red/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:24px_24px]"
        />

        <div className="relative grid items-center gap-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-white/80 backdrop-blur">
              <Heart
                aria-hidden="true"
                className="h-3.5 w-3.5 fill-brand-red text-brand-red"
              />
              Power the movement
            </div>
            <h2
              id="donation-banner-heading"
              className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.8rem]"
            >
              Your support moves us closer to a{" "}
              <span className="text-brand-green">new Nigeria.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              Every contribution helps us organize, communicate, and mobilize
              communities across the country. Give what you can and help carry
              the movement forward.
            </p>
          </div>

          <div className="flex flex-col items-start lg:min-w-64 lg:items-stretch">
            <Link
              href="/home/donations"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-brand-green px-7 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_20px_45px_-16px_rgb(0_166_81/0.8)] transition hover:-translate-y-0.5 hover:bg-white hover:text-brand-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Donate now
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
            <p className="mt-4 flex items-center gap-2 text-xs text-white/60">
              <ShieldCheck
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-brand-green"
              />
              Secure checkout powered by Flutterwave
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
