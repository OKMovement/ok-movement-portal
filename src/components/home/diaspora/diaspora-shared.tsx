import Image from "next/image";

/** The campaign's own tricolour, used as the recurring structural device. */
export function TricolorRule({
  className = "h-[3px] w-14 rounded-full",
}: {
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={`rule-tricolor ${className}`}>
      <span className="bg-brand-green" />
      <span className="bg-paper-sunk" />
      <span className="bg-brand-red" />
    </span>
  );
}

/** Eyebrow in the margin, heading and standfirst against the grid. */
export function SectionHeader({
  eyebrow,
  heading,
  standfirst,
  id,
  tone = "light",
}: {
  eyebrow: string;
  heading: React.ReactNode;
  standfirst?: string;
  id?: string;
  tone?: "light" | "ink";
}) {
  const isInk = tone === "ink";
  return (
    <div
      className={`reveal grid gap-6 border-t pt-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16 ${
        isInk ? "border-white/15" : "border-rule"
      }`}
    >
      <p
        className={`font-display text-[11px] font-bold uppercase tracking-[0.28em] ${
          isInk ? "text-green-ink" : "text-green-deep"
        }`}
      >
        {eyebrow}
      </p>
      <div>
        <h2
          id={id}
          className={`max-w-[20ch] font-display text-display-2 font-extrabold leading-[0.96] tracking-[-0.03em] text-balance ${
            isInk ? "text-white" : "text-ink"
          }`}
        >
          {heading}
        </h2>
        {standfirst ? (
          <p
            className={`mt-6 max-w-[62ch] text-lead leading-relaxed text-pretty ${
              isInk ? "text-white/70" : "text-body"
            }`}
          >
            {standfirst}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** The background device on light sections, in place of a gradient wash. */
export function LogoWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[min(60%,44rem)] select-none opacity-[0.06]"
    >
      <Image
        src="/images/new-logo.png"
        alt=""
        fill
        sizes="(min-width: 1024px) 44rem, 60vw"
        className="object-contain object-right"
      />
    </div>
  );
}

export function FieldLabel({
  children,
  optional,
}: {
  children: React.ReactNode;
  optional?: string;
}) {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
      {children}
      {optional ? (
        <span className="ml-1.5 normal-case tracking-normal text-faint">{optional}</span>
      ) : (
        <span className="text-brand-red"> *</span>
      )}
    </span>
  );
}
