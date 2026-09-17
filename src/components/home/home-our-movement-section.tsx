"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";

import { homeIssuesSection, homeMovementSection } from "./home-data";
import { useReveal } from "./use-reveal";

const PILLARS = [
  { name: "Character", note: "Leaders judged on conduct, not connections." },
  { name: "Competence", note: "A record of delivery before a claim to office." },
  { name: "Compassion", note: "Policy measured by who it lifts." },
  { name: "Capacity", note: "The capability to govern a complex federation." },
  { name: "Commitment", note: "Staying through the unglamorous work." },
];

type CampaignVideo = {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
};

const HOME_VIDEO_ID = "69f4be25da27d1ce9c50c484";
const HOME_VIDEO_TITLE = "ok movement new song";
const CAMPAIGN_FILM_THUMBNAIL = "https://i.ytimg.com/vi/mroDrdQaTUk/maxresdefault.jpg";

export default function HomeOurMovementSection() {
  const sectionRef = useReveal<HTMLElement>();
  const [campaignVideo, setCampaignVideo] = useState<CampaignVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function loadFirstCampaignVideo() {
      try {
        const response = await fetch("/api/media?kind=video", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) return;

        const data = (await response.json().catch(() => null)) as
          | { media?: CampaignVideo[] }
          | null;
        if (!mounted) return;

        const preferred =
          data?.media?.find((item) => item.id === HOME_VIDEO_ID && item.linkUrl?.trim()) ??
          data?.media?.find(
            (item) => item.title?.trim().toLowerCase() === HOME_VIDEO_TITLE && item.linkUrl?.trim(),
          ) ??
          data?.media?.find(
            (item) => item.title?.trim().toLowerCase() === "home-video" && item.linkUrl?.trim(),
          ) ??
          data?.media?.find((item) => item.linkUrl?.trim()) ??
          null;
        setCampaignVideo(preferred);
      } catch {
        // The poster still renders; a missing media API is not a broken section.
      }
    }

    loadFirstCampaignVideo();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  async function handlePlayVideo() {
    if (!campaignVideo || !videoRef.current) return;
    try {
      await videoRef.current.play();
      setIsPlaying(true);
    } catch {
      // Autoplay refusals leave the poster and play button in place.
    }
  }

  return (
    <section
      ref={sectionRef}
      id={homeMovementSection.id}
      aria-labelledby="movement-heading"
      className="relative overflow-hidden bg-paper py-20 sm:py-24 lg:py-32"
    >
      {/* Logo watermark — the background device on light sections. */}
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

      <div className="relative mx-auto w-[min(100%-2rem,82rem)]">
        {/* Section header sits left, against the grid — not centred like every
            other section on the page. */}
        <div className="reveal grid gap-6 border-t border-rule pt-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16">
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.28em] text-green-deep">
            {homeMovementSection.eyebrow}
          </p>
          <div>
            <h2
              id="movement-heading"
              className="max-w-[18ch] font-display text-display-2 font-extrabold leading-[0.96] tracking-[-0.03em] text-ink text-balance"
            >
              A people-powered <span className="text-green-deep">national rebirth</span>
            </h2>
            <p className="mt-6 max-w-[62ch] text-lead leading-relaxed text-body text-pretty">
              The OK Movement is restoring accountability and integrity to Nigerian leadership —
              redefining how leaders are chosen, and uniting Nigerians around five standards we
              refuse to negotiate.
            </p>
          </div>
        </div>

        {/* The film and mandate panel form one continuous container. */}
        <div className="mt-14 grid overflow-hidden rounded-lg bg-ink shadow-4 lg:mt-20 lg:grid-cols-12">
          <div className="reveal relative lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10] lg:h-full lg:aspect-auto">
              {campaignVideo ? (
                <video
                  ref={videoRef}
                  src={campaignVideo.linkUrl}
                  poster={campaignVideo.imageUrl || CAMPAIGN_FILM_THUMBNAIL}
                  className="absolute inset-0 h-full w-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />
              ) : (
                <Image
                  src={CAMPAIGN_FILM_THUMBNAIL}
                  alt="Peter Obi and Rabiu Kwankwaso addressing supporters in the OK Movement campaign film"
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
              )}

              {!isPlaying ? (
                <>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-tr from-ink/70 via-ink/25 to-transparent"
                  />
                  <button
                    type="button"
                    aria-label="Play the campaign film"
                    onClick={handlePlayVideo}
                    disabled={!campaignVideo}
                    className="group absolute inset-0 flex items-center justify-center disabled:cursor-not-allowed"
                  >
                    <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-paper-raised text-green-deep shadow-4 transition duration-200 group-hover:scale-105 group-active:scale-100 sm:h-24 sm:w-24">
                      <Play aria-hidden="true" className="ml-1 h-7 w-7 fill-current sm:h-9 sm:w-9" />
                    </span>
                  </button>
                  <p className="pointer-events-none absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-md bg-ink/70 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-sm">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                    Watch the campaign film
                  </p>
                </>
              ) : null}
            </div>
          </div>

          <div className="reveal lg:col-span-5" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
            <div className="grain grain-on-ink relative h-full bg-green-deep px-7 py-9 text-white sm:px-9 sm:py-11">
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.28em] text-white/70">
                {homeIssuesSection.eyebrow}
              </p>
              <h3 className="mt-3 max-w-[16ch] font-display text-display-3 font-extrabold leading-[0.98] tracking-[-0.025em] text-balance">
                {homeIssuesSection.title}
              </h3>

              <dl className="mt-8 divide-y divide-white/15 border-y border-white/15">
                {PILLARS.map((pillar) => (
                  <div key={pillar.name} className="flex gap-4 py-3">
                    <dt className="w-[6.5rem] shrink-0 font-display text-sm font-bold tracking-tight">
                      {pillar.name}
                    </dt>
                    <dd className="text-[13px] leading-relaxed text-white/75">{pillar.note}</dd>
                  </div>
                ))}
              </dl>

              <Link
                href={homeMovementSection.ctaHref}
                className="group mt-8 inline-flex min-h-12 items-center gap-2.5 rounded-md bg-white px-6 text-sm font-semibold tracking-wide text-green-deep transition duration-200 hover:bg-ink hover:text-white active:scale-[0.99]"
              >
                {homeMovementSection.ctaLabel}
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
