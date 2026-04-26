export type AboutPrincipal = {
  slug: string;
  eyebrow: string;
  name: string;
  title: string;
  heroImage: string;
  heroAlt: string;
  gallery: {
    src: string;
    alt: string;
  }[];
  introHeading: string;
  introParagraphs: string[];
  quote: string;
  secondParagraphs: string[];
  wideImage: {
    src: string;
    alt: string;
  };
  ctaHref: string;
  ctaLabel: string;
};

export const aboutPrincipals = {
  "peter-obi": {
    slug: "peter-obi",
    eyebrow: "About Peter Obi",
    name: "Peter Obi",
    title: "Meet Peter Obi",
    heroImage: "/images/bg-1.jpeg",
    heroAlt: "Peter Obi arriving at a public political gathering",
    gallery: [
      {
        src: "/images/bg-2.jpeg",
        alt: "Peter Obi and Rabiu Kwankwaso standing with supporters",
      },
      {
        src: "/images/bg-3.jpeg",
        alt: "Peter Obi marching with citizens at a democracy rally",
      },
    ],
    introHeading: "Leading with prudence and measurable results",
    introParagraphs: [
      "Peter Obi's public life has been defined by a disciplined approach to governance, a strong focus on human capital, and a belief that leadership must be judged by outcomes that citizens can feel.",
      "As a former governor and national political figure, he has consistently argued for a Nigeria that moves from consumption to production, protects public resources, and invests deliberately in education, healthcare, jobs, and enterprise.",
      "For the OK Movement, Obi represents the character, competence, compassion, capacity, and commitment needed to rebuild public trust and give ordinary Nigerians a government that works.",
    ],
    quote:
      "Leadership is service, and service must be measured by the lives it improves.",
    secondParagraphs: [
      "His record speaks to the kind of public discipline the movement wants to normalize: government that plans carefully, spends transparently, and treats every public office as a responsibility rather than a reward.",
      "Across the country, his message has connected with citizens who want leaders willing to listen, make hard choices, and prioritize security, productive work, and a future young Nigerians can believe in.",
    ],
    wideImage: {
      src: "/images/bg-7.jpeg",
      alt: "Peter Obi and Rabiu Kwankwaso addressing a large crowd",
    },
    ctaHref: "/documents/Peter-Obi-Track-Record.pdf",
    ctaLabel: "View Peter Obi's Track Record",
  },
  "rabiu-kwankwaso": {
    slug: "rabiu-kwankwaso",
    eyebrow: "About Rabiu Kwankwaso",
    name: "Rabiu Kwankwaso",
    title: "Meet Rabiu Kwankwaso",
    heroImage: "/images/bg-4.jpeg",
    heroAlt: "Rabiu Kwankwaso speaking at a public political gathering",
    gallery: [
      {
        src: "/images/bg-5.jpeg",
        alt: "Rabiu Kwankwaso seated with Peter Obi and public leaders",
      },
      {
        src: "/images/bg-8.jpeg",
        alt: "Rabiu Kwankwaso meeting with Peter Obi",
      },
    ],
    introHeading: "Grassroots leadership with a human-capital focus",
    introParagraphs: [
      "Rabiu Kwankwaso brings a long record of grassroots organization, public administration, and human-capital investment to the national conversation.",
      "His leadership brand has been shaped by mass mobilization, education-focused programs, and the belief that government should open practical pathways for citizens to learn, work, and lead with dignity.",
      "For the OK Movement, Kwankwaso strengthens the call for competence, capacity, and commitment with a record rooted in local organizing and direct engagement with communities.",
    ],
    quote:
      "A stronger Nigeria begins when public leadership develops people, not just projects.",
    secondParagraphs: [
      "His public-service story reflects the movement's focus on building structures that can outlast campaign seasons: organized citizens, clear priorities, and policies that reach classrooms, farms, markets, and neighborhoods.",
      "Together with Peter Obi, the OK Movement presents a national rebirth agenda anchored in unity, integrity, competence, and a practical commitment to improving daily life for Nigerians.",
    ],
    wideImage: {
      src: "/images/bg-6.jpeg",
      alt: "A large crowd gathered at a public rally",
    },
    ctaHref: "/documents/Rabiu-Kwankwaso-Track-Record.pdf",
    ctaLabel: "View Rabiu Kwankwaso Track Record",
  },
} satisfies Record<string, AboutPrincipal>;
