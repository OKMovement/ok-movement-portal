import Image from "next/image";
import Link from "next/link";

import HomeCampaignSection from "@/components/home/home-campaign-section";
import HomeFooterSection from "@/components/home/home-footer-section";
import HomeGetInvolvedSection from "@/components/home/home-get-involved-section";
import HomeIssuesSection from "@/components/home/home-issues-section";
import HomeMovementSection from "@/components/home/home-movement-section";
import HomeSignupForm from "@/components/home/home-signup-form";
import HomeSiteHeader from "@/components/home/home-site-header";

function SignupForm() {
  return (
    <HomeSignupForm
      formIdPrefix="hero"
      submitLabel="Get Involved"
      ariaLabel="Get involved"
      className="mt-6 w-full max-w-[31rem]"
      buttonClassName="bg-brand-green hover:bg-brand-green"
    />
  );
}

function BottomActions() {
  const actions = [
    { label: "Our Movement", href: "#movement", className: "bg-brand-green" },
    { label: "Meet Your Principals", href: "#candidates", className: "bg-brand-red" },
    { label: "Track Records", href: "/documents/Peter-Obi-Track-Record.pdf", className: "bg-brand-black" },
  ];

  return (
    <div className="relative z-20 mx-auto   -mt-6 grid w-[min(100%-1.5rem,64rem)] grid-cols-1 overflow-hidden sm:-mt-8 sm:grid-cols-3 lg:-mt-10 lg:translate-x-24">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className={`${action.className}  flex min-h-2 items-center justify-center px-5 text-sm font-medium uppercase tracking-wide text-white sm:min-h-16 sm:px-6 sm:text-base lg:min-h-24 lg:text-lg`}
        >
          {action.label}
        </Link>
      ))}
    </div>
  );
}

export default function HomeHero() {
  return (
    <main className="min-h-screen bg-white text-white">
      <HomeSiteHeader />
      <section className="relative isolate min-h-[42rem] overflow-hidden bg-brand-black lg:min-h-[50rem]">
        <div className="absolute inset-0 z-0 h-full w-full">
          <Image
            src="/images/home/home-hero-bg-mobile.jpeg.jpeg"
            alt="OK Movement supporters at a public event"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_center] md:hidden"
          />
          <Image
            src="/images/home/home-hero-bg-desktop.jpeg"
            alt="OK Movement supporters at a public event"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 68vw"
            className="hidden object-cover object-center md:block"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgb(0_166_81/0.48)_0%,rgb(0_166_81/0.34)_18%,rgb(0_166_81/0.22)_34%,rgb(0_166_81/0.12)_50%,rgb(0_166_81/0.06)_64%,rgb(0_166_81/0.02)_76%,rgb(0_166_81/0)_88%)]" />
        <div className="relative z-20 flex min-h-168 items-center px-4 py-16 sm:px-8 sm:py-18 lg:min-h-[50rem] lg:px-24 lg:py-20">
          <div className="mx-auto w-full max-w-152 text-center lg:mx-0 lg:ml-[13%]">
          
            <h1 className="mt-4 text-left text-4xl font-medium leading-[0.95] tracking-normal sm:text-5xl lg:text-7xl">
              A <br /> New Dawn
              <br />
              in Nigeria
            </h1>
            <p className="italic mt-5 text-left max-w-136 text-base leading-relaxed text-white/85 sm:text-lg lg:text-xl">
              The OK Movement unveils national and state structures to unite Nigerians, restore accountable leadership, and drive national rebirth.
            </p>
            <SignupForm />
          </div>
        </div>
      </section>
      {/* <BottomActions /> */}
      <HomeMovementSection />
      <HomeIssuesSection />
      <HomeCampaignSection />
      <HomeGetInvolvedSection />
      <HomeFooterSection />
    </main>
  );
}
