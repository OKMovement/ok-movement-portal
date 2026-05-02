const peterObiPortrait = "/Peter.png";
const kwankwasoPortrait = "/Kwankwaso.png";

type AnswerPairSeed = {
  id: string;
  front: string;
  back: string;
  alt: string;
};

export type PrincipalTestimonialCard = {
  id: string;
  frontSrc: string;
  backSrc: string;
  alt: string;
};

export type PrincipalCardContent = {
  imageSrc: string;
  name: string;
  badge: string;
  description: string;
  href: string;
  accent: "green" | "red";
};

const ANSWER_PAIR_SEEDS: AnswerPairSeed[] = [
  { id: "bad-governance", front: "bad-governance-1", back: "bad-governance-1", alt: "On Bad Governance" },
  { id: "change", front: "change-1", back: "change-1", alt: "On Change" },
  { id: "children", front: "children-1", back: "children-1", alt: "On Children & Education" },
  { id: "collective", front: "collective-1", back: "collective-1", alt: "On Collective Action" },
  { id: "corruption", front: "corruption-1", back: "corruption-2", alt: "On Corruption" },
  { id: "diaspora", front: "diaspora-1", back: "diaspora-1", alt: "On the Diaspora" },
  { id: "fight", front: "fight-1", back: "fight-2", alt: "On the Fight Ahead" },
  { id: "governance", front: "governance-1", back: "governance-2", alt: "On Governance" },
  { id: "leadership", front: "leadership-2", back: "leadership-3", alt: "On Leadership" },
  { id: "on-hope", front: "on-hope-1", back: "on-hope-1", alt: "On Hope" },
  { id: "on-youth", front: "on-youth-1", back: "on-youths-2", alt: "On the Youth" },
  { id: "potential", front: "potential-1", back: "potential-2", alt: "On Nigeria's Potential" },
  { id: "production", front: "production-1", back: "production-2", alt: "On Production" },
  { id: "progress", front: "progress-1", back: "progress-2", alt: "On Progress" },
  { id: "saving", front: "saving-1", back: "saving-2", alt: "On Saving Nigeria" },
  { id: "security", front: "security-1", back: "security-1", alt: "On Security" },
  { id: "borrowing", front: "borrowing-2", back: "borrowing-2", alt: "On Borrowing" },
  { id: "type", front: "type-1", back: "type-1", alt: "On the Type of Leaders We Need" },
];

export const principalTestimonials: PrincipalTestimonialCard[] = ANSWER_PAIR_SEEDS.map(
  ({ id, front, back, alt }) => ({
    id,
    frontSrc: `/answers/${front}.jpeg`,
    backSrc: `/answers/${back}.jpeg`,
    alt,
  }),
);

export const principalCards: PrincipalCardContent[] = [
  {
    imageSrc: peterObiPortrait,
    name: "Peter Obi",
    badge: "Discipline · Integrity · Service",
    description:
      "A reform-minded former governor known for prudent stewardship of public funds, evidence-based policy, and a relentless focus on production over consumption.",
    href: "/home/about/peter-obi",
    accent: "green",
  },
  {
    imageSrc: kwankwasoPortrait,
    name: "Rabiu Kwankwaso",
    badge: "Grassroots · Education · Empowerment",
    description:
      "A grassroots leader whose record in Kano centers on transformative human-capital investment — from free education to mass scholarships and women's empowerment.",
    href: "/home/about/rabiu-kwankwaso",
    accent: "red",
  },
];

export const movementStats = [
  { stat: "36", label: "States organized" },
  { stat: "120+", label: "Local chapters" },
  { stat: "25k", label: "Active volunteers" },
  { stat: "5 C's", label: "Of OK leadership" },
];
