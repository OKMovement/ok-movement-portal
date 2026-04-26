type HomeWaveAccentProps = {
  side: "left" | "right";
  widthClassName?: string;
};

export default function HomeWaveAccent({ side, widthClassName = "w-56" }: HomeWaveAccentProps) {
  const sideClassName = side === "left" ? "left-0 border-r" : "right-0 border-l";

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-y-0 hidden ${widthClassName} ${sideClassName} border-brand-green/15 bg-brand-green/5 opacity-95 md:block`}
    >
      <div className="h-full w-full [background-image:radial-gradient(ellipse_45px_16px_at_50%_50%,transparent_56%,rgb(0_166_81_/_0.18)_58%,rgb(0_166_81_/_0.18)_62%,transparent_64%)] [background-size:72px_34px]" />
    </div>
  );
}
