"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  ImageIcon,
  Newspaper,
  Video as VideoIcon,
} from "lucide-react";
import HomeSiteHeader from "@/components/home/home-site-header";
import HomeFooterSection from "@/components/home/home-footer-section";
import { aboutPrincipals } from "@/components/home/about-principal-data";

type GalleryTab = "images" | "news" | "videos";

type MediaItem = {
  id: string;
  kind: "image" | "news" | "video";
  title: string;
  imageUrl: string;
  category: string;
  description: string;
  excerpt: string;
  location: string;
  linkUrl: string;
  duration: string;
  publishedAt: string | null;
};

type PressRelease = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  fileUrl: string;
  excerpt: string;
  body: string;
  publishedAt: string | null;
};

type NewsCard = {
  id: string;
  date: string;
  category: string;
  title: string;
  excerpt: string;
  href: string;
  image: string;
  readTime: string;
};

type VideoCard = {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  duration: string;
  videoUrl: string;
};

const FALLBACK_IMAGE = "/images/new-logo.png";
const DOCUMENT_LINK_PATTERN = /\.(pdf|doc|docx|ppt|pptx|txt)(?:$|[?#])/i;

function TricolorRule({ light = false }: { light?: boolean }) {
  return (
    <span aria-hidden="true" className="flex h-[2px] w-16 overflow-hidden rounded-full">
      <span className={`h-full flex-1 ${light ? "bg-white" : "bg-brand-green"}`} />
      <span className={`h-full flex-1 ${light ? "bg-white/65" : "bg-brand-black"}`} />
      <span className="h-full flex-1 bg-brand-red" />
    </span>
  );
}

function formatDate(value: string | null): string {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function normalizeExternalUrl(value: string | null | undefined): string {
  const raw = value?.trim() ?? "";
  if (!raw) return "";
  if (raw.startsWith("/")) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;

  const withProtocol = /^[a-z]+:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    return new URL(withProtocol).toString();
  } catch {
    return "";
  }
}

function resolveNewsDocumentUrl(...candidates: Array<string | null | undefined>): string {
  const normalizedCandidates = candidates
    .map((candidate) => normalizeExternalUrl(candidate))
    .filter(Boolean);

  if (normalizedCandidates.length === 0) return "";

  const documentUrl = normalizedCandidates.find((candidate) => DOCUMENT_LINK_PATTERN.test(candidate));
  return documentUrl ?? normalizedCandidates[0];
}

function resolveTrackRecordDocumentForRelease(release: PressRelease): string {
  const normalizedTitle = release.title.toLowerCase();
  const normalizedSlug = release.slug.toLowerCase();

  if (
    normalizedSlug.includes("peter-obi") ||
    (normalizedTitle.includes("peter obi") && normalizedTitle.includes("track record"))
  ) {
    return aboutPrincipals["peter-obi"].ctaHref;
  }

  if (
    normalizedSlug.includes("rabiu-kwankwaso") ||
    (normalizedTitle.includes("kwankwaso") && normalizedTitle.includes("track record"))
  ) {
    return aboutPrincipals["rabiu-kwankwaso"].ctaHref;
  }

  return "";
}

function TabNav({
  activeTab,
  onChange,
  tabs,
}: {
  activeTab: GalleryTab;
  onChange: (tab: GalleryTab) => void;
  tabs: Array<{ key: GalleryTab; label: string; icon: typeof ImageIcon; count: number }>;
}) {
  return (
    <div
      role="tablist"
      aria-label="Media gallery sections"
      className="flex flex-wrap items-center gap-2 rounded-[20px] border border-black/8 bg-white p-1.5 shadow-[0_18px_36px_-22px_rgb(0_0_0/0.4)] sm:gap-2"
    >
      {tabs.map(({ key, label, icon: Icon, count }) => {
        const isActive = activeTab === key;
        return (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(key)}
            className={`group inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-xs font-semibold uppercase tracking-[0.16em] transition sm:px-5 sm:text-[13px] ${
              isActive
                ? "bg-brand-black text-white shadow-[0_10px_20px_-10px_rgb(0_0_0/0.6)]"
                : "text-black/70 hover:bg-black/[0.04] hover:text-brand-black"
            }`}
          >
            <Icon
              aria-hidden="true"
              className={`h-4 w-4 ${isActive ? "text-brand-green" : "text-black/55"}`}
            />
            <span>{label}</span>
            <span
              className={`ml-1 inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold tracking-normal ${
                isActive
                  ? "bg-white/15 text-white"
                  : "bg-black/[0.06] text-black/60 group-hover:bg-black/10"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ImagesTab({
  images,
}: {
  images: Array<{
    id: string;
    src: string;
    title: string;
    caption: string;
    location: string;
  }>;
}) {
  if (images.length === 0) {
    return (
      <section className="rounded-[14px] border border-dashed border-black/15 bg-white p-10 text-center text-sm text-black/55">
        No published images yet.
      </section>
    );
  }

  return (
    <section
      aria-label="Image gallery"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
    >
      {images.map((image, index) => {
        const isWide = index % 5 === 0;
        const isTall = index % 7 === 0;
        const spanClass = isWide ? "lg:col-span-2" : isTall ? "sm:row-span-2" : "";
        const aspectClass = isTall
          ? "aspect-[3/4] sm:aspect-auto sm:min-h-[34rem]"
          : isWide
            ? "aspect-[16/10]"
            : "aspect-[4/3]";

        return (
          <figure
            key={image.id}
            className={`group relative flex overflow-hidden rounded-[14px] bg-brand-black shadow-[0_18px_36px_-22px_rgb(0_0_0/0.45)] ${aspectClass} ${spanClass}`}
          >
            <img
              src={image.src}
              alt={image.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-brand-black/85 via-brand-black/15 to-transparent opacity-90 transition group-hover:opacity-100"
            />
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-black backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green" aria-hidden="true" />
              {image.location || "Movement"}
            </span>
            <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/70">
                Movement
              </p>
              <p className="mt-1 text-sm font-medium leading-snug sm:text-base">{image.caption}</p>
            </figcaption>
          </figure>
        );
      })}
    </section>
  );
}

function NewsTab({ items }: { items: NewsCard[] }) {
  if (items.length === 0) {
    return (
      <section className="rounded-[14px] border border-dashed border-black/15 bg-white p-10 text-center text-sm text-black/55">
        No published press or news updates yet.
      </section>
    );
  }

  const [featured, ...rest] = items;

  return (
    <section aria-label="News and press" className="space-y-10 sm:space-y-12">
      <article className="grid gap-6 overflow-hidden rounded-[18px] border border-black/8 bg-white shadow-[0_22px_44px_-26px_rgb(0_0_0/0.35)] lg:grid-cols-12 lg:gap-0">
        <div className="relative aspect-[16/10] overflow-hidden lg:col-span-7 lg:aspect-auto">
          <img
            src={featured.image}
            alt={featured.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-brand-green px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_10px_20px_-8px_rgb(0_166_81/0.6)]">
            <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true" />
            Featured
          </span>
        </div>
        <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:col-span-5 lg:p-10">
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-black/55">
            <span className="inline-flex items-center gap-1.5 text-brand-red">
              <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
              {featured.date}
            </span>
            <span aria-hidden="true" className="text-black/25">•</span>
            <span>{featured.category}</span>
            <span aria-hidden="true" className="text-black/25">•</span>
            <span>{featured.readTime}</span>
          </div>
          <h2 className="text-2xl font-medium leading-tight text-brand-black sm:text-3xl lg:text-[2rem]">
            {featured.title}
          </h2>
          <p className="text-base leading-relaxed text-black/70">{featured.excerpt}</p>
          {featured.href ? (
            <a
              href={featured.href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex w-fit items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-brand-green transition hover:text-brand-black"
            >
              Open update
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          ) : null}
        </div>
      </article>

      {rest.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-[14px] border border-black/8 bg-white shadow-[0_16px_32px_-22px_rgb(0_0_0/0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-22px_rgb(0_0_0/0.45)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-black">
                  {item.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-black/55">
                  <CalendarDays aria-hidden="true" className="h-3.5 w-3.5 text-brand-red" />
                  {item.date}
                  <span aria-hidden="true" className="text-black/25">•</span>
                  <span>{item.readTime}</span>
                </div>
                <h3 className="text-lg font-medium leading-snug text-brand-black sm:text-xl">{item.title}</h3>
                <p className="text-sm leading-relaxed text-black/65">{item.excerpt}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-green transition hover:text-brand-black"
                  >
                    Open
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function VideosTab({ videos }: { videos: VideoCard[] }) {
  if (videos.length === 0) {
    return (
      <section className="rounded-[14px] border border-dashed border-black/15 bg-white p-10 text-center text-sm text-black/55">
        No published videos yet.
      </section>
    );
  }

  return (
    <section
      aria-label="Video gallery"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {videos.map((video) => (
        <article
          key={video.id}
          className="group flex flex-col overflow-hidden rounded-[14px] border border-black/8 bg-white shadow-[0_16px_32px_-22px_rgb(0_0_0/0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-22px_rgb(0_0_0/0.45)]"
        >
          <div className="relative block aspect-video w-full overflow-hidden bg-black">
            {video.videoUrl ? (
              <video
                src={video.videoUrl}
                poster={video.thumbnail}
                controls
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={video.thumbnail}
                alt={video.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            )}
            <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-black">
              {video.category || "Video"}
            </span>
            <span className="pointer-events-none absolute right-4 top-4 inline-flex items-center rounded-full bg-brand-black/80 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-white">
              {video.duration || "--:--"}
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-2 p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-red">OK Movement</p>
            <h3 className="text-base font-medium leading-snug text-brand-black sm:text-lg">{video.title}</h3>
          </div>
        </article>
      ))}
    </section>
  );
}

export default function MediaGalleryPage() {
  const [activeTab, setActiveTab] = useState<GalleryTab>("images");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setLoading(true);
      setError("");

      const [mediaResponse, releaseResponse] = await Promise.all([
        fetch("/api/media", { cache: "no-store" }),
        fetch("/api/press-releases", { cache: "no-store" }),
      ]);

      const mediaData = (await mediaResponse.json().catch(() => null)) as
        | { media?: MediaItem[]; error?: string }
        | null;
      const releaseData = (await releaseResponse.json().catch(() => null)) as
        | { releases?: PressRelease[]; error?: string }
        | null;

      if (!mounted) return;

      if (!mediaResponse.ok || !releaseResponse.ok) {
        setError(mediaData?.error ?? releaseData?.error ?? "Unable to load media gallery.");
        setLoading(false);
        return;
      }

      setMediaItems(mediaData?.media ?? []);
      setPressReleases(releaseData?.releases ?? []);
      setLoading(false);
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const images = useMemo(
    () =>
      mediaItems
        .filter((item) => item.kind === "image")
        .map((item) => ({
          id: item.id,
          src: item.imageUrl || FALLBACK_IMAGE,
          title: item.title,
          caption: item.description || item.excerpt || item.title,
          location: item.location,
        })),
    [mediaItems],
  );

  const videos = useMemo<VideoCard[]>(
    () =>
      mediaItems
        .filter((item) => item.kind === "video")
        .map((item) => ({
          id: item.id,
          title: item.title,
          thumbnail: item.imageUrl || FALLBACK_IMAGE,
          category: item.category,
          duration: item.duration,
          videoUrl: item.linkUrl,
        })),
    [mediaItems],
  );

  const newsCards = useMemo<NewsCard[]>(() => {
    const fromMedia = mediaItems
      .filter((item) => item.kind === "news")
      .map((item) => ({
        id: `news-${item.id}`,
        publishedAtMs: item.publishedAt ? new Date(item.publishedAt).getTime() : 0,
        date: formatDate(item.publishedAt),
        category: item.category || "News",
        title: item.title,
        excerpt: item.excerpt || item.description || "Latest movement update.",
        href: resolveNewsDocumentUrl(item.linkUrl),
        image: item.imageUrl || FALLBACK_IMAGE,
        readTime: "3 min read",
      }));

    const fromReleases = pressReleases.map((release) => ({
      id: `release-${release.id}`,
      publishedAtMs: release.publishedAt ? new Date(release.publishedAt).getTime() : 0,
      date: formatDate(release.publishedAt),
      category: "Press Release",
      title: release.title,
      excerpt: release.excerpt,
      href: resolveNewsDocumentUrl(resolveTrackRecordDocumentForRelease(release), release.fileUrl),
      image: release.imageUrl || FALLBACK_IMAGE,
      readTime: "Official",
    }));

    return [...fromReleases, ...fromMedia]
      .sort((a, b) => b.publishedAtMs - a.publishedAtMs)
      .map(({ publishedAtMs: _publishedAtMs, ...card }) => card);
  }, [mediaItems, pressReleases]);

  const tabs = useMemo<Array<{ key: GalleryTab; label: string; icon: typeof ImageIcon; count: number }>>(
    () => [
      { key: "images", label: "Images", icon: ImageIcon, count: images.length },
      { key: "news", label: "News & Press", icon: Newspaper, count: newsCards.length },
      { key: "videos", label: "Videos", icon: VideoIcon, count: videos.length },
    ],
    [images.length, newsCards.length, videos.length],
  );

  const heading = useMemo(() => {
    if (activeTab === "images") return "Campaign Images";
    if (activeTab === "videos") return "Campaign Videos";
    return "News & Press";
  }, [activeTab]);

  const subheading = useMemo(() => {
    if (activeTab === "images") {
      return "Photographs from rallies, listening tours, and the people building the movement.";
    }
    if (activeTab === "videos") {
      return "Watch our principals, organisers and volunteers in their own words.";
    }
    return "Press releases, statements and reporting sourced directly from the admin newsroom.";
  }, [activeTab]);

  const activeCount = useMemo(
    () => tabs.find((tab) => tab.key === activeTab)?.count ?? 0,
    [activeTab, tabs],
  );

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-brand-black">
      <HomeSiteHeader />

      <section className="relative isolate overflow-hidden bg-brand-black text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgb(0_166_81/0.35),transparent_45%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_82%_82%,rgb(224_40_40/0.28),transparent_42%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />

        <div className="relative mx-auto hidden w-[min(100%-1.5rem,80rem)] pb-16 pt-24 sm:pb-20 sm:pt-28 lg:block lg:pb-24 lg:pt-32">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4">
                <TricolorRule light />
                <p className="text-[11px] font-semibold uppercase tracking-[0.46em] text-white/75">
                  Newsroom & Gallery
                </p>
              </div>
              <h1 className="mt-5 text-4xl font-medium leading-[1.02] sm:text-5xl lg:text-[4.25rem]">
                {heading}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                {subheading}
              </p>
              <div className="mt-7 inline-flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
                <div className="flex -space-x-3">
                  {images.slice(0, 4).map((image, index) => (
                    <span
                      key={image.id}
                      className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-brand-black ring-1 ring-white/15"
                      style={{ zIndex: 4 - index }}
                    >
                      <img src={image.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </span>
                  ))}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[13px] font-semibold text-white">Fresh from the field</span>
                  <span className="mt-0.5 text-[11px] text-white/70">{images.length} published images</span>
                </div>
              </div>
            </div>

            <dl className="grid grid-cols-3 gap-4 rounded-[14px] border border-white/15 bg-white/5 p-5 backdrop-blur sm:gap-6 sm:p-6 lg:min-w-[20rem]">
              {tabs.map(({ key, label, count }) => (
                <div key={key} className="flex flex-col gap-1">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/65">
                    {label}
                  </dt>
                  <dd className="text-3xl font-medium leading-none text-white sm:text-4xl">{count}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="relative px-5 pb-14 pt-20 sm:px-6 sm:pb-16 sm:pt-24 lg:hidden">
          <div className="mt-6 flex items-center gap-3">
            <TricolorRule light />
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/75">Newsroom · Gallery</p>
          </div>

          <h1 className="mt-4 text-[2.4rem] font-medium leading-[1.05] tracking-tight text-white">{heading}</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-white/75">{subheading}</p>

          <dl className="mt-7 grid grid-cols-3 gap-2.5">
            {tabs.map(({ key, label, icon: Icon, count }) => (
              <div key={key} className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] p-3.5 backdrop-blur-sm">
                <div className="relative">
                  <Icon aria-hidden="true" className="h-4 w-4 text-brand-green" />
                  <dd className="mt-2 text-[1.65rem] font-medium leading-none text-white">{count}</dd>
                  <dt className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">
                    {label}
                  </dt>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="relative -mt-7 px-4 sm:-mt-8">
        <div className="mx-auto flex w-[min(100%-1rem,80rem)] flex-wrap items-center justify-center gap-4 lg:justify-between">
          <TabNav activeTab={activeTab} onChange={setActiveTab} tabs={tabs} />
          <p className="w-full text-center text-xs font-semibold uppercase tracking-[0.22em] text-black/55 lg:w-auto lg:text-left">
            Showing {activeCount} {activeCount === 1 ? "item" : "items"}
          </p>
        </div>
      </section>

      <section className="mx-auto w-[min(100%-1rem,80rem)] px-4 pb-20 pt-12 sm:pb-24 sm:pt-14 lg:pt-16">
        {loading ? (
          <div className="rounded-[14px] border border-black/10 bg-white p-10 text-center text-sm text-black/60">
            Loading media gallery...
          </div>
        ) : error ? (
          <div className="rounded-[14px] border border-brand-red/20 bg-brand-red/5 p-10 text-center text-sm text-brand-red">
            {error}
          </div>
        ) : (
          <>
            {activeTab === "images" ? <ImagesTab images={images} /> : null}
            {activeTab === "news" ? <NewsTab items={newsCards} /> : null}
            {activeTab === "videos" ? <VideosTab videos={videos} /> : null}
          </>
        )}
      </section>

      <HomeFooterSection />
    </main>
  );
}
