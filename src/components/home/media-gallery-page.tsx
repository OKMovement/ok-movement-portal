"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  ImageIcon,
  Newspaper,
  Play,
  Video as VideoIcon,
} from "lucide-react";
import HomeSiteHeader from "@/components/home/home-site-header";
import HomeFooterSection from "@/components/home/home-footer-section";

type GalleryTab = "images" | "news" | "videos";

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  location: string;
  span?: "wide" | "tall";
};

type NewsItem = {
  id: string;
  date: string;
  category: string;
  title: string;
  excerpt: string;
  href: string;
  image: string;
  readTime: string;
};

type VideoItem = {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  duration: string;
};

const galleryImages: GalleryImage[] = [
  {
    id: "g-1",
    src: "/images/bg-7.jpeg",
    alt: "Peter Obi and Rabiu Kwankwaso addressing a large crowd",
    caption: "Peter Obi and Rabiu Kwankwaso address citizens at a national gathering",
    location: "Nationwide rally",
    span: "wide",
  },
  {
    id: "g-2",
    src: "/images/bg-3.jpeg",
    alt: "Peter Obi marching with citizens at a democracy rally",
    caption: "Marching alongside citizens for accountable leadership",
    location: "Democracy march",
  },
  {
    id: "g-3",
    src: "/images/bg-5.jpeg",
    alt: "Rabiu Kwankwaso seated with public leaders",
    caption: "Working sessions with movement leaders and partners",
    location: "Coordinators meeting",
  },
  {
    id: "g-4",
    src: "/images/bg-8.jpeg",
    alt: "Rabiu Kwankwaso meeting with Peter Obi",
    caption: "A united principal team — competence, capacity and commitment",
    location: "Strategy session",
    span: "tall",
  },
  {
    id: "g-5",
    src: "/images/bg-2.jpeg",
    alt: "Peter Obi and Rabiu Kwankwaso standing with supporters",
    caption: "With volunteers and grassroots organisers",
    location: "Volunteer brief",
  },
  {
    id: "g-6",
    src: "/images/bg-6.jpeg",
    alt: "A large crowd gathered at a public rally",
    caption: "A crowd of citizens turning out for a national rebirth",
    location: "Rally crowd",
    span: "wide",
  },
  {
    id: "g-7",
    src: "/images/bg-1.jpeg",
    alt: "OK Movement members at an event",
    caption: "Movement members at a public engagement",
    location: "Public engagement",
  },
  {
    id: "g-8",
    src: "/images/bg-4.jpeg",
    alt: "Citizens listening to a campaign update",
    caption: "Listening tour with first-time voters",
    location: "Listening tour",
  },
];

const newsItems: NewsItem[] = [
  {
    id: "n-1",
    date: "April 26, 2026",
    category: "Press Release",
    title: "OK Movement Expands National Coordination Teams Across States",
    excerpt:
      "The movement announced new state and local coordinators to strengthen grassroots engagement, improve civic participation, and deepen outreach to first-time voters.",
    href: "/home",
    image: "/images/bg-7.jpeg",
    readTime: "4 min read",
  },
  {
    id: "n-2",
    date: "April 12, 2026",
    category: "News",
    title: "Community Listening Tour Highlights Youth Priorities and Jobs",
    excerpt:
      "At recent stops, youth groups emphasized skills training, digital opportunity, and practical economic plans that can deliver measurable progress.",
    href: "/home#issues",
    image: "/images/bg-3.jpeg",
    readTime: "3 min read",
  },
  {
    id: "n-3",
    date: "March 29, 2026",
    category: "Press Release",
    title: "Movement Unveils Volunteer Mobilization Program for 2027",
    excerpt:
      "A nationwide volunteer program is opening with focus areas in civic education, voter outreach, and neighborhood-level community organizing.",
    href: "/home#get-involved-movement",
    image: "/images/bg-2.jpeg",
    readTime: "5 min read",
  },
  {
    id: "n-4",
    date: "March 15, 2026",
    category: "Statement",
    title: "Principals Reaffirm Commitment to Unity and Credible Governance",
    excerpt:
      "Peter Obi and Rabiu Kwankwaso restated the movement's promise to put character, competence and compassion at the centre of national leadership.",
    href: "/home#movement",
    image: "/images/bg-8.jpeg",
    readTime: "3 min read",
  },
];

const videoItems: VideoItem[] = [
  {
    id: "v-1",
    title: "Movement Highlights: Community Conversations",
    thumbnail: "/images/bg-1.jpeg",
    category: "Highlights",
    duration: "2:48",
  },
  {
    id: "v-2",
    title: "OK Movement Field Update",
    thumbnail: "/images/bg-4.jpeg",
    category: "Field Update",
    duration: "1:32",
  },
  {
    id: "v-3",
    title: "Accountability and Governance Message",
    thumbnail: "/images/bg-7.jpeg",
    category: "Address",
    duration: "4:10",
  },
  {
    id: "v-4",
    title: "Voices from Volunteers",
    thumbnail: "/images/bg-5.jpeg",
    category: "Volunteers",
    duration: "3:05",
  },
  {
    id: "v-5",
    title: "Policy Priorities in Focus",
    thumbnail: "/images/bg-3.jpeg",
    category: "Policy",
    duration: "5:24",
  },
  {
    id: "v-6",
    title: "Together for a New Dawn",
    thumbnail: "/images/bg-6.jpeg",
    category: "Vision",
    duration: "2:12",
  },
];

const tabs: Array<{ key: GalleryTab; label: string; icon: typeof ImageIcon; count: number }> = [
  { key: "images", label: "Images", icon: ImageIcon, count: galleryImages.length },
  { key: "news", label: "News & Press", icon: Newspaper, count: newsItems.length },
  { key: "videos", label: "Videos", icon: VideoIcon, count: videoItems.length },
];

function TricolorRule({ light = false }: { light?: boolean }) {
  return (
    <span aria-hidden="true" className="flex h-[2px] w-16 overflow-hidden rounded-full">
      <span className={`h-full flex-1 ${light ? "bg-white" : "bg-brand-green"}`} />
      <span className={`h-full flex-1 ${light ? "bg-white/65" : "bg-brand-black"}`} />
      <span className="h-full flex-1 bg-brand-red" />
    </span>
  );
}

function TabNav({
  activeTab,
  onChange,
}: {
  activeTab: GalleryTab;
  onChange: (tab: GalleryTab) => void;
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

function ImagesTab() {
  return (
    <section
      aria-label="Image gallery"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
    >
      {galleryImages.map((image) => {
        const spanClass =
          image.span === "wide"
            ? "lg:col-span-2"
            : image.span === "tall"
              ? "sm:row-span-2"
              : "";
        const aspectClass =
          image.span === "tall"
            ? "aspect-[3/4] sm:aspect-auto sm:min-h-[34rem]"
            : image.span === "wide"
              ? "aspect-[16/10]"
              : "aspect-[4/3]";
        return (
          <figure
            key={image.id}
            className={`group relative flex overflow-hidden rounded-[14px] bg-brand-black shadow-[0_18px_36px_-22px_rgb(0_0_0/0.45)] ${aspectClass} ${spanClass}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-brand-black/85 via-brand-black/15 to-transparent opacity-90 transition group-hover:opacity-100"
            />
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-black backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green" aria-hidden="true" />
              {image.location}
            </span>
            <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/70">
                Movement
              </p>
              <p className="mt-1 text-sm font-medium leading-snug sm:text-base">
                {image.caption}
              </p>
            </figcaption>
          </figure>
        );
      })}
    </section>
  );
}

function NewsTab() {
  const [featured, ...rest] = newsItems;
  return (
    <section aria-label="News and press" className="space-y-10 sm:space-y-12">
      {/* Featured article */}
      {featured ? (
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
            <a
              href={featured.href}
              className="group inline-flex w-fit items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-brand-green transition hover:text-brand-black"
            >
              Read the story
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </article>
      ) : null}

      {/* Secondary articles */}
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
                  <CalendarDays
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-brand-red"
                  />
                  {item.date}
                  <span aria-hidden="true" className="text-black/25">•</span>
                  <span>{item.readTime}</span>
                </div>
                <h3 className="text-lg font-medium leading-snug text-brand-black sm:text-xl">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-black/65">{item.excerpt}</p>
                <a
                  href={item.href}
                  className="mt-auto inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-green transition hover:text-brand-black"
                >
                  Read more
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function VideosTab() {
  return (
    <section
      aria-label="Video gallery"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {videoItems.map((video) => (
        <article
          key={video.id}
          className="group flex flex-col overflow-hidden rounded-[14px] border border-black/8 bg-white shadow-[0_16px_32px_-22px_rgb(0_0_0/0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-22px_rgb(0_0_0/0.45)]"
        >
          <button
            type="button"
            aria-label={`Play video: ${video.title}`}
            className="relative block aspect-video w-full overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-brand-black/70 via-brand-black/15 to-transparent"
            />
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-black">
              {video.category}
            </span>
            <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-brand-black/80 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-white">
              {video.duration}
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-brand-green shadow-[0_14px_28px_-10px_rgb(0_0_0/0.6)] transition group-hover:scale-110 group-hover:bg-white">
                <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" />
              </span>
            </span>
          </button>
          <div className="flex flex-1 flex-col gap-2 p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-red">
              OK Movement
            </p>
            <h3 className="text-base font-medium leading-snug text-brand-black sm:text-lg">
              {video.title}
            </h3>
          </div>
        </article>
      ))}
    </section>
  );
}

export default function MediaGalleryPage() {
  const [activeTab, setActiveTab] = useState<GalleryTab>("images");

  const heading = useMemo(() => {
    if (activeTab === "images") return "Campaign Images";
    if (activeTab === "videos") return "Campaign Videos";
    return "News & Press";
  }, [activeTab]);

  const subheading = useMemo(() => {
    if (activeTab === "images")
      return "Photographs from rallies, listening tours, and the people building the movement.";
    if (activeTab === "videos")
      return "Watch our principals, organisers and volunteers in their own words.";
    return "Press releases, statements and reporting on the OK Movement.";
  }, [activeTab]);

  const activeCount = useMemo(
    () => tabs.find((tab) => tab.key === activeTab)?.count ?? 0,
    [activeTab],
  );

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-brand-black">
      <HomeSiteHeader />

      {/* HERO ----------------------------------------------------- */}
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

        {/* Mobile hero */}
        <div className="relative px-5 pb-14 pt-20 sm:px-6 sm:pb-16 sm:pt-24 lg:hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 top-24 h-40 w-40 rounded-full bg-brand-green/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 bottom-8 h-44 w-44 rounded-full bg-brand-red/12 blur-3xl"
          />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span
                  aria-hidden="true"
                  className="absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75 motion-safe:animate-ping"
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-red" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90">
                Live Coverage · From the Field
              </span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <TricolorRule light />
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/75">
                Newsroom · Gallery
              </p>
            </div>

            <h1 className="mt-4 text-[2.4rem] font-medium leading-[1.05] tracking-tight text-white">
              {heading}
              <span
                aria-hidden="true"
                className="ml-1.5 inline-block h-2 w-2 -translate-y-1 rounded-full bg-brand-green align-middle shadow-[0_0_12px_rgb(0_166_81/0.85)]"
              />
            </h1>

            <p className="mt-4 text-[15px] leading-relaxed text-white/75">
              {subheading}
            </p>

            <div className="mt-7 inline-flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
              <div className="flex -space-x-3">
                {galleryImages.slice(0, 4).map((image, index) => (
                  <span
                    key={image.id}
                    className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-brand-black ring-1 ring-white/15"
                    style={{ zIndex: 4 - index }}
                  >
                    <img
                      src={image.src}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </span>
                ))}
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[13px] font-semibold text-white">
                  Fresh from the field
                </span>
                <span className="mt-0.5 text-[11px] text-white/70">
                  +{galleryImages.length - 4} new this week
                </span>
              </div>
            </div>

            <dl className="mt-7 grid grid-cols-3 gap-2.5">
              {tabs.map(({ key, label, icon: Icon, count }) => (
                <div
                  key={key}
                  className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] p-3.5 backdrop-blur-sm"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-brand-green/10 blur-2xl"
                  />
                  <div className="relative">
                    <Icon
                      aria-hidden="true"
                      className="h-4 w-4 text-brand-green"
                    />
                    <dd className="mt-2 text-[1.65rem] font-medium leading-none text-white">
                      {count}
                    </dd>
                    <dt className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">
                      {label}
                    </dt>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Desktop hero */}
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
            </div>

            <dl className="grid grid-cols-3 gap-4 rounded-[14px] border border-white/15 bg-white/5 p-5 backdrop-blur sm:gap-6 sm:p-6 lg:min-w-[20rem]">
              {tabs.map(({ key, label, count }) => (
                <div key={key} className="flex flex-col gap-1">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/65">
                    {label}
                  </dt>
                  <dd className="text-3xl font-medium leading-none text-white sm:text-4xl">
                    {count}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* TABS ----------------------------------------------------- */}
      <section className="relative -mt-7 px-4 sm:-mt-8">
        <div className="mx-auto flex w-[min(100%-1rem,80rem)] flex-wrap items-center justify-center gap-4 lg:justify-between">
          <TabNav activeTab={activeTab} onChange={setActiveTab} />
          <p className="w-full text-center text-xs font-semibold uppercase tracking-[0.22em] text-black/55 lg:w-auto lg:text-left">
            Showing {activeCount} {activeCount === 1 ? "item" : "items"}
          </p>
        </div>
      </section>

      {/* CONTENT -------------------------------------------------- */}
      <section className="mx-auto w-[min(100%-1rem,80rem)] px-4 pb-20 pt-12 sm:pb-24 sm:pt-14 lg:pt-16">
        {activeTab === "images" ? <ImagesTab /> : null}
        {activeTab === "news" ? <NewsTab /> : null}
        {activeTab === "videos" ? <VideosTab /> : null}
      </section>

      <HomeFooterSection />
    </main>
  );
}