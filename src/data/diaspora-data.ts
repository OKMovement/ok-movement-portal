import {
  Boxes,
  Globe2,
  HandHeart,
  Landmark,
  Megaphone,
  Radio,
  Receipt,
  Smartphone,
  Sprout,
  Users,
} from "lucide-react";

export type DiasporaEngagementType =
  | "volunteer-abroad"
  | "chapter-lead"
  | "donate"
  | "professional-skills";

export type DiasporaEngagementOption = {
  key: DiasporaEngagementType;
  label: string;
  description: string;
  icon: typeof HandHeart;
};

export const diasporaEngagementOptions: DiasporaEngagementOption[] = [
  {
    key: "volunteer-abroad",
    label: "Volunteer from Abroad",
    description:
      "Amplify the movement online, phone-bank home, and sensitise Nigerians in your city.",
    icon: HandHeart,
  },
  {
    key: "chapter-lead",
    label: "Lead a City Chapter",
    description:
      "Convene OK Movement members where you live — town halls, watch parties and meet-ups.",
    icon: Users,
  },
  {
    key: "donate",
    label: "Donate to the Agenda",
    description:
      "Fund voter education, grassroots organising and campaign materials back home.",
    icon: Receipt,
  },
  {
    key: "professional-skills",
    label: "Offer Professional Skills",
    description:
      "Give pro-bono expertise — tech, media, legal, research, design — from anywhere.",
    icon: Globe2,
  },
];

export const diasporaPillars = [
  {
    title: "Mobilise & Sensitise",
    icon: Megaphone,
    accent: "green" as const,
    body:
      "You are the movement's voice abroad. Sensitise Nigerians in your city about the 2027 general election — why it matters, what is at stake, and how a credible ticket takes our country back from corrupt politicians, bandits and corrupt bureaucrats. Then reach home: urge family and friends to collect their PVCs and turn out.",
    bullets: [
      "Host town halls, watch parties and meet-ups in your city",
      "Run PVC awareness drives targeted at family back home",
      "Phone-bank and message home networks before election day",
    ],
  },
  {
    title: "Amplify the Message Online",
    icon: Radio,
    accent: "red" as const,
    body:
      "The digital space is a constituency with no borders. From wherever you are, you can counter misinformation, share verified campaign updates, and make the case for credible leadership to millions of Nigerians at home and abroad.",
    bullets: [
      "Share verified content from official OK Movement channels",
      "Counter fake news with facts — in group chats and timelines",
      "Create content in your language for your home community",
    ],
  },
  {
    title: "Fund the New Nigeria",
    icon: Sprout,
    accent: "black" as const,
    body:
      "Diaspora remittances already keep millions of Nigerian families going. A fraction of that generosity, pointed at accountable citizen organising, funds voter education, ward-level mobilisation and campaign materials — so credible candidates are elected to serve the people, not line their own pockets.",
    bullets: [
      "One-off or monthly contributions of any size",
      "Sponsor voter education in your home LGA or state",
      "Every contribution logged, receipted and acknowledged",
    ],
  },
  {
    title: "Lend Your Expertise",
    icon: Landmark,
    accent: "green" as const,
    body:
      "The diaspora is Nigeria's deepest bench of professionals. Software engineers, doctors, lawyers, researchers, journalists, designers — your skills, applied remotely, multiply what the movement can do at home.",
    bullets: [
      "Tech, data and digital security volunteering",
      "Pro-bono legal, media, research and design work",
      "Mentorship for organisers and young leaders at home",
    ],
  },
];

export type DiasporaSupportKind = {
  title: string;
  icon: typeof Receipt;
  tone: "green" | "red" | "black";
  short: string;
  examples: string[];
};

export const diasporaSupportKinds: DiasporaSupportKind[] = [
  {
    title: "Give from Abroad",
    icon: Receipt,
    tone: "green",
    short:
      "Direct financial support in any currency, powering voter education, organiser training and get-out-the-vote operations across all 36 states and the FCT.",
    examples: [
      "Secure international transfer to verified channels",
      "One-off, monthly or campaign-cycle pledges",
      "Official receipt and acknowledgement for every gift",
    ],
  },
  {
    title: "Adopt Your Home LGA",
    icon: Sprout,
    tone: "red",
    short:
      "Point your support at the community that raised you. Sponsor PVC drives, ward meetings and election-day logistics in your own local government area.",
    examples: [
      "Sponsor a PVC awareness drive in your home ward",
      "Fund transport and logistics for local organisers",
      "Equip polling-unit agents in your LGA for election day",
    ],
  },
  {
    title: "In-Kind & Expertise",
    icon: Boxes,
    tone: "black",
    short:
      "Not every contribution is cash. Equipment, software, airtime and professional services from abroad cut the cost of organising at home.",
    examples: [
      "Devices, software licences and data/airtime support",
      "Pro-bono professional services delivered remotely",
      "Media placements and diaspora event venues",
    ],
  },
];

export const diasporaNextSteps = [
  {
    title: "Confirm your details",
    description:
      "We send a quick acknowledgement email so you know your registration was received.",
    icon: Smartphone,
  },
  {
    title: "Meet the diaspora desk",
    description:
      "A diaspora desk coordinator reaches out within 1–2 business days — in your time zone.",
    icon: Globe2,
  },
  {
    title: "Join your city chapter",
    description:
      "We connect you with OK Movement members near you — or help you start the first chapter in your city.",
    icon: Users,
  },
  {
    title: "Move the needle at home",
    description:
      "Take part in digital pushes, PVC drives aimed at home networks, and diaspora fundraising moments.",
    icon: Megaphone,
  },
];

export const diasporaStats = [
  { value: "17M+", label: "Nigerians abroad", helper: "Every continent" },
  { value: "$20B+", label: "Sent home yearly", helper: "Diaspora remittances" },
  { value: "6", label: "Continents organising", helper: "One movement" },
  { value: "2027", label: "The assignment", helper: "General election" },
];

export const diasporaFaqs = [
  {
    q: "Can I vote from abroad in 2027?",
    a: "Not yet — Nigeria does not currently operate diaspora voting, and you must be present at your polling unit in Nigeria to vote. That is exactly why the diaspora's role is so powerful: mobilise the voters you know at home, and if you can travel, plan to be home with a valid PVC for election day.",
  },
  {
    q: "I don't have a PVC. Does that matter?",
    a: "You can still do almost everything — sensitise, organise, donate and volunteer. If you will be in Nigeria during a registration window, our Get Your PVC guide walks you through registering and collecting your card.",
  },
  {
    q: "How do I start an OK Movement chapter in my city?",
    a: "Select \u201cLead a City Chapter\u201d when you register. The diaspora desk will share the chapter starter kit, connect you with members already in your city, and support your first meet-up.",
  },
  {
    q: "Is my donation from abroad acknowledged?",
    a: "Yes. Every contribution is logged and acknowledged with an official receipt sent to the email you provide, and we only ever share verified giving channels after you register.",
  },
  {
    q: "I have limited time. What is the highest-impact thing I can do?",
    a: "Reach ten people at home. Personal messages from a trusted relative abroad move more voters than any billboard — urge your family and friends to collect their PVCs, and check in with them again before election day.",
  },
];
