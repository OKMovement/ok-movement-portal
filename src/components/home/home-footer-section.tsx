import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

import { homeFooterSection } from "./home-data";
import { SocialIcon } from "@/components/social-icons";
import { SOCIAL_PROFILES } from "@/components/social-profiles";

const quickLinks = [
  { label: "Our Movement", href: "/home/our-movement" },
  { label: "Meet your principals", href: "/#candidates" },
  { label: "Media gallery", href: "/home/media-gallery" },
  { label: "Get involved", href: "/home/get-involved" },
  { label: "Donations", href: "/home/donations" },
  { label: "Upcoming events", href: "/home/upcoming-events" },
  { label: "Contact us", href: "/home/contact" },
];

const principalLinks = [
  { label: "Peter Obi's track record", href: "/documents/obi-profile.pdf" },
  { label: "Rabiu Kwankwaso's track record", href: "/documents/rabiu-profile.pdf" },
];

function FooterLink({ href, label }: { href: string; label: string }) {
  const isDocument = /\.pdf(?:$|[?#])/i.test(href);

  if (isDocument) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="group inline-flex items-center text-sm text-white/65 transition-colors duration-200 hover:text-white"
      >
        <span
          aria-hidden="true"
          className="mr-2.5 inline-block h-px w-3 bg-white/30 transition-all duration-200 group-hover:w-5 group-hover:bg-brand-green"
        />
        {label}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="group inline-flex items-center text-sm text-white/65 transition-colors duration-200 hover:text-white"
    >
      <span
        aria-hidden="true"
        className="mr-2.5 inline-block h-px w-3 bg-white/30 transition-all duration-200 group-hover:w-5 group-hover:bg-brand-green"
      />
      {label}
    </Link>
  );
}

export default function HomeFooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id={homeFooterSection.id}
      className="grain grain-on-ink relative overflow-hidden bg-ink text-white"
    >
      <div className="relative mx-auto w-[min(100%-2rem,82rem)] pb-10 pt-16 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3.5" aria-label="OK Movement home">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-white/20">
                <Image src="/images/new-logo.png" alt="" fill sizes="56px" className="object-cover" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl font-bold tracking-tight text-white">
                  OK Movement
                </span>
                <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-green-ink">
                  Obi · Kwankwaso · 2027
                </span>
              </span>
            </Link>

            <p className="mt-7 max-w-[48ch] text-sm leading-relaxed text-white/65 text-pretty">
              A people-powered movement restoring accountability, integrity and competent
              leadership to Nigeria. Together, we build a new dawn.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-white/65">
              <li className="flex items-start gap-3">
                <Mail aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-green-ink" />
                <a
                  href="mailto:info@okmovement.org"
                  className="transition-colors duration-200 hover:text-white"
                >
                  info@okmovement.org
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-green-ink" />
                <span>Unity · Integrity · Competence</span>
              </li>
            </ul>

            <div className="mt-8 flex items-center gap-2.5">
              {SOCIAL_PROFILES.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/15 text-white/80 transition duration-200 hover:-translate-y-0.5 hover:border-brand-green hover:bg-brand-green hover:text-white active:translate-y-0"
                >
                  <SocialIcon platform={social.platform} className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:pl-10">
            <div>
              <h2 className="font-display text-[11px] font-bold uppercase tracking-[0.24em] text-white">
                Explore
              </h2>
              <ul className="mt-5 space-y-3.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-[11px] font-bold uppercase tracking-[0.24em] text-white">
                Principals
              </h2>
              <ul className="mt-5 space-y-3.5">
                {principalLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} OK Movement · Obi/Kwankwaso 2027. All rights reserved.</p>
          <p className="uppercase tracking-[0.14em]">Official OK Movement communications</p>
        </div>
      </div>
    </footer>
  );
}
