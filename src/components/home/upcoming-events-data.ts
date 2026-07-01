import {
  Award,
  BookOpenCheck,
  Flag,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Users,
  Vote,
} from "lucide-react";

export type EventType =
  | "Town Hall"
  | "Grassroots Training"
  | "Support Group"
  | "Voter Education"
  | "Campaign Rally";

export type FiveC =
  | "Character"
  | "Competence"
  | "Compassion"
  | "Capacity"
  | "Commitment";

export type DateRangeKey = "all" | "this-weekend" | "this-month" | "next-30";

export type UpcomingEvent = {
  id: string;
  title: string;
  type: EventType;
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  startTime: string;
  endTime: string;
  durationLabel: string;
  country: string;
  city: string;
  state: string;
  lga: string;
  venue: string;
  address: string;
  why: string;
  fiveC: FiveC;
  capacity: number;
  registered: number;
  highlights: string[];
  speakers: { name: string; role: string }[];
  language: string;
  featured?: boolean;
  imageQuery: string;
  flierImageUrl: string;
};

export const eventTypes: EventType[] = [
  "Town Hall",
  "Grassroots Training",
  "Support Group",
  "Voter Education",
  "Campaign Rally",
];

export const eventTypeMeta: Record<
  EventType,
  { icon: typeof Megaphone; tone: "green" | "red" | "black"; blurb: string }
> = {
  "Town Hall": {
    icon: Megaphone,
    tone: "green",
    blurb:
      "Open community conversations where citizens question policy, hold leaders to account and shape the rebirth agenda.",
  },
  "Grassroots Training": {
    icon: GraduationCap,
    tone: "red",
    blurb:
      "Hands-on capacity building for ward and LGA organisers — from door-to-door scripting to digital mobilisation.",
  },
  "Support Group": {
    icon: HandHeart,
    tone: "black",
    blurb:
      "Safe circles for shared experiences, mentorship and wellbeing, anchored in the OK Movement community ethos.",
  },
  "Voter Education": {
    icon: Vote,
    tone: "green",
    blurb:
      "Practical clinics on PVC verification, polling unit awareness and your civic rights ahead of 2027.",
  },
  "Campaign Rally": {
    icon: Flag,
    tone: "red",
    blurb:
      "Mass gatherings that turn momentum into mandate — chants, colours, music and the unmistakable signal that the rebirth is here.",
  },
};

export const dateRanges: { value: DateRangeKey; label: string; helper: string }[] =
  [
    { value: "all", label: "All upcoming", helper: "Everything in the calendar" },
    { value: "this-weekend", label: "This weekend", helper: "Sat & Sun" },
    { value: "this-month", label: "This month", helper: "Calendar month" },
    { value: "next-30", label: "Next 30 days", helper: "Rolling window" },
  ];

export const fiveCs: {
  name: FiveC;
  short: string;
  long: string;
  icon: typeof Award;
  tone: "green" | "red" | "black";
}[] = [
  {
    name: "Character",
    short: "Integrity that holds in private and public.",
    long:
      "Leadership that does the right thing when no one is watching — the bedrock of a country that can be trusted.",
    icon: ShieldCheck,
    tone: "green",
  },
  {
    name: "Competence",
    short: "The skill to deliver, not just promise.",
    long:
      "Proven ability to govern complex institutions, drive economies and translate vision into measurable outcomes.",
    icon: Award,
    tone: "red",
  },
  {
    name: "Compassion",
    short: "Policy that puts people first.",
    long:
      "An empathetic posture toward the poorest and most vulnerable — leadership that listens before it legislates.",
    icon: HeartHandshake,
    tone: "black",
  },
  {
    name: "Capacity",
    short: "The bandwidth to carry a nation.",
    long:
      "The intellectual, emotional and physical stamina required to lead Nigeria with clarity and resolve.",
    icon: Sparkles,
    tone: "green",
  },
  {
    name: "Commitment",
    short: "Steadfastness to the rebirth project.",
    long:
      "An unwavering pledge to the Nigerian project — through fatigue, resistance and the long arc of reform.",
    icon: BookOpenCheck,
    tone: "red",
  },
];

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: "ikeja-leadership-forum",
    title: "Ikeja Leadership Accountability Forum",
    type: "Town Hall",
    date: "2026-05-09",
    startTime: "10:00 AM",
    endTime: "1:00 PM",
    durationLabel: "3 hrs",
    country: "Nigeria",
    city: "Ikeja",
    state: "Lagos",
    lga: "Ikeja",
    venue: "Community Hall, Alausa",
    address: "Alausa Secretariat Road, Ikeja, Lagos",
    why:
      "Citizens question lawmakers and aspirants on transparency, debt and service delivery — the Character pillar in action.",
    fiveC: "Character",
    capacity: 250,
    registered: 184,
    language: "English / Pidgin",
    highlights: [
      "Live Q&A with civic leaders",
      "Public scorecard of state commitments",
      "Open mic for first-time voters",
    ],
    speakers: [
      { name: "Hon. Adaobi Mbachu", role: "Civic Policy Advocate" },
      { name: "Tunde Bakare", role: "OK Movement, Lagos Convener" },
    ],
    featured: true,
    imageQuery: "town hall meeting Lagos",
    flierImageUrl: "",
  },
  {
    id: "fct-voter-education",
    title: "FCT Voter Education & PVC Clinic",
    type: "Voter Education",
    date: "2026-05-16",
    startTime: "9:00 AM",
    endTime: "2:00 PM",
    durationLabel: "5 hrs",
    country: "Nigeria",
    city: "Abuja",
    state: "FCT (Abuja)",
    lga: "AMAC",
    venue: "Old Parade Ground, Area 10",
    address: "Old Parade Ground, Area 10, Garki, Abuja",
    why:
      "Get your PVC checked, learn polling-unit logistics and your rights as a voter — Competence at the booth.",
    fiveC: "Competence",
    capacity: 400,
    registered: 312,
    language: "English / Hausa",
    highlights: [
      "On-site PVC verification desks",
      "Walk-throughs of the BVAS process",
      "Election-day rights briefing",
    ],
    speakers: [
      { name: "Barr. Ibrahim Sani", role: "Electoral Lawyer" },
      { name: "Amina Yusuf", role: "FCT Coordinator" },
    ],
    imageQuery: "voter card Nigeria",
    flierImageUrl: "",
  },
  {
    id: "kano-grassroots-training",
    title: "Kano Grassroots Mobilisation Training",
    type: "Grassroots Training",
    date: "2026-05-17",
    startTime: "11:00 AM",
    endTime: "4:00 PM",
    durationLabel: "5 hrs",
    country: "Nigeria",
    city: "Kano",
    state: "Kano",
    lga: "Nassarawa",
    venue: "Coronation Hall, Kano",
    address: "Coronation Hall, Bompai Road, Nassarawa LGA, Kano",
    why:
      "Ward-level organisers learn door-to-door scripting, data capture and digital amplification — building Capacity.",
    fiveC: "Capacity",
    capacity: 150,
    registered: 132,
    language: "English / Hausa",
    highlights: [
      "Door-to-door messaging playbook",
      "WhatsApp & TikTok rapid-response drills",
      "Conflict de-escalation basics",
    ],
    speakers: [
      { name: "Salim Garba", role: "Northern Regional Lead" },
      { name: "Fatimah Bello", role: "Digital Strategist" },
    ],
    imageQuery: "training workshop Nigeria",
    flierImageUrl: "",
  },
  {
    id: "ph-fiscal-town-hall",
    title: "Niger Delta Town Hall on Fiscal Federalism",
    type: "Town Hall",
    date: "2026-05-22",
    startTime: "5:00 PM",
    endTime: "8:00 PM",
    durationLabel: "3 hrs",
    country: "Nigeria",
    city: "Port Harcourt",
    state: "Rivers",
    lga: "Port Harcourt",
    venue: "Hotel Presidential, GRA",
    address: "1 Birabi Street, Old GRA, Port Harcourt, Rivers",
    why:
      "Frontline communities debate revenue sharing, environmental justice and resource control — Compassion in policy.",
    fiveC: "Compassion",
    capacity: 220,
    registered: 220,
    language: "English / Pidgin",
    highlights: [
      "Panel of South-South governors' aides",
      "Community testimonies from oil-bearing LGAs",
      "Position paper drafting workshop",
    ],
    speakers: [
      { name: "Dr. Ezinne Wokoma", role: "Energy Policy Analyst" },
      { name: "Comr. Ifeanyi Odili", role: "South-South Convener" },
    ],
    imageQuery: "Niger Delta community meeting",
    flierImageUrl: "",
  },
  {
    id: "kaduna-support-group",
    title: "Kaduna Youth & Women Support Circle",
    type: "Support Group",
    date: "2026-05-30",
    startTime: "2:00 PM",
    endTime: "5:00 PM",
    durationLabel: "3 hrs",
    country: "Nigeria",
    city: "Kaduna",
    state: "Kaduna",
    lga: "Kaduna North",
    venue: "Arewa House Conference Room",
    address: "1 Rabah Road, Kaduna North LGA, Kaduna",
    why:
      "A safe circle for civic burnout, healing and shared leadership — Compassion as community practice.",
    fiveC: "Compassion",
    capacity: 100,
    registered: 47,
    language: "English / Hausa",
    highlights: [
      "Facilitated wellbeing check-in",
      "Mentor matchmaking for young organisers",
      "Skills-swap board (legal, design, media)",
    ],
    speakers: [
      { name: "Hauwa Aliyu", role: "Wellbeing Facilitator" },
      { name: "Joy Adamu", role: "Mentor Lead, Kaduna" },
    ],
    imageQuery: "support group Nigeria women",
    flierImageUrl: "",
  },
  {
    id: "enugu-volunteer-bootcamp",
    title: "Enugu Volunteer Training Bootcamp",
    type: "Grassroots Training",
    date: "2026-06-06",
    startTime: "10:00 AM",
    endTime: "3:00 PM",
    durationLabel: "5 hrs",
    country: "Nigeria",
    city: "Enugu",
    state: "Enugu",
    lga: "Enugu North",
    venue: "Nike Lake Resort Conference Hall",
    address: "Nike Lake Road, Enugu North LGA, Enugu",
    why:
      "An immersive bootcamp for new volunteers across the South-East — Commitment turned into craft.",
    fiveC: "Commitment",
    capacity: 180,
    registered: 96,
    language: "English / Igbo",
    highlights: [
      "OK Movement messaging deep-dive",
      "Field-safety and de-escalation drills",
      "State coordinator pairing & deployment",
    ],
    speakers: [
      { name: "Chinedu Okolie", role: "South-East Convener" },
      { name: "Ngozi Eze", role: "Volunteer Operations" },
    ],
    imageQuery: "volunteer training Enugu",
    flierImageUrl: "",
  },
  {
    id: "oyo-pvc-clinic",
    title: "Oyo State Voter Card Verification Clinic",
    type: "Voter Education",
    date: "2026-06-13",
    startTime: "9:00 AM",
    endTime: "1:00 PM",
    durationLabel: "4 hrs",
    country: "Nigeria",
    city: "Ibadan",
    state: "Oyo",
    lga: "Ibadan North",
    venue: "Liberty Stadium Forecourt",
    address: "Liberty Stadium, Ring Road, Ibadan North LGA, Oyo",
    why:
      "Verify your PVC, transfer registration and clarify polling-unit details — Competence as the price of admission to 2027.",
    fiveC: "Competence",
    capacity: 300,
    registered: 168,
    language: "English / Yoruba",
    highlights: [
      "Bring-your-PVC verification stations",
      "INEC liaison desk for transfers",
      "Q&A on the 2027 timetable",
    ],
    speakers: [
      { name: "Engr. Wale Akinmade", role: "Election Tech Volunteer" },
      { name: "Bisi Owolabi", role: "Oyo State Coordinator" },
    ],
    imageQuery: "Ibadan voter education",
    flierImageUrl: "",
  },
  {
    id: "borno-town-hall",
    title: "Borno Town Hall: Security, Hope & Rebuilding",
    type: "Town Hall",
    date: "2026-06-21",
    startTime: "4:00 PM",
    endTime: "7:00 PM",
    durationLabel: "3 hrs",
    country: "Nigeria",
    city: "Maiduguri",
    state: "Borno",
    lga: "Maiduguri",
    venue: "El-Kanemi Sports Club Hall",
    address: "El-Kanemi Sports Club, Maiduguri, Borno",
    why:
      "Citizens, IDPs and traditional leaders set the security, livelihoods and reconciliation agenda — Character under pressure.",
    fiveC: "Character",
    capacity: 200,
    registered: 89,
    language: "English / Hausa / Kanuri",
    highlights: [
      "IDP livelihoods listening session",
      "Traditional rulers' communique signing",
      "Youth civic-tech showcase",
    ],
    speakers: [
      { name: "Sen. Mustapha Bukar", role: "Senate Security Committee" },
      { name: "Dr. Hadiza Modu", role: "North-East Convener" },
    ],
    imageQuery: "Maiduguri community meeting",
    flierImageUrl: "",
  },
];

export const eventStats = [
  { value: "8", label: "Events scheduled", helper: "Next 60 days" },
  { value: "12", label: "States covered", helper: "+ FCT (Abuja)" },
  { value: "1,200+", label: "Citizens expected", helper: "Across all events" },
  { value: "100%", label: "Free to attend", helper: "Citizen funded" },
];

export const eventFaqs = [
  {
    q: "Do I have to pay to attend?",
    a: "No. Every OK Movement event is free and citizen-funded. We never charge entry, gate fees or registration fees.",
  },
  {
    q: "What happens after I RSVP?",
    a: "You'll receive an instant confirmation email with the venue, time, an Add-to-Calendar link and a what-to-bring note. A reminder goes out 24 hours before the event.",
  },
  {
    q: "Can I bring a friend or family member?",
    a: "Absolutely — and we encourage it. Each registrant can bring at least one guest. If venue capacity is tight, we'll let you know in your confirmation email.",
  },
  {
    q: "What if the event is full?",
    a: "Full events automatically open a waitlist. If a registered attendee drops out, we promote the next person on the waitlist and email them their confirmation.",
  },
  {
    q: "Can I host an OK Movement event in my LGA?",
    a: "Yes. Tick the 'I would like to help organise this event' box when you RSVP and your state coordinator will reach out within 1–2 business days to scope a hosting plan with you.",
  },
];

export const eventValueProps = [
  {
    title: "Geolocation aware",
    body: "Use your location to surface events near you, or filter by city, state or LGA.",
    icon: "MapPinned",
  },
  {
    title: "Add to your calendar",
    body: "One-click links for Google, Outlook and Apple calendars on every confirmation.",
    icon: "CalendarPlus",
  },
  {
    title: "Capacity & waitlist",
    body: "When a venue is full, we open a waitlist automatically — no manual back-and-forth.",
    icon: "Gauge",
  },
  {
    title: "SMS & email reminders",
    body: "Optional WhatsApp / SMS nudges so you never miss the gathering you signed up for.",
    icon: "BellRing",
  },
];
