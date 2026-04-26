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
    <div className="relative z-20 mx-auto -mt-6 grid w-[min(100%-1.5rem,64rem)] grid-cols-1 overflow-hidden shadow-[0_24px_46px_rgb(0_0_0_/_0.24)] sm:-mt-8 sm:grid-cols-3 lg:-mt-10 lg:translate-x-24">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className={`${action.className} flex min-h-14 items-center justify-center px-5 text-sm font-black uppercase tracking-wide text-white sm:min-h-16 sm:px-6 sm:text-base lg:min-h-24 lg:text-lg`}
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
        <div className="absolute inset-y-0 right-0 z-0 h-full w-full md:w-[66%] lg:w-[62%]">
          <Image
            src="/images/bg-1.jpeg"
            alt="OK Movement supporters at a public event"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 68vw"
            className="object-cover object-[70%_center]"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,#000_0%,rgb(0_0_0_/_0.92)_28%,rgb(0_166_81_/_0.5)_48%,rgb(0_166_81_/_0.12)_70%,rgb(0_0_0_/_0)_100%)]" />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_18%_84%,rgb(224_40_40_/_0.5),transparent_34%)]" />
        <div className="relative z-20 flex min-h-[42rem] items-center px-4 py-16 sm:px-8 sm:py-18 lg:min-h-[50rem] lg:px-24 lg:py-20">
          <div className="mx-auto w-full max-w-[38rem] text-center lg:mx-0 lg:ml-[13%]">
            <p className="text-base font-semibold uppercase tracking-[0.38em] text-brand-red sm:tracking-[0.48em]">
              Obi/Kwankwaso 2027
            </p>
            <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-normal sm:text-5xl lg:text-7xl">
              A New Dawn
              <br />
              in Nigeria
            </h1>
            <p className="mx-auto mt-5 max-w-[34rem] text-base font-medium leading-relaxed text-white/85 sm:text-lg lg:text-xl">
              The OK Movement unveils national and state structures to unite Nigerians, restore accountable leadership, and drive national rebirth.
            </p>
            <SignupForm />
          </div>
        </div>
      </section>
      <BottomActions />
      <HomeMovementSection />
      <HomeIssuesSection />
      <HomeCampaignSection />
      <HomeGetInvolvedSection />
      <HomeFooterSection />
    </main>
  );
}
