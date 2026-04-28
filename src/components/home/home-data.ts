export const principalLinks = [
  { label: "About Peter Obi", href: "/home/about/peter-obi" },
  { label: "About Rabiu Kwankwaso", href: "/home/about/rabiu-kwankwaso" },
] as const;

export const homeMovementSection = {
  id: "movement",
  eyebrow: "Our Movement",
  title: "OK Movement",
  description:
    "The OK Movement is a transformative, people-powered initiative dedicated to restoring accountability and integrity to Nigerian leadership. By redefining how leaders are selected, the movement focuses on character, competence, compassion, capacity, and commitment.",
  ctaLabel: "Learn More",
  ctaHref: "#movement",
};

export const homeIssuesSection = {
  id: "mandate",
  eyebrow: "National Rebirth",
  title: "A New Dawn in Nigeria",
  description:
    "The OK Movement unveils national and state structures to unite Nigerians, restore accountable leadership, and make good governance a reality through better healthcare, education, and lasting security.",
  ctaLabel: "Join the Movement",
  ctaHref: "#get-involved",
  imageSrc: "/images/bg-5.jpeg",
  imageAlt: "OK Movement supporters gathered for a national rebirth campaign",
};

export type PrincipalDropdownItem = {
  id: string;
  label: string;
  description: string;
  href: string;
};

export const homeCampaignSection = {
  id: "candidates",
  eyebrow: "The Principals",
  title: "Meet Your Principals",
  description:
    "Learn more about the two leaders at the heart of the OK Movement and the records they bring to the national rebirth project.",
  items: [
    {
      id: "peter-obi",
      label: "About Peter Obi",
      description:
        "Explore Peter Obi's public-service record, leadership philosophy, and focus on disciplined governance.",
      href: "/home/about/peter-obi",
    },
    {
      id: "rabiu-kwankwaso",
      label: "About Rabiu Kwankwaso",
      description:
        "Explore Rabiu Kwankwaso's grassroots leadership, human-capital investments, and governance record.",
      href: "/home/about/rabiu-kwankwaso",
    },
  ] satisfies PrincipalDropdownItem[],
};

export const homeGetInvolvedSection = {
  id: "get-involved",
  topCtaLabel: "View Peter Obi's Track Record",
  topCtaHref: "/documents/Peter-Obi-Track-Record.pdf",
  eyebrow: "Stay Updated",
  title: "Get Involved",
  submitLabel: "Follow Updates",
  imageSrc: "/images/bg-three.jpg",
  imageAlt: "OK Movement supporters at a public gathering",
};

export const homeFooterSection = {
  id: "home-footer",
};
