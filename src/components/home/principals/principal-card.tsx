import { ArrowUpRight } from "lucide-react";
import type { PrincipalCardContent } from "./principals-content";

export default function PrincipalCard({
  imageSrc,
  name,
  badge,
  description,
  href,
  accent,
}: PrincipalCardContent) {
  const accentBg = accent === "green" ? "bg-brand-green" : "bg-brand-red";
  const accentText = accent === "green" ? "text-brand-green" : "text-brand-red";
  const ringClass =
    accent === "green" ? "group-hover:ring-brand-green/30" : "group-hover:ring-brand-red/30";

  return (
    <a
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_24px_50px_-28px_rgb(0_0_0/0.35)] ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-[0_32px_60px_-24px_rgb(0_0_0/0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
    >
      <div className={`relative overflow-hidden ${accentBg} ring-1 transition ${ringClass}`}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/[0.12] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-black/[0.18] blur-2xl"
        />
        <div className="relative flex aspect-[4/3] items-end justify-end px-6 pt-6">
          <img
            src={imageSrc}
            alt={`Portrait of ${name}`}
            className="h-full w-auto max-h-[22rem] object-contain object-right-bottom drop-shadow-[0_18px_30px_rgb(0_0_0/0.35)] transition duration-500 group-hover:scale-[1.02]"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-brand-black sm:text-[1.6rem]">
            {name}
          </h3>
          <p className={`mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${accentText}`}>
            {badge}
          </p>
        </div>
        <p className="text-sm leading-relaxed text-brand-black/70 sm:text-[15px]">{description}</p>
        <div
          className={`mt-auto inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] ${accentText}`}
        >
          About {name.split(" ")[0]}
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </a>
  );
}
