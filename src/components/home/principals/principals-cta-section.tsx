import { Sparkles } from "lucide-react";

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
      className="relative mt-20 overflow-hidden rounded-3xl bg-brand-green text-white shadow-[0_30px_60px_-30px_rgb(0_166_81/0.45)] lg:mt-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/[0.08] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-black/[0.20] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand-green via-white/70 to-brand-red"
      />

      <div className="relative grid gap-10 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-14 lg:px-16 lg:py-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white ring-1 ring-white/20 backdrop-blur">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
            Get Involved
          </div>
          <h3 className="mt-4 text-balance text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl lg:text-[2.6rem]">
            Be part of the rebirth. Join the movement.
          </h3>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            The OK Movement is committed to building stronger, more connected communities through advocacy, awareness,
            and collective action — with meaningful partnerships that empower Nigerians at the grassroots.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href={ctaHref}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] border border-white/30 bg-white/10 px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white backdrop-blur transition hover:bg-white hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-h-[3.25rem]"
            >
              Learn How
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-white/[0.10] p-4 ring-1 ring-white/15 backdrop-blur sm:p-5"
            >
              <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{item.stat}</p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white/75">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
