import BullhornIcon from "./bullhorn-icon";
import { FOOTER_CONTENT, HERO_CONTENT } from "./coming-soon-constants";

type ComingSoonHeroProps = {
  canChangeSlide: boolean;
  onNextSlide: () => void;
};

function SlideControl({
  canChangeSlide,
  className,
  onNextSlide,
}: ComingSoonHeroProps & { className: string }) {
  return (
    <button
      aria-label="Show next slide"
      className={className}
      disabled={!canChangeSlide}
      type="button"
      onClick={onNextSlide}
    >
      <BullhornIcon className="h-5 w-5" />
    </button>
  );
}

export default function ComingSoonHero({
  canChangeSlide,
  onNextSlide,
}: ComingSoonHeroProps) {
  const movementKeyword = "OK MOVEMENT";
  const keywordIndex = HERO_CONTENT.movementDescriptionFirst.indexOf(movementKeyword);

  const movementDescriptionFirstStyled =
    keywordIndex === -1 ? (
      HERO_CONTENT.movementDescriptionFirst
    ) : (
      <>
        {HERO_CONTENT.movementDescriptionFirst.slice(0, keywordIndex)}
        <span className="font-bold text-brand-red">{movementKeyword}</span>
        {HERO_CONTENT.movementDescriptionFirst.slice(
          keywordIndex + movementKeyword.length
        )}
      </>
    );

  return (
    <>
      <section className="relative flex flex-1 flex-col justify-center px-5 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-5 md:px-10 md:pb-14 md:pt-8 lg:px-16 lg:pb-20 lg:pt-10 xl:px-20 xl:pb-24 xl:pt-14">
        <div className="relative lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-16 xl:gap-20">
          <div className="max-w-[46rem] lg:flex lg:min-h-[30rem] lg:max-w-none lg:flex-col lg:justify-center lg:pr-10 xl:min-h-[32rem] xl:pr-16">
            {/* <p className="mb-3 text-[0.82rem] tracking-[0.18em] text-white/85 uppercase md:text-[0.95rem]">
              {HERO_CONTENT.kicker}
            </p> */}
            <h1 className="text-[2.35rem] leading-[0.95] font-black tracking-wide sm:text-[2.9rem] md:text-[3.7rem] lg:text-[4.4rem] xl:text-[5.2rem]">
              {HERO_CONTENT.titleLines.map((line) => (
                <span key={line} className="mt-2 block first:mt-0">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-4 max-w-[44rem] text-[1rem] leading-tight sm:text-[1.1rem] md:text-[1.3rem] lg:text-[1.45rem] xl:text-[1.55rem]">
              {HERO_CONTENT.subtitle}
            </p>
            {/* <p className="mt-4 inline-block border border-white/50 bg-black/30 px-3 py-2 text-[0.74rem] font-semibold tracking-[0.14em] uppercase sm:px-4 sm:text-[0.8rem] md:text-[0.9rem] lg:text-[0.95rem]">
              {HERO_CONTENT.comingText}
            </p> */}
            <p className="mt-4 max-w-[40rem] text-[0.9rem] text-white/85 italic sm:text-[0.95rem] md:text-[1.02rem] lg:text-[1.05rem]">
              {HERO_CONTENT.anthemQuote}
            </p>
            <div className="mt-7 shrink-0 text-[0.95rem] sm:text-[1rem] md:text-[1.05rem]">{FOOTER_CONTENT.socialLabel}</div>
          </div>

          <div className="hidden lg:block lg:min-h-[30rem] lg:pl-10 xl:min-h-[32rem] xl:pl-16">
            <div className="flex h-full flex-col justify-center rounded-[20px] border border-white/30 bg-brand-green/35 p-6 text-[1rem] leading-relaxed text-white/92 xl:p-8 xl:text-[1.15rem]">
              <p>{movementDescriptionFirstStyled}</p>
              <ul className="mt-4 list-disc space-y-1 pl-6 font-semibold">
                {HERO_CONTENT.movementCriteria.map((criterion) => (
                  <li key={criterion}>{criterion}</li>
                ))}
              </ul>
              <p className="mt-5">{HERO_CONTENT.movementDescriptionSecond}</p>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden -translate-x-1/2 lg:block">
            <span className="block h-full w-px bg-white/65" />
          </div>

          <SlideControl
            canChangeSlide={canChangeSlide}
            className="pointer-events-auto absolute -bottom-8 left-1/2 z-10 hidden h-14 w-14 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border border-white/85 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40 lg:inline-flex"
            onNextSlide={onNextSlide}
          />
        </div>

        <div className="mt-7 flex items-center gap-4 lg:hidden">
          <span className="h-px flex-1 bg-white/80" />
          <SlideControl
            canChangeSlide={canChangeSlide}
            className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/85 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40 sm:h-16 sm:w-16"
            onNextSlide={onNextSlide}
          />
        </div>

        <div className="mt-4 rounded-[18px] border border-white/30 bg-brand-green/35 p-4 text-[0.92rem] leading-relaxed text-white/92 sm:p-5 sm:text-[0.96rem] md:p-6 md:text-[1.02rem] lg:hidden">
          <p>{movementDescriptionFirstStyled}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 font-semibold sm:pl-6">
            {HERO_CONTENT.movementCriteria.map((criterion) => (
              <li key={criterion}>{criterion}</li>
            ))}
          </ul>
          <p className="mt-4">{HERO_CONTENT.movementDescriptionSecond}</p>
        </div>
      </section>

    </>
  );
}
