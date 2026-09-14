import Link from "next/link";
import { ArrowRight } from "lucide-react";

type StatItem = {
  stat: string;
  label: string;
};

type PrincipalsCtaSectionProps = {
  ctaHref: string;
  stats: StatItem[];
};

export default function PrincipalsCtaSection({ ctaHref, stats }: PrincipalsCtaSectionProps) {
  return (
    <div
      id="get-involved-movement"
      className="reveal grain grain-on-ink relative mt-24 overflow-hidden rounded-lg bg-ink text-white shadow-4 lg:mt-32"
    >
      <span aria-hidden="true" className="rule-tricolor absolute inset-x-0 top-0 h-1">
        <span className="bg-brand-green" />
        <span className="bg-paper-sunk" />
        <span className="bg-brand-red" />
      </span>

      <div className="relative grid gap-12 px-6 py-14 sm:px-10 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-16 lg:px-14 lg:py-16">
        <div>
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.28em] text-green-ink">
            Get involved
          </p>
          <h3 className="mt-4 max-w-[16ch] font-display text-display-3 font-extrabold leading-[0.98] tracking-[-0.025em] text-balance">
            Be part of the rebirth. Join the movement.
          </h3>
          <p className="mt-5 max-w-[58ch] leading-relaxed text-white/70 text-pretty">
            The OK Movement builds stronger, better-connected communities through advocacy,
            awareness and collective action — with partnerships that put power back in the hands of
            Nigerians at the grassroots.
          </p>

          <Link
            href={ctaHref}
            className="group mt-9 inline-flex min-h-13 items-center gap-2.5 rounded-md bg-brand-green px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition duration-200 hover:bg-white hover:text-ink active:scale-[0.99]"
          >
            Find your role
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-7 border-t border-white/15 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
          {stats.map((item) => (
            <div key={item.label}>
              <dt className="sr-only">{item.label}</dt>
              <dd>
                <span className="block font-display text-4xl font-extrabold leading-none tracking-[-0.03em] tabular-nums sm:text-[2.75rem]">
                  {item.stat}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-2.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-white/55"
                >
                  {item.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
