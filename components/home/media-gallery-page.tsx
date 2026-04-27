"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type GalleryTab = "images" | "news" | "videos";

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

type NewsItem = {
  id: string;
  date: string;
  category: string;
  title: string;
  excerpt: string;
  href: string;
};

type VideoItem = {
  id: string;
  title: string;
  thumbnail: string;
};

const tabs: Array<{ key: GalleryTab; label: string }> = [
  { key: "images", label: "Images" },
  { key: "news", label: "News/Press" },
  { key: "videos", label: "Videos" },
];

const galleryImages: GalleryImage[] = [
  {
    id: "g-1",
    src: "/images/home/cheri-bustos-hero.png",
    alt: "Supporters at a campaign rally",
    caption: "Community rally in support of accountable leadership",
  },
  {
    id: "g-2",
    src: "/images/home/cheri-bustos-home-reference.png",
    alt: "Volunteers speaking with residents",
    caption: "Volunteers meeting local residents",
  },
  {
    id: "g-3",
    src: "/images/bg-1.jpeg",
    alt: "OK Movement members at an event",
    caption: "OK Movement members at a public engagement",
  },
  {
    id: "g-4",
    src: "/images/home/cheri-bustos-hero.png",
    alt: "Citizens gathering at a town hall",
    caption: "Town hall gathering focused on practical solutions",
  },
  {
    id: "g-5",
    src: "/images/home/cheri-bustos-home-reference.png",
    alt: "Campaign volunteers on outreach",
    caption: "Grassroots outreach across neighborhoods",
  },
  {
    id: "g-6",
    src: "/images/bg-1.jpeg",
    alt: "Citizens listening to a campaign update",
    caption: "A campaign update with members and supporters",
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
  },
  {
    id: "n-2",
    date: "April 12, 2026",
    category: "News",
    title: "Community Listening Tour Highlights Youth Priorities and Jobs",
    excerpt:
      "At recent stops, youth groups emphasized skills training, digital opportunity, and practical economic plans that can deliver measurable progress.",
    href: "/home#issues",
  },
  {
    id: "n-3",
    date: "March 29, 2026",
    category: "Press Release",
    title: "Movement Unveils Volunteer Mobilization Program for 2027",
    excerpt:
      "A nationwide volunteer program is opening with focus areas in civic education, voter outreach, and neighborhood-level community organizing.",
    href: "/home#get-involved",
  },
];

const videoItems: VideoItem[] = [
  {
    id: "v-1",
    title: "Movement Highlights: Community Conversations",
    thumbnail: "/images/home/cheri-bustos-hero.png",
  },
  {
    id: "v-2",
    title: "OK Movement Field Update",
    thumbnail: "/images/home/cheri-bustos-home-reference.png",
  },
  {
    id: "v-3",
    title: "Accountability and Governance Message",
    thumbnail: "/images/bg-1.jpeg",
  },
  {
    id: "v-4",
    title: "Voices from Volunteers",
    thumbnail: "/images/home/cheri-bustos-hero.png",
  },
  {
    id: "v-5",
    title: "Policy Priorities in Focus",
    thumbnail: "/images/home/cheri-bustos-home-reference.png",
  },
  {
    id: "v-6",
    title: "Together for a New Dawn",
    thumbnail: "/images/bg-1.jpeg",
  },
];

function TabButton({
  tab,
  activeTab,
  onChange,
}: {
  tab: { key: GalleryTab; label: string };
  activeTab: GalleryTab;
  onChange: (tab: GalleryTab) => void;
}) {
  const isActive = activeTab === tab.key;

  return (
    <button
      type="button"
      onClick={() => onChange(tab.key)}
      className={`min-h-14 px-4 text-xs font-medium uppercase tracking-[0.22em] transition sm:text-sm ${
        isActive
          ? "bg-white text-brand-green"
          : "bg-brand-black/85 text-white hover:bg-brand-black"
      }`}
    >
      {tab.label}
    </button>
  );
}

function ImagesTab() {
  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Image gallery">
      {galleryImages.map((image) => (
        <article key={image.id} className="overflow-hidden bg-white shadow-[0_14px_32px_rgb(0_0_0/0.08)]">
          <div className="relative aspect-4/3">
            <Image src={image.src} alt={image.alt} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover" />
          </div>
          <p className="px-4 py-3 text-sm font-medium text-brand-black/80">{image.caption}</p>
        </article>
      ))}
    </section>
  );
}

function NewsTab() {
  return (
    <section className="mx-auto max-w-4xl space-y-6" aria-label="News and press">
      {newsItems.map((item) => (
        <article key={item.id} className="bg-white px-6 py-8 text-center shadow-[0_20px_42px_rgb(0_0_0/0.1)] sm:px-10 sm:py-10">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-brand-green/60 sm:text-sm">
            {item.date} / {item.category}
          </p>
          <h2 className="mt-5 text-3xl font-medium uppercase leading-tight text-brand-green sm:text-4xl">
            {item.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-brand-black/60 sm:text-lg">
            {item.excerpt}
          </p>
          <Link
            href={item.href}
            className="mt-7 inline-flex min-h-12 items-center justify-center bg-brand-red px-8 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:bg-brand-black"
          >
            Read More
          </Link>
        </article>
      ))}
    </section>
  );
}

function VideosTab() {
  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Video gallery">
      {videoItems.map((video) => (
        <article key={video.id} className="group overflow-hidden bg-white shadow-[0_14px_32px_rgb(0_0_0/0.08)]">
          <div className="relative aspect-video">
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-2xl leading-none text-brand-black shadow-[0_8px_20px_rgb(0_0_0/0.3)]">
                ▶
              </span>
            </div>
          </div>
          <p className="px-4 py-3 text-sm font-medium uppercase tracking-[0.08em] text-brand-black/85">{video.title}</p>
        </article>
      ))}
    </section>
  );
}

export default function MediaGalleryPage() {
  const [activeTab, setActiveTab] = useState<GalleryTab>("news");

  const heading = useMemo(() => {
    if (activeTab === "images") {
      return "Campaign Images";
    }
    if (activeTab === "videos") {
      return "Campaign Videos";
    }
    return "News and Press";
  }, [activeTab]);

  return (
    <main className="min-h-screen bg-[#f2f7f3] text-brand-black">
      <section className="relative isolate overflow-visible bg-[linear-gradient(160deg,#003a1f_0%,#005f33_52%,#00783f_100%)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_20%,rgb(224_40_40/0.26),transparent_34%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_84%,rgb(255_255_255/0.15),transparent_36%)]" />
        <div className="relative mx-auto flex min-h-88 w-[min(100%-1.5rem,72rem)] flex-col items-center justify-center pb-24 pt-18 text-center sm:min-h-96 sm:pb-28 sm:pt-20">
          <p className="text-sm font-medium uppercase tracking-[0.52em] text-white/70">The Latest</p>
          <h1 className="mt-4 text-5xl font-medium leading-none tracking-tight sm:text-6xl lg:text-7xl">{heading}</h1>
        </div>

        <div className="relative mx-auto grid w-[min(100%-1.5rem,44rem)] translate-y-1/2 grid-cols-3 overflow-hidden shadow-[0_16px_34px_rgb(0_0_0/0.25)]">
          {tabs.map((tab) => (
            <TabButton key={tab.key} tab={tab} activeTab={activeTab} onChange={setActiveTab} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-[min(100%-1.5rem,72rem)] pb-14 pt-24 sm:pb-20 sm:pt-28">
        {activeTab === "images" ? <ImagesTab /> : null}
        {activeTab === "news" ? <NewsTab /> : null}
        {activeTab === "videos" ? <VideosTab /> : null}
      </section>
    </main>
  );
}
