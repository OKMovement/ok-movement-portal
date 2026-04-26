import Image from "next/image";
import Link from "next/link";

import { homeFooterSection, type HomeFooterSocial } from "@/components/home/home-data";

function CampaignFooterLogo() {
  return (
    <div className="inline-flex flex-col items-center text-center text-white">
      <span className="relative h-24 w-24 overflow-hidden rounded-full border-[3px] border-white/90 bg-white sm:h-28 sm:w-28">
        <Image
          src="/images/new-logo.png"
          alt=""
          fill
          sizes="112px"
          className="object-cover"
        />
      </span>
      <span className="mt-4 text-3xl font-black leading-none tracking-tight sm:text-4xl">
        {homeFooterSection.logoTitle}
      </span>
      <span className="mt-2 text-lg font-medium uppercase tracking-[0.08em] text-white/90 sm:text-xl">
        {homeFooterSection.logoSubtitle}
      </span>
    </div>
  );
}

function socialIcon(label: HomeFooterSocial["label"]) {
  if (label === "Facebook") {
    return <span aria-hidden="true" className="text-2xl font-semibold leading-none">f</span>;
  }
  if (label === "YouTube") {
    return <span aria-hidden="true" className="text-sm font-bold leading-none">YT</span>;
  }
  if (label === "Instagram") {
    return <span aria-hidden="true" className="text-sm font-bold leading-none">IG</span>;
  }
  return <span aria-hidden="true" className="text-2xl font-semibold leading-none">X</span>;
}

export default function HomeFooterSection() {
  return (
    <footer id={homeFooterSection.id} className="overflow-hidden text-white">
      <div className="grid min-h-[24rem] grid-cols-1 lg:min-h-[30rem] lg:grid-cols-[38%_62%]">
        <aside className="bg-brand-green px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <div className="mx-auto flex max-w-[28rem] flex-col items-center">
            <CampaignFooterLogo />

            <div className="mt-8 w-full space-y-3">
              {homeFooterSection.leftActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`flex min-h-12 w-full items-center justify-center text-base font-black uppercase tracking-[0.12em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-h-14 sm:text-lg ${action.tone === "light" ? "bg-white text-brand-green hover:bg-white/90" : "bg-brand-red text-white hover:bg-brand-black"}`}
                >
                  {action.label}
                </Link>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-3 sm:mt-10 sm:gap-4">
              {homeFooterSection.socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/45 text-white/80 transition hover:border-white/80 hover:text-white sm:h-12 sm:w-12"
                >
                  {socialIcon(social.label)}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <section className="bg-brand-black px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <div className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-base font-black sm:gap-x-7 sm:text-lg">
              {homeFooterSection.navLinks.map((link) => (
                <Link key={link.label} href={link.href} className="text-white/90 transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </nav>

            <p className="mt-8 text-base text-white/60 sm:text-lg">{homeFooterSection.committeeName}</p>
            {homeFooterSection.addressLines.map((line) => (
              <p key={line} className="mt-1.5 text-base text-white/60 sm:text-lg">
                {line}
              </p>
            ))}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm sm:text-base">
              {homeFooterSection.policyLinks.map((link) => (
                <Link key={link.label} href={link.href} className="text-white/45 underline underline-offset-4 transition hover:text-white/70">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-6 w-full max-w-[42rem] border-2 border-brand-green/50 px-4 py-2 text-center text-xs font-medium uppercase tracking-[0.14em] text-white/70 sm:text-sm sm:tracking-[0.16em]">
              {homeFooterSection.disclaimer}
            </div>

            <p className="mt-8 text-xs font-black uppercase tracking-[0.16em] text-white/70 sm:text-sm">
              {homeFooterSection.poweredBy}
            </p>
          </div>
        </section>
      </div>
    </footer>
  );
}
