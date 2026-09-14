import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

/**
 * Runs full-bleed into the footer so the page ends on one continuous dark
 * foot, rather than a floating black card marooned on a light ground.
 */
export default function HomeDonationBanner() {
  return (
    <section
      aria-labelledby="donation-banner-heading"
      className="grain grain-on-ink relative overflow-hidden bg-ink-raised text-white"
    >
      <span aria-hidden="true" className="rule-tricolor absolute inset-x-0 top-0 h-1">
        <span className="bg-brand-green" />
        <span className="bg-paper-sunk" />
        <span className="bg-brand-red" />
      </span>

      <div className="relative mx-auto grid w-[min(100%-2rem,82rem)] gap-10 py-16 sm:py-20 lg:grid-cols-[1.4fr_auto] lg:items-end lg:gap-20">
        <div>
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.28em] text-brand-red">
            Power the movement
          </p>
          <h2
            id="donation-banner-heading"
            className="mt-4 max-w-[20ch] font-display text-display-2 font-extrabold leading-[0.96] tracking-[-0.03em] text-balance"
          >
            Your support moves us closer to a{" "}
            <span className="text-green-ink">new Nigeria.</span>
          </h2>
          <p className="mt-6 max-w-[58ch] text-lead leading-relaxed text-white/70 text-pretty">
            Every contribution pays for organisers, printed material and the buses that get people
            to rallies. Give what you can and help carry the movement forward.
          </p>
        </div>

        <div className="lg:pb-2">
          <Link
            href="/home/donations"
            className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-brand-red px-8 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-red transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-ink active:translate-y-0 active:scale-[0.99] lg:w-auto"
          >
            Donate now
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
          <p className="mt-4 flex items-center gap-2 text-xs text-white/55">
            <ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-green-ink" />
            Secure checkout powered by Flutterwave
          </p>
        </div>
      </div>
    </section>
  );
}
