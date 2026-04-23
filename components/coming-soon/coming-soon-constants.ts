export const SLIDE_INTERVAL = 3000;

export type SlideItem = {
  id: string;
  src: string;
  alt: string;
};

export const SLIDES: SlideItem[] = [
  {
    id: "bg-one",
    src: "/images/bg-1.jpeg",
    alt: "",
  },
    {
    id: "bg-two",
    src: "/images/bg-2.jpeg",
    alt: "",
  },
    {
    id: "bg-three",
    src: "/images/bg-3.jpeg",
    alt: "",
  },
    {
    id: "bg-four5",
    src: "/images/bg-4.jpeg",
    alt: "",
  },

    {
    id: "bg-four6",
    src: "/images/bg-5.jpeg",
    alt: "",
  },

    {
    id: "bg-four7",
    src: "/images/bg-7.jpeg",
    alt: "",
  },
    {
    id: "bg-four8",
    src: "/images/bg-8.jpeg",
    alt: "",
  },
];

export type NavLink = {
  label: string;
  href: string;
  isActive?: boolean;
  fileUrl?: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Our Movement", href: "#movement", isActive: true },
  { label: "Peter Obi's Track Record", href: "#mandate", fileUrl: "/documents/obi-profile.pdf" },
  { label: "Rabiu Kwankwaso Track Record", href: "#road-ahead", fileUrl: "/documents/rabiu-profile.pdf" },
];

export type SocialLink = {
  label: string;
  href: string;
  platform: "facebook" | "instagram" | "x" | "youtube";
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1CYctYbA2m/?mibextid=wwXIfr",
    platform: "facebook",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/p/DXM5eXZDKZ0/?igsh=ZWNpbmhudXJxdDJy",
    platform: "instagram",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@OKMediaChannel",
    platform: "youtube",
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/OK2027movement",
    platform: "x",
  },
];

export const HERO_CONTENT = {
  kicker: "OBI/KWANKWASO 2027",
  titleLines: ["A", "NEW DAWN", "IN NIGERIA"],
  subtitle:
    "The OK Movement unveils national and state structures to unite Nigerians, restore accountable leadership, and drive national rebirth.",
  movementDescriptionFirst:
    "The OK MOVEMENT is a transformative, people-powered initiative dedicated to restoring accountability and integrity to Nigerian leadership. By fundamentally redefining how leaders are selected, the movement focuses on five essential criteria.",
  movementCriteria: [
    "Character",
    "Competence",
    "Compassion",
    "Capacity",
    "Commitment",
  ],
  movementDescriptionSecond:
    "Join us as we drive the rebirth of a New Nigeria - one where good governance isn't a luxury, but a reality for every Nigerian through better healthcare, education, and lasting security.",
  comingText: "Official Launch Coming Soon",
  anthemQuote:
    '"Oh God of all creation... Help us to build a nation where no man is oppressed."',
};

export const FOOTER_CONTENT = {
  subscribeLabel: "Follow us for updates on upcoming events",
  emailPlaceholder: "Email address",
  onlineLabel: "Find us online",
  socialLabel: "UNITY | INTEGRITY | COMPETENCE",
  copyright: "Copyright © 2026",
};
