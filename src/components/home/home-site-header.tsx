"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
  type SVGProps,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Compass,
  Globe2,
  Heart,
  HeartHandshake,
  Menu,
  Users,
  Vote,
  X,
} from "lucide-react";

import { principalLinks } from "./home-data";
import { SocialIcon } from "@/components/social-icons";
import { SOCIAL_PROFILES } from "@/components/social-profiles";

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
    label: "Get Involved",
    href: "/home/get-involved",
    icon: HeartHandshake,
    description: "Volunteer, donate, organize",
  },
  {
    label: "Diaspora",
    href: "/diaspora",
    icon: Globe2,
    description: "Join Nigerians around the world",
  },
  {
    label: "Upcoming Events",
    href: "/home/upcoming-events",
    icon: CalendarDays,
    description: "Rallies, town halls & more",
  },
] as const;

type ResourceLink = { label: string; href: string };

const campaignMaterialLinks: readonly ResourceLink[] = [
  { label: "Fliers & Banner Designs", href: "/home/campaign-materials" },
  { label: "Campaign Videos", href: "/home/campaign-videos" },
] as const;

/** Closes a `<details>` menu on Escape or a click outside it. */
function useDismissable<T extends HTMLDetailsElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const close = () => node.removeAttribute("open");

    const onPointerDown = (event: PointerEvent) => {
      if (node.open && !node.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !node.open) return;
      close();
      node.querySelector("summary")?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return ref;
}

function CampaignMaterialsMenu({ isActive }: { isActive: boolean }) {
  const ref = useDismissable<HTMLDetailsElement>();

  return (
    <details ref={ref} className="group relative">
      <summary
        className={`flex cursor-pointer list-none items-center gap-1.5 whitespace-nowrap py-2 text-[13px] font-medium transition-colors duration-200 [&::-webkit-details-marker]:hidden ${
          isActive ? "text-green-deep" : "text-ink hover:text-green-deep"
        }`}
      >
        Campaign materials
        <ChevronDown
          aria-hidden="true"
          className="h-3.5 w-3.5 transition-transform duration-200 group-open:rotate-180"
        />
      </summary>
      <div className="absolute left-1/2 top-full mt-3 w-72 -translate-x-1/2 overflow-hidden rounded-lg border border-rule bg-paper-raised p-1.5 shadow-3 [z-index:var(--z-overlay)]">
        {campaignMaterialLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group/item flex items-center justify-between gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium text-ink transition-colors duration-200 hover:bg-green-lift hover:text-green-deep"
          >
            <span>{link.label}</span>
            <ArrowUpRight
              aria-hidden="true"
              className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100"
            />
          </Link>
        ))}
      </div>
    </details>
  );
}

/**
 * The mark deliberately overhangs the masthead — an established part of the
 * campaign's identity. Keep the oversized, translated badge; do not flatten it
 * into an inline avatar.
 */
function CampaignLogo({
  onNavigate,
  compact = false,
}: {
  onNavigate?: () => void;
  /** The drawer header has no room to overhang, so it uses a seated mark. */
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="OK Movement home"
      onClick={onNavigate}
      className="group relative z-10 inline-flex items-center gap-4 text-ink"
    >
      <span
        className={
          compact
            ? "relative flex size-12 shrink-0 items-center justify-center rounded-full bg-paper-raised shadow-2 ring-1 ring-rule-strong"
            : "relative -my-2 flex size-20 shrink-0 translate-y-4 items-center justify-center rounded-full bg-paper-raised p-1 shadow-[0_18px_32px_-16px_rgb(11_24_16/0.48)] ring-1 ring-rule-strong transition-transform duration-200 group-hover:rotate-2 group-hover:scale-[1.03] sm:-my-4 sm:size-28 sm:translate-y-7 sm:p-1.5 xl:-my-7 xl:size-40 xl:translate-y-10"
        }
      >
        {compact ? null : (
          <span
            aria-hidden="true"
            className="absolute -inset-1 -z-10 rounded-full border border-brand-green/20 bg-paper-raised/80 shadow-2"
          />
        )}
        <Image
          src="/images/new-logo.png"
          alt=""
          fill={compact}
          {...(compact ? {} : { width: 320, height: 320 })}
          priority
          sizes="(min-width: 1280px) 160px, (min-width: 640px) 112px, 80px"
          className="h-full w-full rounded-full object-cover"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="whitespace-nowrap font-display text-base font-bold tracking-tight sm:text-xl">
          OK Movement
        </span>
        <span className="mt-1.5 flex items-center gap-1.5 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.2em] text-green-deep">
          <span aria-hidden="true" className="inline-block h-1 w-1 rounded-full bg-brand-green" />
          Obi · Kwankwaso · 2027
        </span>
      </span>
    </Link>
  );
}

function NavLink({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`group relative inline-flex items-center whitespace-nowrap py-2 text-[13px] font-medium transition-colors duration-200 ${
        isActive ? "text-green-deep" : "text-ink hover:text-green-deep"
      }`}
    >
      {children}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-0.5 left-0 h-[2px] w-full origin-left bg-green-deep transition-transform duration-300 ${
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </Link>
  );
}

export default function HomeSiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePrincipalsOpen, setMobilePrincipalsOpen] = useState(false);
  const [mobileMaterialsOpen, setMobileMaterialsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const drawerRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // The drawer is portalled to <body>, which only exists on the client.
  useEffect(() => setIsMounted(true), []);

  // Browser back/forward changes the route without a drawer link being tapped.
  useEffect(() => setMobileOpen(false), [pathname]);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const materialsActive = campaignMaterialLinks.some((link) => isCurrent(link.href));

  // Lock scroll, trap focus inside the drawer, and hand focus back to the
  // trigger on close.
  useEffect(() => {
    if (!mobileOpen) return;

    const drawer = drawerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawer?.querySelector<HTMLElement>("a, button")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (event.key !== "Tab" || !drawer) return;

      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [mobileOpen]);

  const closeDrawer = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 overflow-visible border-b border-rule bg-paper/92 backdrop-blur-md [z-index:var(--z-sticky)]">
      <div className="flex min-h-[4.5rem] w-full items-center justify-between gap-5 px-4 sm:px-6 lg:px-10 xl:min-h-[5rem] xl:px-12">
        <CampaignLogo />

        <nav className="hidden items-center gap-x-7 xl:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} isActive={isCurrent(item.href)}>
              {item.label}
            </NavLink>
          ))}
          <CampaignMaterialsMenu isActive={materialsActive} />
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <div className="hidden items-center gap-0.5 border-r border-rule pr-3 2xl:flex">
            {SOCIAL_PROFILES.map((social) => (
              <a
                key={social.platform}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted transition duration-200 hover:bg-green-lift hover:text-green-deep"
              >
                <SocialIcon
                  platform={social.platform}
                  className={social.platform === "x" ? "h-[13px] w-[13px]" : "h-[15px] w-[15px]"}
                />
              </a>
            ))}
          </div>
          <Link
            href="/home/donations"
            className="group inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md border border-rule-strong px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink transition duration-200 hover:border-brand-red hover:text-brand-red active:scale-[0.98]"
          >
            Donate
            <Heart aria-hidden="true" className="h-3.5 w-3.5 fill-brand-red text-brand-red" />
          </Link>
          <Link
            href="/home/get-involved"
            className="group inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md bg-green-deep px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white shadow-green transition duration-200 hover:bg-ink active:scale-[0.98]"
          >
            Join us
            <ArrowRight
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink transition duration-200 hover:bg-green-lift hover:text-green-deep xl:hidden"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <Menu aria-hidden="true" className="h-6 w-6" />
        </button>
      </div>

      <TricolorHairline />

      {/* Portalled to <body>: the header's backdrop-filter makes it the
          containing block for `position: fixed` descendants, which squashed
          the drawer into the header's 74px height. `hidden` (not just
          translate + pointer-events) keeps its links out of the tab order
          while closed. */}
      {isMounted
        ? createPortal(
            <div
              id="mobile-menu"
              hidden={!mobileOpen}
              className="fixed inset-0 [z-index:var(--z-modal)] xl:hidden"
            >
              <button
                type="button"
                aria-label="Close menu"
                onClick={closeDrawer}
                className="absolute inset-0 cursor-default bg-ink/55 backdrop-blur-sm animate-in fade-in duration-200"
              />
              <nav
                ref={drawerRef}
                aria-label="Mobile"
                className="absolute right-0 top-0 flex h-dvh w-[min(24rem,92vw)] flex-col bg-paper shadow-4 animate-in slide-in-from-right duration-300 ease-out"
              >
                <TricolorHairline className="h-[3px] shrink-0" />

                <div className="flex items-center justify-between gap-3 border-b border-rule bg-paper-raised px-5 py-4">
                  <CampaignLogo onNavigate={closeDrawer} compact />
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-muted transition duration-200 hover:bg-ink hover:text-white active:scale-95"
                    aria-label="Close menu"
                  >
                    <X aria-hidden="true" className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-faint">
                    Navigate
                  </p>

                  <ul className="mt-4 divide-y divide-rule border-y border-rule">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const active = isCurrent(item.href);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={closeDrawer}
                            aria-current={active ? "page" : undefined}
                            className="group flex items-center gap-3.5 py-3.5 text-ink transition-colors duration-200 active:bg-green-lift"
                          >
                            <span
                              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition duration-200 ${
                                active
                                  ? "bg-green-deep text-white"
                                  : "bg-green-lift text-green-deep group-hover:bg-green-deep group-hover:text-white"
                              }`}
                            >
                              <Icon aria-hidden="true" className="h-5 w-5" />
                            </span>
                            <span className="flex flex-1 flex-col leading-tight">
                              <span className="text-[15px] font-semibold tracking-tight">
                                {item.label}
                              </span>
                              <span className="mt-0.5 text-[12px] text-muted">
                                {item.description}
                              </span>
                            </span>
                            <ChevronRight
                              aria-hidden="true"
                              className="h-4 w-4 text-faint transition-transform duration-200 group-hover:translate-x-0.5"
                            />
                          </Link>
                        </li>
                      );
                    })}

                    <MobileDisclosure
                      id="mobile-materials-panel"
                      icon={Vote}
                      title="Campaign materials"
                      description="Official designs and videos"
                      links={campaignMaterialLinks}
                      isOpen={mobileMaterialsOpen}
                      onToggle={() => setMobileMaterialsOpen((open) => !open)}
                      onNavigate={closeDrawer}
                    />
                    <MobileDisclosure
                      id="mobile-principals-panel"
                      icon={Users}
                      title="Meet our principals"
                      description="Peter Obi & Rabiu Kwankwaso"
                      links={principalLinks}
                      isOpen={mobilePrincipalsOpen}
                      onToggle={() => setMobilePrincipalsOpen((open) => !open)}
                      onNavigate={closeDrawer}
                    />
                  </ul>

                  <div className="mt-8 border border-rule bg-paper-raised p-5 shadow-1">
                    <p className="font-display text-lg font-bold leading-snug tracking-tight text-ink text-balance">
                      Be part of a new dawn in Nigeria.
                    </p>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted">
                      Add your voice to a people-powered movement for 2027.
                    </p>
                    <Link
                      href="/home/get-involved"
                      onClick={closeDrawer}
                      className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-green-deep px-5 py-3.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition duration-200 hover:bg-ink active:scale-[0.99]"
                    >
                      Join us
                      <ArrowRight
                        aria-hidden="true"
                        className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>

                  <div className="mt-8">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-faint">
                      Follow the movement
                    </p>
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {SOCIAL_PROFILES.map((social) => (
                        <a
                          key={social.platform}
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={social.label}
                          className="flex aspect-square items-center justify-center rounded-md border border-rule bg-paper-raised text-muted transition duration-200 hover:-translate-y-0.5 hover:border-green-deep hover:text-green-deep"
                        >
                          <SocialIcon
                            platform={social.platform}
                            className={
                              social.platform === "x" ? "h-[15px] w-[15px]" : "h-[18px] w-[18px]"
                            }
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </nav>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}

function TricolorHairline({ className = "h-[2px]" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`rule-tricolor w-full ${className}`}>
      <span className="bg-brand-green" />
      <span className="bg-paper-sunk" />
      <span className="bg-brand-red" />
    </span>
  );
}

function MobileDisclosure({
  id,
  icon: Icon,
  title,
  description,
  links,
  isOpen,
  onToggle,
  onNavigate,
}: {
  id: string;
  icon: NavIcon;
  title: string;
  description: string;
  links: readonly ResourceLink[];
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={id}
        className="group flex w-full items-center gap-3.5 py-3.5 text-left text-ink transition-colors duration-200 active:bg-green-lift"
      >
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-green-lift text-green-deep transition duration-200 group-hover:bg-green-deep group-hover:text-white">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <span className="flex flex-1 flex-col leading-tight">
          <span className="text-[15px] font-semibold tracking-tight">{title}</span>
          <span className="mt-0.5 text-[12px] text-muted">{description}</span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 text-faint transition-transform duration-200 ${
            isOpen ? "rotate-180 text-green-deep" : ""
          }`}
        />
      </button>
      <div id={id} hidden={!isOpen} className="mb-3 border-l-2 border-green-deep/30 pl-3.5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className="flex items-center justify-between gap-3 rounded-md px-2.5 py-2.5 text-[13px] font-medium text-muted transition-colors duration-200 hover:bg-green-lift hover:text-green-deep"
          >
            <span>{link.label}</span>
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 opacity-60" />
          </Link>
        ))}
      </div>
    </li>
  );
}
