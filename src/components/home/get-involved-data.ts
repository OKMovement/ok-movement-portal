import {
  Boxes,
  HandHeart,
  Handshake,
  Heart,
  Megaphone,
  Receipt,
  Smartphone,
  Sprout,
  Users,
} from "lucide-react";

export type EngagementType =
  | "volunteer-individual"
  | "volunteer-organisation"
  | "volunteer-support-group"
  | "donate";

export type EngagementOption = {
  key: EngagementType;
  label: string;
  description: string;
  icon: typeof HandHeart;
};

export const engagementOptions: EngagementOption[] = [
  {
    key: "volunteer-individual",
    label: "Volunteer (Individual)",
    description: "Lend your time, skills and voice as an OK Movement ambassador.",
    icon: HandHeart,
  },
  {
    key: "volunteer-organisation",
    label: "Volunteer (Organisation)",
    description: "Bring your civic group, business or institution alongside ours.",
    icon: Handshake,
  },
  {
    key: "volunteer-support-group",
    label: "Volunteer (Support Group)",
    description: "Help establish and sustain community care groups across the federation.",
    icon: Users,
  },
  {
    key: "donate",
    label: "Donate (Cash / Materials)",
    description: "Fund organising, programmes and campaign materials on the ground.",
    icon: Heart,
  },
];

export const engagementPillars = [
  {
    title: "Volunteering",
    icon: HandHeart,
    accent: "green" as const,
    body:
      "We are calling on passionate and committed volunteers to spread the message of the OK Movement. Volunteers engage directly with communities, raise awareness, and drive local initiatives — becoming ambassadors of change who educate, mobilise and inspire others.",
    bullets: [
      "Field & door-to-door engagement",
      "Digital advocacy and content creation",
      "Event hosting and rally support",
    ],
  },
  {
    title: "Grassroots Organising",
    icon: Sprout,
    accent: "black" as const,
    body:
      "True impact begins at the grassroots. Through strategic partnerships with local leaders, community groups and organisations, we deepen our reach so the movement\u2019s message resonates and leads to tangible outcomes in every state and LGA.",
    bullets: [
      "LGA and ward-level mobilisation",
      "Local leader and youth coalitions",
      "Community-tailored programming",
    ],
  },
  {
    title: "Support Groups & Community Care",
    icon: Users,
    accent: "red" as const,
    body:
      "Support groups are at the heart of the OK Movement. They provide safe spaces for individuals to share experiences, access resources and receive encouragement. Partner with us to help establish and sustain these support systems so no one feels alone.",
    bullets: [
      "Care circles in every senatorial district",
      "Mentorship and skills exchange",
      "Wellbeing and civic literacy",
    ],
  },
  {
    title: "Support & Donations",
    icon: Heart,
    accent: "green" as const,
    body:
      "To sustain and expand our efforts, we rely on the generosity of partners and supporters. Donations \u2014 financial, material or in-kind \u2014 enable us to reach more communities, organise impactful programmes and provide essential resources.",
    bullets: [
      "Cash contributions of any size",
      "Campaign materials and branded items",
      "In-kind goods, skills and venues",
    ],
  },
];

export type DonationKind = {
  title: string;
  icon: typeof Receipt;
  tone: "green" | "red" | "black";
  short: string;
  examples: string[];
};

export const donationKinds: DonationKind[] = [
  {
    title: "Cash Contributions",
    icon: Receipt,
    tone: "green",
    short:
      "Direct financial support powering field operations, training, communications and travel for state coordinators.",
    examples: [
      "Bank transfer to the official campaign account",
      "Mobile money / USSD to verified short codes",
      "One-off, monthly or campaign-cycle pledges",
    ],
  },
  {
    title: "Campaign Materials",
    icon: Megaphone,
    tone: "red",
    short:
      "Printed and branded items that put the movement\u2019s message in every market, ward and senatorial district.",
    examples: [
      "Banners, posters and flyers",
      "T-shirts, caps and wristbands",
      "Stickers, flags and rally kits",
    ],
  },
  {
    title: "In-Kind Goods & Services",
    icon: Boxes,
    tone: "black",
    short:
      "Goods, expertise and infrastructure that reduce our cost of organising and let us reach further, faster.",
    examples: [
      "Venues, transport and logistics",
      "Pro-bono legal, design or media work",
      "Equipment, devices and software licences",
    ],
  },
];

export const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT (Abuja)",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export const nextSteps = [
  {
    title: "Confirm your details",
    description:
      "We send a quick acknowledgement email so you know your registration was received.",
    icon: Smartphone,
  },
  {
    title: "Match with your local team",
    description:
      "Your state coordinator or relevant lead reaches out within 1\u20132 business days.",
    icon: Users,
  },
  {
    title: "Get your starter pack",
    description:
      "Volunteers receive briefing materials. Donors receive secure giving channels and a receipt.",
    icon: Boxes,
  },
  {
    title: "Show up for Nigeria",
    description:
      "Join scheduled activations, rallies, support circles and digital pushes in your area.",
    icon: Megaphone,
  },
];

export const involveStats = [
  { value: "36", label: "States organised", helper: "+ FCT" },
  { value: "120+", label: "Local coordinators", helper: "Across all zones" },
  { value: "6", label: "Geopolitical zones", helper: "Nationwide reach" },
  { value: "100%", label: "Citizen funded", helper: "No vested interests" },
];

export const involveFaqs = [
  {
    q: "Is volunteering paid?",
    a: "No. Volunteering with the OK Movement is a civic contribution. We do, however, cover reasonable, pre-approved expenses for organised field activations.",
  },
  {
    q: "What kinds of materials can I donate?",
    a: "Banners, posters, flyers, t-shirts, caps, wristbands, stickers, flags and rally kits are always in demand. Reach out to us first so we can coordinate quantities and delivery.",
  },
  {
    q: "Will my donation be acknowledged?",
    a: "Yes. Every cash and material contribution is logged and acknowledged with an official receipt sent to the email you provide.",
  },
  {
    q: "Can my organisation co-host an event?",
    a: "Absolutely. Select Volunteer (Organisation) when registering and our partnerships team will arrange a discovery call.",
  },
  {
    q: "I am in the diaspora \u2014 how can I help?",
    a: "Tick the diaspora box on the form. You can amplify the movement online, fund local activations, and convene chapters in your city of residence.",
  },
];
