const peterObiPortrait = "/Peter.png";
const kwankwasoPortrait = "/Kwankwaso.png";

export type PrincipalCardContent = {
  imageSrc: string;
  name: string;
  badge: string;
  description: string;
  href: string;
  accent: "green" | "red";
};

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
