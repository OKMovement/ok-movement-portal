"use client";

const COLORS = ["#00a651", "#e02828", "#f7c968", "#0b100c", "#ffffff"] as const;

/**
 * One-shot confetti burst. Positions come from the index, so there is no
 * randomness to hydrate. Mount it to fire; unmount it to stop. Hidden entirely
 * for visitors who prefer reduced motion (see globals.css).
 */
export default function Confetti({ pieces = 44 }: { pieces?: number }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: pieces }).map((_, i) => (
        <span
          key={i}
          className="confetti-piece block h-3 w-2 rounded-[2px]"
          style={
            {
              left: `${(i * 23) % 100}%`,
              background: COLORS[i % COLORS.length],
              "--dx": `${((i * 37) % 160) - 80}px`,
              "--rot": `${360 + ((i * 53) % 540)}deg`,
              "--dur": `${2 + ((i * 7) % 12) / 10}s`,
              animationDelay: `${(i % 9) * 70}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
