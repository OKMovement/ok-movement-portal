"use client";

import { useEffect, useState, type ComponentType, type ReactNode, type SVGProps } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Compass,
  HeartHandshake,
  Image as ImageIcon,
  Menu,
  MessageCircle,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { principalLinks } from "./home-data";
import { SocialIcon, SOCIAL_PROFILES } from "@/components/social-icons";

type NavIcon = ComponentType<SVGProps<SVGSVGElement>>;

type NavItem = {
  label: string;
  href: string;
  icon: NavIcon;
  description: string;
};

const navItems: readonly NavItem[] = [
  {
    label: "Our Movement",
    href: "/home/our-movement",
    icon: Compass,
    description: "Vision, values & the 5 C's",
  },
  {
    label: "Media Gallery",
    href: "/home/media-gallery",
    icon: ImageIcon,
    description: "Photos & campaign moments",
  },
  {
    label: "Get Involved",
    href: "/home/get-involved",
    icon: HeartHandshake,
    description: "Volunteer, donate, organize",
  },
  {
    label: "Upcoming Events",
    href: "/home/upcoming-events",
    icon: CalendarDays,
    description: "Rallies, town halls & more",
  },
  {
    label: "Contact Us",
    href: "/home/contact",
    icon: MessageCircle,
    description: "Reach the OK team",
  },
] as const;

function CampaignLogo() {
  return (
    <a
      href="/home"
      aria-label="OK Movement home"
      className="inline-flex items-center gap-3 text-brand-black"
    >
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_8px_24px_-12px_rgb(0_0_0/0.35)] ring-1 ring-black/5 sm:h-14 sm:w-14">
        <img src="/images/new-logo.png" alt="" className="h-full w-full object-cover" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="whitespace-nowrap text-lg font-semibold tracking-tight sm:text-xl">
          OK Movement
        </span>
        <span className="mt-1 flex items-center gap-1.5 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-green">
          <span aria-hidden="true" className="inline-block h-1 w-1 rounded-full bg-brand-green" />
          Obi · Kwankwaso · 2027
        </span>
      </span>
    </a>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="group relative inline-flex items-center whitespace-nowrap py-2 text-[13px] font-medium tracking-wide text-brand-black transition hover:text-brand-green"
    >
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-brand-green to-brand-red transition-transform duration-300 group-hover:scale-x-100"
      />
    </a>
  );
}

function PrincipalDropdown() {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 whitespace-nowrap py-2 text-[13px] font-medium tracking-wide text-brand-black transition hover:text-brand-green [&::-webkit-details-marker]:hidden">
        Meet Your Principals
        <ChevronDown
          aria-hidden="true"
          className="h-3.5 w-3.5 transition group-open:rotate-180"
        />
      </summary>
      <div className="absolute left-1/2 top-full z-40 mt-3 w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-black/5 bg-white p-2 shadow-[0_24px_48px_-16px_rgb(0_0_0/0.18)]">
        <span
          aria-hidden="true"
          className="absolute inset-x-4 top-0 flex h-px"
        >
          <span className="h-full flex-1 bg-brand-green" />
          <span className="h-full flex-1 bg-brand-black/30" />
          <span className="h-full flex-1 bg-brand-red" />
        </span>
        {principalLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="group/item flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium text-brand-black transition hover:bg-brand-green/10 hover:text-brand-green"
          >
            <span>{link.label}</span>
            <ArrowUpRight
              aria-hidden="true"
              className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition group-hover/item:translate-x-0 group-hover/item:opacity-100"
            />
          </a>
        ))}
      </div>
    </details>
  );
}

export default function HomeSiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePrincipalsOpen, setMobilePrincipalsOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white text-brand-black shadow-[0_1px_0_0_rgb(0_0_0/0.04),0_8px_24px_-16px_rgb(0_0_0/0.18)]">
      {/* Announcement strip */}
      

      {/* Main bar */}
      <div className="flex min-h-[4.5rem] w-full items-center justify-between gap-5 px-4 sm:px-6 lg:px-10 xl:min-h-20 xl:px-12 2xl:px-16">
        <CampaignLogo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-x-6 xl:flex 2xl:gap-x-7" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
          <PrincipalDropdown />
        </nav>

        {/* Desktop right cluster */}
        <div className="hidden items-center gap-3 xl:flex 2xl:gap-4">
          <div className="hidden items-center gap-1 border-l border-black/10 pl-3 2xl:flex 2xl:pl-4">
            {SOCIAL_PROFILES.map((social) => (
              <a
                key={social.platform}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-brand-black/65 transition hover:bg-brand-green/10 hover:text-brand-green"
              >
                <SocialIcon
                  platform={social.platform}
                  className={
                    social.platform === "x"
                      ? "h-[13px] w-[13px]"
                      : "h-[15px] w-[15px]"
                  }
                />
              </a>
            ))}
          </div>
          <a
            href="/home#get-involved"
            className="group inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-brand-green px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_-10px_rgb(0_166_81/0.55)] transition hover:bg-brand-black"
          >
            Join Us
            <ArrowRight
              aria-hidden="true"
              className="h-3.5 w-3.5 transition group-hover:translate-x-0.5"
            />
          </a>
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-brand-black transition hover:bg-brand-green/10 hover:text-brand-green xl:hidden"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <Menu aria-hidden="true" className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-50 xl:hidden ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-brand-black/60 backdrop-blur-md transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <nav
          aria-label="Mobile"
          className={`absolute right-0 top-0 flex h-full w-[min(24rem,92vw)] flex-col bg-[#fafaf7] shadow-[-30px_0_80px_-30px_rgb(0_0_0/0.45)] transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Top tricolor accent */}
          <span aria-hidden="true" className="flex h-[3px] w-full shrink-0">
            <span className="h-full flex-1 bg-brand-green" />
            <span className="h-full flex-1 bg-brand-black" />
            <span className="h-full flex-1 bg-brand-red" />
          </span>

          {/* Brand identity header */}
          <div className="relative flex items-center justify-between gap-3 border-b border-black/5 bg-white px-5 pb-4 pt-5">
            <div className="flex items-center gap-3">
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_8px_24px_-12px_rgb(0_0_0/0.35)] ring-1 ring-black/5">
                <img src="/images/new-logo.png" alt="" className="h-full w-full object-cover" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-[15px] font-semibold tracking-tight text-brand-black">
                  OK Movement
                </span>
                <span className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-green">
                  <span aria-hidden="true" className="inline-block h-1 w-1 rounded-full bg-brand-green" />
                  Obi · Kwankwaso · 2027
                </span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-brand-black/70 transition hover:bg-brand-black hover:text-white"
              aria-label="Close menu"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 pb-6 pt-5">
            {/* Section eyebrow */}
            <div className="mb-3 inline-flex items-center gap-2">
              <span aria-hidden="true" className="h-[2px] w-5 rounded-full bg-brand-green" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-black/60">
                Navigate
              </span>
            </div>

            {/* Nav card */}
            <ul className="overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_-24px_rgb(0_0_0/0.18)] ring-1 ring-black/[0.04]">
              {navItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    {idx > 0 ? (
                      <div aria-hidden="true" className="mx-4 h-px bg-black/[0.06]" />
                    ) : null}
                    <a
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center gap-3.5 px-4 py-3.5 text-brand-black transition active:bg-brand-green/5"
                    >
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green transition group-hover:bg-brand-green group-hover:text-white">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <span className="flex flex-1 flex-col leading-tight">
                        <span className="text-[15px] font-semibold tracking-tight">
                          {item.label}
                        </span>
                        <span className="mt-0.5 text-[12px] text-brand-black/55">
                          {item.description}
                        </span>
                      </span>
                      <ChevronRight
                        aria-hidden="true"
                        className="h-4 w-4 text-brand-black/35 transition group-hover:translate-x-0.5 group-hover:text-brand-green"
                      />
                    </a>
                  </li>
                );
              })}

              {/* Principals expandable */}
              <div aria-hidden="true" className="mx-4 h-px bg-black/[0.06]" />
              <li>
                <button
                  type="button"
                  onClick={() => setMobilePrincipalsOpen((v) => !v)}
                  aria-expanded={mobilePrincipalsOpen}
                  aria-controls="mobile-principals-panel"
                  className="group flex w-full items-center gap-3.5 px-4 py-3.5 text-left text-brand-black transition active:bg-brand-green/5"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red transition group-hover:bg-brand-red group-hover:text-white">
                    <Users aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="flex flex-1 flex-col leading-tight">
                    <span className="text-[15px] font-semibold tracking-tight">
                      Meet Your Principals
                    </span>
                    <span className="mt-0.5 text-[12px] text-brand-black/55">
                      Peter Obi & Rabiu Kwankwaso
                    </span>
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-4 w-4 text-brand-black/40 transition ${mobilePrincipalsOpen ? "rotate-180 text-brand-red" : ""}`}
                  />
                </button>
                <div
                  id="mobile-principals-panel"
                  aria-hidden={!mobilePrincipalsOpen}
                  className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${
                    mobilePrincipalsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="mx-4 mb-3 mt-1 rounded-xl bg-brand-red/[0.04] p-1 ring-1 ring-brand-red/10">
                      {principalLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          tabIndex={mobilePrincipalsOpen ? 0 : -1}
                          aria-hidden={!mobilePrincipalsOpen}
                          className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-brand-black/80 transition hover:bg-white hover:text-brand-red"
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 opacity-60" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            {/* Join Us hero card */}
            <div className="relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-green via-brand-green to-[#007a3c] p-5 text-white shadow-[0_24px_50px_-24px_rgb(0_166_81/0.55)]">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-black/20 blur-2xl"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 flex h-px"
              >
                <span className="h-full flex-1 bg-white/40" />
                <span className="h-full flex-1 bg-white/10" />
                <span className="h-full flex-1 bg-brand-red/70" />
              </span>
              <div className="relative">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/95 ring-1 ring-white/20 backdrop-blur">
                  <Sparkles aria-hidden="true" className="h-3 w-3" />
                  Join the rebirth
                </span>
                <h3 className="mt-3 text-balance text-lg font-semibold leading-snug tracking-tight">
                  Be part of a New Dawn in Nigeria.
                </h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-white/85">
                  Add your voice to a people-powered movement for 2027.
                </p>
                <a
                  href="/home#get-involved"
                  onClick={() => setMobileOpen(false)}
                  className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-green shadow-[0_10px_24px_-10px_rgb(0_0_0/0.35)] transition hover:bg-brand-black hover:text-white"
                >
                  Join Us
                  <ArrowRight
                    aria-hidden="true"
                    className="h-3.5 w-3.5 transition group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            </div>

            {/* Connect / Social */}
            <div className="mt-6">
              <div className="mb-3 inline-flex items-center gap-2">
                <span aria-hidden="true" className="h-[2px] w-5 rounded-full bg-brand-red" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-black/60">
                  Follow the movement
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {SOCIAL_PROFILES.map((social) => (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="group flex aspect-square items-center justify-center rounded-xl bg-white text-brand-black/70 shadow-[0_10px_24px_-18px_rgb(0_0_0/0.3)] ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:bg-brand-green hover:text-white hover:ring-brand-green/40"
                  >
                    <SocialIcon
                      platform={social.platform}
                      className={
                        social.platform === "x"
                          ? "h-[15px] w-[15px]"
                          : "h-[18px] w-[18px]"
                      }
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer microcopy */}
            <p className="mt-6 text-center text-[11px] text-brand-black/50">
              © {new Date().getFullYear()} OK Movement · Obi · Kwankwaso 2027
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}