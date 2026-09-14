type PrincipalsHeaderProps = {
  eyebrow: string;
  description: string;
};

export default function PrincipalsHeader({ eyebrow, description }: PrincipalsHeaderProps) {
  return (
    <div className="reveal grid gap-6 border-t border-rule pt-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16">
      <p className="font-display text-[11px] font-bold uppercase tracking-[0.28em] text-green-deep">
        {eyebrow}
      </p>
      <div>
        <h2
          id="principals-heading"
          className="max-w-[18ch] font-display text-display-2 font-extrabold leading-[0.96] tracking-[-0.03em] text-ink text-balance"
        >
          Meet the leaders of the <span className="text-green-deep">OK Movement</span>
        </h2>
        <p className="mt-6 max-w-[62ch] text-lead leading-relaxed text-body text-pretty">
          {description}
        </p>
      </div>
    </div>
  );
}
