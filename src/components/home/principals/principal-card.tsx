import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { PrincipalCardContent } from "./principals-content";

type PrincipalCardProps = PrincipalCardContent & {
  /** Two-digit ticket position, printed in the card's gutter. */
  index: string;
  /** Offsets the second card so the pair reads as a spread, not a 2-up grid. */
  offset?: boolean;
};

export default function PrincipalCard({
  imageSrc,
  name,
  badge,
  description,
  href,
  index,
  offset = false,
}: PrincipalCardProps) {
  return (
    <Link
      href={href}
      className={`reveal group relative flex flex-col border border-rule bg-paper-raised transition duration-300 hover:-translate-y-1 hover:border-green-deep hover:shadow-4 ${
        offset ? "lg:mt-16" : ""
      }`}
      style={offset ? ({ "--reveal-delay": "140ms" } as React.CSSProperties) : undefined}
    >
      {/* Portrait sits on a flat ink field — no blurred orbs, no gradient wash. */}
      <div className="relative aspect-[5/4] overflow-hidden bg-ink">
        <Image
          src={imageSrc}
          alt={`Portrait of ${name}`}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span
          aria-hidden="true"
          className="absolute left-5 top-5 font-display text-sm font-bold tabular-nums text-white/50"
        >
          {index}
        </span>
        <span aria-hidden="true" className="rule-tricolor absolute inset-x-0 bottom-0 h-1">
          <span className="bg-brand-green" />
          <span className="bg-paper-sunk" />
          <span className="bg-brand-red" />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8">
        <div>
          <h3 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-ink sm:text-[1.75rem]">
            {name}
          </h3>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-green-deep">
            {badge}
          </p>
        </div>
        <p className="max-w-[52ch] text-sm leading-relaxed text-body text-pretty sm:text-[15px]">
          {description}
        </p>
        {/* mt-auto pins the CTA to the card floor so both cards' links line up
            regardless of how long the descriptions run. */}
        <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold tracking-wide text-ink transition-colors duration-200 group-hover:text-green-deep">
          About {name.split(" ")[0]}
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
