type PrincipalsHeaderProps = {
  eyebrow: string;
  description: string;
};

export default function PrincipalsHeader({ eyebrow, description }: PrincipalsHeaderProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mx-auto inline-flex items-center gap-3">
        <span className="h-[2px] w-10 rounded-full bg-brand-green" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-red">
          {eyebrow}
        </span>
        <span className="h-[2px] w-10 rounded-full bg-brand-red" />
      </div>
      <h2
        id="principals-heading"
        className="mt-5 text-balance text-4xl font-medium leading-[1.05] tracking-tight text-brand-black sm:text-5xl lg:text-[3.4rem]"
      >
        Meet the Leaders of the <span className="text-brand-green">OK Movement</span>
      </h2>
      <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-brand-black/70 sm:text-lg">
        {description}
      </p>
    </div>
  );
}
