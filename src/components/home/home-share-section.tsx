"use client";

import { MessageCircle, Megaphone } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";

import DpMaker from "./dp-maker";
import PledgeCardMaker from "./pledge-card-maker";
import { HASHTAG_LINE, SHARE_HASHTAGS } from "./share-data";
import ShareButtons from "./share-buttons";
import ShareMessageBank from "./share-message-bank";
import StickerMarquee from "./sticker-marquee";
import { useReveal } from "./use-reveal";

type TabId = "pledge" | "posts";

const TABS: readonly { id: TabId; label: string; icon: typeof Megaphone }[] = [
  { id: "pledge", label: "Pledge card", icon: Megaphone },
  { id: "posts", label: "Ready-made posts", icon: MessageCircle },
];

const DOT_COLORS = ["bg-brand-green", "bg-ink", "bg-brand-red"] as const;

const MARQUEE_ITEMS = [...SHARE_HASHTAGS.map((tag) => `#${tag}`), "#BringTwenty"];

function BringTwenty() {
  return (
    <div className="sticker-lg mt-12 grid items-center gap-8 rounded-2xl bg-[#f7c968] p-6 text-ink sm:p-9 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-14">
      <div className="flex items-center gap-4">
        <span className="sticker-sm flex h-20 w-20 shrink-0 -rotate-6 items-center justify-center rounded-full bg-green-deep font-display text-lg font-extrabold text-white">
          You
        </span>
        <span aria-hidden="true" className="font-display text-4xl font-extrabold">
          →
        </span>
        <span className="font-display text-7xl font-extrabold leading-none tracking-tight sm:text-8xl">
          20
        </span>
      </div>

      <div>
        <p className="font-display text-2xl font-extrabold uppercase leading-tight tracking-tight sm:text-3xl">
          One person. Twenty voters. Pass it on.
        </p>
        <p className="mt-2 max-w-[60ch] font-medium text-ink/80">
          Sign up your family, your street, your WhatsApp groups, your colleagues. Then ask each
          of them to bring theirs.
        </p>
        <ul
          aria-label="Twenty people, brought by one"
          className="mt-5 grid max-w-md grid-cols-10 gap-2"
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <li
              key={i}
              className={`aspect-square rounded-full border-2 border-ink transition duration-200 hover:-translate-y-1 hover:scale-125 ${DOT_COLORS[i % 3]}`}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function HomeShareSection() {
  const sectionRef = useReveal<HTMLElement>();
  const [tab, setTab] = useState<TabId>("pledge");
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    pledge: null,
    posts: null,
  });

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = TABS.findIndex((item) => item.id === tab);
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    else return;
    event.preventDefault();
    const id = TABS[next]!.id;
    setTab(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <section
      ref={sectionRef}
      id="share"
      aria-labelledby="share-heading"
      className="relative overflow-hidden border-b-2 border-ink bg-green-deep py-20 text-white sm:py-24 lg:py-28"
    >
      {/* Texture so the green is not a flat slab. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.1)_1.25px,transparent_1.25px)] [background-size:22px_22px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-green/50 blur-3xl"
      />

      <div className="relative mx-auto w-[min(100%-2rem,82rem)]">
        <div className="reveal max-w-[48rem]">
          <p className="sticker-sm inline-flex -rotate-2 rounded-full bg-[#f7c968] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-ink">
            Make your DP
          </p>
          <h2
            id="share-heading"
            className="mt-5 font-display text-[clamp(2.4rem,1.2rem+4.4vw,4.6rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-balance"
          >
            Wear it. Post it. <span className="text-[#f7c968]">Bring 20.</span>
          </h2>
          <p className="mt-6 max-w-[56ch] text-lead font-medium leading-relaxed text-white/85 text-pretty">
            Polls open in weeks, not years. Make your profile picture, post your pledge, and ask the
            people who trust you to do the same. 🇳🇬
          </p>
        </div>

        <div className="reveal mt-10 sm:mt-12">
          <DpMaker />
        </div>

        <StickerMarquee
          items={MARQUEE_ITEMS}
          tone="sun"
          tilt
          className="reveal -mx-4 mt-14 sm:mx-0"
        />

        <div className="reveal mt-14 max-w-[40rem]">
          <h3 className="font-display text-3xl font-extrabold uppercase leading-[0.98] tracking-tight sm:text-4xl">
            More ways to <span className="text-[#f7c968]">spread it.</span>
          </h3>
          <p className="mt-3 font-medium text-white/85">
            A pledge card for your status, and ready-made posts for when you don&apos;t know what to
            say.
          </p>
        </div>

        {/* Tools */}
        <div className="sticker-lg reveal mt-8 overflow-hidden rounded-2xl bg-paper-raised text-body">
          <div
            role="tablist"
            aria-label="Share tools"
            onKeyDown={onTabKeyDown}
            className="flex gap-2 overflow-x-auto border-b-2 border-ink bg-[#f7c968] p-2.5"
          >
            {TABS.map((item) => {
              const active = item.id === tab;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  ref={(node) => {
                    tabRefs.current[item.id] = node;
                  }}
                  role="tab"
                  id={`share-tab-${item.id}`}
                  type="button"
                  aria-selected={active}
                  aria-controls={`share-panel-${item.id}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setTab(item.id)}
                  className={`inline-flex min-h-12 shrink-0 items-center gap-2 rounded-lg border-2 px-5 text-sm font-extrabold uppercase tracking-[0.08em] transition duration-200 ${
                    active
                      ? "border-ink bg-ink text-white"
                      : "border-transparent text-ink hover:border-ink hover:bg-white"
                  }`}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`share-panel-${tab}`}
            aria-labelledby={`share-tab-${tab}`}
            className="p-6 sm:p-8 lg:p-10"
          >
            {tab === "pledge" ? <PledgeCardMaker /> : null}
            {tab === "posts" ? <ShareMessageBank /> : null}
          </div>
        </div>

        <div className="reveal">
          <BringTwenty />
        </div>

        {/* Invite the whole site, not just a message */}
        <div className="sticker reveal mt-10 flex flex-col gap-5 rounded-2xl bg-white p-6 text-ink sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[48ch]">
            <p className="font-display text-2xl font-extrabold uppercase tracking-tight">
              Share the movement itself.
            </p>
            <p className="mt-1 text-sm font-medium text-muted">
              Send this website to someone who should be here. {HASHTAG_LINE}
            </p>
          </div>
          <ShareButtons
            size="md"
            text={`Nigeria will be OK, and it starts with us. Join the OK Movement. ${HASHTAG_LINE}`}
          />
        </div>
      </div>
    </section>
  );
}
