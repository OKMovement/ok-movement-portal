import { CheckCircle2 } from "lucide-react";
import { donationKinds } from "./get-involved-data";

function cardTone(tone: "green" | "red" | "black") {
  if (tone === "green") {
    return {
      iconWrap: "bg-brand-green text-white",
      eyebrow: "text-brand-green",
      glow: "bg-brand-green/12",
    } as const;
  }
  if (tone === "red") {
    return {
      iconWrap: "bg-brand-red text-white",
      eyebrow: "text-brand-red",
      glow: "bg-brand-red/12",
    } as const;
  }
  return {
    iconWrap: "bg-brand-black text-white",
    eyebrow: "text-brand-black",
    glow: "bg-black/8",
  } as const;
}

export default function DonationKindCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {donationKinds.map((kind, index) => {
        const tone = cardTone(kind.tone);
        const Icon = kind.icon;

        return (
          <article
            key={kind.title}
            className="group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-black/8 bg-white p-7 shadow-[0_22px_40px_-26px_rgb(0_0_0/0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_46px_-22px_rgb(0_0_0/0.4)] sm:p-8"
          >
            <span aria-hidden="true" className="absolute inset-x-0 top-0 flex h-[3px]">
              <span className="h-full flex-1 bg-brand-green" />
              <span className="h-full flex-1 bg-brand-black" />
              <span className="h-full flex-1 bg-brand-red" />
            </span>
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full ${tone.glow} blur-2xl`}
            />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${tone.iconWrap}`}>
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <span className={`text-[11px] font-semibold uppercase tracking-[0.32em] ${tone.eyebrow}`}>
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-medium leading-tight text-brand-black sm:text-2xl">
                {kind.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-black/70">{kind.short}</p>
              <ul className="mt-5 space-y-2 text-sm text-brand-black/80">
                {kind.examples.map((example) => (
                  <li key={example} className="flex items-start gap-2">
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        );
      })}
    </div>
  );
}
