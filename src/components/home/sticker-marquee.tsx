type StickerMarqueeProps = {
  items: readonly string[];
  /** `ink` for light pages, `sun` where the band sits on a dark section. */
  tone?: "ink" | "sun";
  /** Slight tilt makes the band read as stuck on, not part of the grid. */
  tilt?: boolean;
  className?: string;
};

/** Decorative sliding ticker. Hidden from assistive tech — it only repeats calls to action. */
export default function StickerMarquee({
  items,
  tone = "ink",
  tilt = false,
  className = "",
}: StickerMarqueeProps) {
  const palette =
    tone === "ink" ? "bg-ink text-white" : "bg-[#f7c968] text-ink border-y-2 border-ink";
  const star = tone === "ink" ? "text-[#f7c968]" : "text-brand-red";

  const row = (key: string) => (
    <ul key={key} className="flex shrink-0 items-center gap-7 pr-7">
      {[...items, ...items].map((item, i) => (
        <li key={`${key}-${i}`} className="flex items-center gap-7">
          <span className="whitespace-nowrap font-display text-xl font-extrabold uppercase tracking-tight sm:text-2xl">
            {item}
          </span>
          <span aria-hidden="true" className={star}>
            ★
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden py-3.5 ${palette} ${tilt ? "-rotate-1 scale-[1.02]" : ""} ${className}`}
    >
      <div className="hashtag-marquee flex w-max">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
