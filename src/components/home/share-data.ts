import { siteConfig } from "@/lib/seo";

/** Hashtags used on every share. Keep this list short — three reads, five spams. */
export const SHARE_HASHTAGS = ["OKMovement", "ObiKwankwaso2027", "NewDawn"] as const;
export const HASHTAG_LINE = SHARE_HASHTAGS.map((tag) => `#${tag}`).join(" ");

export type SharePlatform = "whatsapp" | "x" | "facebook" | "telegram";

export const SHARE_PLATFORMS: readonly {
  id: SharePlatform;
  label: string;
  /** Tailwind classes for the pill — each platform keeps its recognisable colour. */
  className: string;
}[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    className: "bg-[#128c4a] text-white hover:bg-[#0d6e3a]",
  },
  { id: "x", label: "X", className: "bg-ink text-white hover:bg-ink-raised" },
  {
    id: "facebook",
    label: "Facebook",
    className: "bg-[#1877f2] text-white hover:bg-[#1560c4]",
  },
  {
    id: "telegram",
    label: "Telegram",
    className: "bg-[#229ed9] text-white hover:bg-[#1a82b5]",
  },
];

/** Where shared links land. `path` is site-relative; UTM tags show which channel works. */
export function buildShareUrl(source: string, path = "/"): string {
  const base = `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
  const joiner = base.includes("?") ? "&" : "?";
  return `${base}${joiner}utm_source=${encodeURIComponent(source)}&utm_medium=social&utm_campaign=ok-share`;
}

export function buildShareHref(platform: SharePlatform, text: string, url: string): string {
  const t = encodeURIComponent(text);
  const u = encodeURIComponent(url);
  switch (platform) {
    case "whatsapp":
      return `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
    case "x":
      return `https://twitter.com/intent/tweet?text=${t}&url=${u}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${u}&quote=${t}`;
    case "telegram":
      return `https://t.me/share/url?url=${u}&text=${t}`;
  }
}

export type ShareMessage = {
  id: string;
  label: string;
  /** Short note on when to use it — helps people pick the right one for the right chat. */
  useFor: string;
  text: string;
  /** Page the shared link should open. Defaults to the home page. */
  path?: string;
};

/** Ready-to-post captions. No numbers or claims that are not already on the site. */
export const SHARE_MESSAGES: readonly ShareMessage[] = [
  {
    id: "invite",
    label: "The invite",
    useFor: "Family & friends WhatsApp groups",
    text: `Nigeria will be OK, and it starts with us. 🇳🇬 I'm standing with the OK Movement for Obi–Kwankwaso 2027. Come and be part of it. ${HASHTAG_LINE}`,
  },
  {
    id: "bring-20",
    label: "Bring 20",
    useFor: "Your status, your timeline",
    text: `One person. Twenty voters. That's how a new dawn gets built. I'm bringing my 20 to the OK Movement. Who's with me? ${HASHTAG_LINE}`,
  },
  {
    id: "pvc",
    label: "PVC check",
    useFor: "Anyone who hasn't sorted their voter card",
    text: `Your PVC is the most powerful thing in your pocket. Check your voter card status and get yours sorted early. 🗳️ ${HASHTAG_LINE}`,
    path: "/home/getyourpvc",
  },
  {
    id: "five-cs",
    label: "The 5 C's",
    useFor: "Debates, quote-tweets, the serious crowd",
    text: `Character. Competence. Compassion. Capacity. Commitment. Five standards we won't negotiate on, and the only test that matters for a leader. ${HASHTAG_LINE}`,
    path: "/home/our-movement",
  },
  {
    id: "pidgin",
    label: "Pidgin version",
    useFor: "The group chat that doesn't do formal",
    text: `Nigeria go be OK! Make we join hand, collect our PVC, come out for 2027. OK Movement na for everybody. 🔥 ${HASHTAG_LINE}`,
  },
  {
    id: "new-dawn",
    label: "New dawn",
    useFor: "Instagram & Facebook captions",
    text: `A new dawn is coming to Nigeria, and it's people-powered. Be part of the rebirth with the OK Movement. ☀️ ${HASHTAG_LINE}`,
  },
];

/** The four pledge sizes offered on the card maker. */
export const PLEDGE_COUNTS = [5, 10, 20, 50] as const;

export type PledgeStyle = "bring" | "in" | "ok";

export const PLEDGE_STYLES: readonly { id: PledgeStyle; label: string }[] = [
  { id: "bring", label: "I'm bringing…" },
  { id: "in", label: "I'm in." },
  { id: "ok", label: "Nigeria will be OK" },
];
