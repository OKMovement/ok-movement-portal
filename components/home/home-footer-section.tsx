"use client";

import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { homeFooterSection } from "./home-data";
import { SocialIcon, SOCIAL_PROFILES } from "@/components/social-icons";

const quickLinks = [
  { label: "Our Movement", href: "/home/our-movement" },
  { label: "Meet Your Principals", href: "/home#candidates" },
  { label: "Media Gallery", href: "/home/media-gallery" },
  { label: "Get Involved", href: "/home/get-involved" },
  { label: "Upcoming Events", href: "/home/upcoming-events" },
  { label: "Contact Us", href: "/home/contact" },
];

const principalLinks = [
  { label: "About Peter Obi", href: "/home/about/peter-obi" },
  { label: "About Rabiu Kwankwaso", href: "/home/about/rabiu-kwankwaso" },
  {
    label: "Peter Obi's Track Record",
    href: "/documents/obi-profile.pdf",
  },
  {
    label: "Rabiu Kwankwaso Track Record",
    href: "/documents/rabiu-profile.pdf",
  },
];

export default function HomeFooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id={homeFooterSection.id}
      className="relative overflow-hidden bg-brand-black text-white"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-green via-white to-brand-red"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-brand-green/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-brand-red/10 blur-3xl"
      />

      <div className="relative mx-auto w-[min(100%-2rem,80rem)] px-0 pb-10 pt-16 sm:pt-20">
        <div className="grid grid-cols-1 gap-12 text-center lg:grid-cols-12 lg:gap-10 lg:text-left">
          <div className="lg:col-span-4">
            <a
              href="/home"
              className="inline-flex items-center gap-3"
              aria-label="OK Movement home"
            >
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white/20 bg-white">
                <img
                  src="/images/new-logo.png"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="flex flex-col leading-none text-left">
                <span className="text-xl font-semibold tracking-tight text-white">
                  OK Movement
                </span>
                <span className="mt-1.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-brand-green">
                  Obi/Kwankwaso 2027
                </span>
              </span>
            </a>

            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/65 lg:mx-0">
              A people-powered movement restoring accountability, integrity,
              and competent leadership to Nigeria. Together, we build a new
              dawn.
            </p>

            <div className="mt-8 flex items-center justify-center gap-3 lg:justify-start">
              {SOCIAL_PROFILES.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/85 transition hover:-translate-y-0.5 hover:border-brand-green hover:bg-brand-green hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                >
                  <SocialIcon
                    platform={social.platform}
                    className="h-[18px] w-[18px]"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
                Explore
              </h3>
              <ul className="mt-5 space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center text-sm text-white/65 transition hover:text-white"
                    >
                      <span className="mr-2 inline-block h-px w-3 bg-white/30 transition group-hover:w-5 group-hover:bg-brand-green" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
                Principals
              </h3>
              <ul className="mt-5 space-y-3">
                {principalLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center text-sm text-white/65 transition hover:text-white"
                    >
                      <span className="mr-2 inline-block h-px w-3 bg-white/30 transition group-hover:w-5 group-hover:bg-brand-green" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Join the Movement
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-white/65">
              Stay connected with the latest from the OK Movement and find out
              how you can get involved in your community.
            </p>

            <a
              href="/home#get-involved"
              className="mt-6 inline-flex items-center justify-center gap-2 bg-brand-green px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-brand-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get Involved
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>

            <ul className="mt-8 space-y-3 text-sm text-white/65">
              <li className="flex items-start justify-center gap-3 lg:justify-start">
                <Mail
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-green"
                />
                <span>info@okmovement.org</span>
              </li>
              <li className="flex items-start justify-center gap-3 lg:justify-start">
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-green"
                />
                <span>Unity · Integrity · Competence</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center gap-4 text-center text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p>
              © {currentYear} OK Movement · Obi/Kwankwaso 2027. All rights
              reserved.
            </p>
            <p className="uppercase tracking-[0.16em]">
              Official OK Movement communications
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
