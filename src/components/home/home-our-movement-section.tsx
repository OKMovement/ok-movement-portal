"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { homeIssuesSection, homeMovementSection } from "./home-data";

const pillars = [
  "Character",
  "Competence",
  "Compassion",
  "Capacity",
  "Commitment",
] as const;

type CampaignVideo = {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
};

export default function HomeOurMovementSection() {
  const [campaignVideo, setCampaignVideo] = useState<CampaignVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadFirstCampaignVideo() {
      const response = await fetch("/api/media?kind=video", { cache: "no-store" });
      const data = (await response.json().catch(() => null)) as
        | { media?: CampaignVideo[] }
        | null;

      if (!mounted || !response.ok) return;

      const preferredHomeVideo =
        data?.media?.find((item) => item.title?.trim().toLowerCase() === "home-video" && item.linkUrl?.trim()) ??
        data?.media?.find((item) => item.linkUrl?.trim()) ??
        null;
      setCampaignVideo(preferredHomeVideo);
    }

    loadFirstCampaignVideo();

    return () => {
      mounted = false;
    };
  }, []);

  async function handlePlayVideo() {
    if (!campaignVideo || !videoRef.current) return;
    try {
      await videoRef.current.play();
      setIsPlaying(true);
    } catch {
      // Ignore autoplay/playback errors and keep fallback UI.
    }
  }

  return (
    <section
      id={homeMovementSection.id}
      aria-labelledby="movement-heading"
      className="relative overflow-hidden bg-[#fafaf7] py-16 sm:py-20 lg:py-28"
    >
      {/* Background watermark logo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-0 flex select-none opacity-[0.06]"
      >
        <img
          src="/images/new-logo.png"
          alt=""
          className="h-full w-auto max-w-none object-contain object-right"
        />
      </div>

      {/* Soft top accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 z-0 h-72 w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgb(0_166_81/0.10),transparent_70%)]"
      />

      <div className="relative z-10 mx-auto w-[min(100%-1.5rem,76rem)]">
        {/* Intro */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-3">
            <span className="h-[2px] w-10 rounded-full bg-brand-green" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-red">
              {homeMovementSection.eyebrow}
            </span>
            <span className="h-[2px] w-10 rounded-full bg-brand-red" />
          </div>
          <h2
            id="movement-heading"
            className="mt-5 text-balance text-4xl font-medium leading-[1.05] tracking-tight text-brand-black sm:text-5xl lg:text-[3.4rem]"
          >
            A People-Powered{" "}
            <span className="text-brand-green">National Rebirth</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-brand-black/70 sm:text-lg">
            The OK Movement is a transformative initiative restoring
            accountability and integrity to Nigerian leadership — redefining how
            leaders are selected and uniting Nigerians around character,
            competence, compassion, capacity, and commitment.
          </p>
        </div>

        {/* Feature card */}
        <div className="mt-12 overflow-hidden rounded-3xl bg-white shadow-[0_30px_60px_-30px_rgb(0_0_0/0.25)] ring-1 ring-black/5 lg:mt-16">
          <div className="grid lg:grid-cols-[1.1fr_1fr]">
            {/* Image side */}
            <div className="relative min-h-[24rem] lg:min-h-[34rem]">
              {campaignVideo ? (
                <video
                  ref={videoRef}
                  src={campaignVideo.linkUrl}
                  poster={campaignVideo.imageUrl || homeIssuesSection.imageSrc}
                  className="absolute inset-0 h-full w-full object-cover object-center bg-black"
                  controls
                  playsInline
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />
              ) : (
                <img
                  src={homeIssuesSection.imageSrc}
                  alt={homeIssuesSection.imageAlt}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              )}
              {!isPlaying ? (
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgb(0_0_0/0.55)_0%,rgb(0_0_0/0.2)_45%,transparent_72%)]" />
              ) : null}

              {!isPlaying ? (
                <button
                  type="button"
                  aria-label="Play campaign video"
                  onClick={handlePlayVideo}
                  disabled={!campaignVideo}
                  className="group absolute left-1/2 top-1/2 inline-flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-brand-green shadow-[0_20px_40px_-10px_rgb(0_0_0/0.45)] backdrop-blur transition hover:scale-105 hover:bg-white sm:h-24 sm:w-24 lg:h-28 lg:w-28"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40 opacity-60"
                  />
                  <Play
                    aria-hidden="true"
                    className="relative ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8 lg:h-10 lg:w-10"
                  />
                </button>
              ) : null}

              {/* Caption pill */}
              <div className="absolute bottom-5 left-5 inline-flex w-fit items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-xs font-medium text-white backdrop-blur sm:bottom-6 sm:left-6">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                Watch the campaign film
              </div>
            </div>

            {/* Green content panel */}
            <div className="relative overflow-hidden bg-brand-green text-white">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/[0.08] blur-2xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-black/[0.18] blur-2xl"
              />

              <div className="relative flex h-full flex-col justify-center px-7 py-10 sm:px-10 sm:py-14 lg:px-12 lg:py-16">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/85">
                  {homeIssuesSection.eyebrow}
                </p>
                <h3 className="mt-3 text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl lg:text-[2.6rem]">
                  {homeIssuesSection.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
                  The OK Movement unveils national and state structures to unite
                  Nigerians, restore accountable leadership, and make good
                  governance a reality.
                </p>

                {/* 5 C's pillars */}
                <div className="mt-7">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/65">
                    The 5 C's of OK Leadership
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pillars.map((pillar) => (
                      <span
                        key={pillar}
                        className="inline-flex items-center rounded-full bg-white/[0.12] px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/20 backdrop-blur-sm"
                      >
                        {pillar}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={homeMovementSection.ctaHref}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] border border-white/30 bg-white/10 px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white backdrop-blur transition hover:bg-white hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-h-[3.25rem]"
                  >
                    {homeMovementSection.ctaLabel}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
