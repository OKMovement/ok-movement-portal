import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Menu } from "lucide-react";

import { principalLinks } from "@/components/home/home-data";

const navItems = [
  { label: "Our Movement", href: "/home#movement" },
  { label: "Media Gallery", href: "/home/media-gallery" },
  { label: "Get Involved", href: "/home#get-involved" },
] as const;

function CampaignLogo() {
  return (
    <Link
      href="/home"
      className="inline-flex items-center gap-3 text-brand-black"
      aria-label="OK Movement home"
    >
      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-brand-green bg-white sm:h-16 sm:w-16">
        <Image
          src="/images/new-logo.png"
          alt=""
          fill
          sizes="64px"
          className="object-cover"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-xl font-black tracking-tight sm:text-2xl">OK Movement</span>
        <span className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-green">
          Obi/Kwankwaso 2027
        </span>
      </span>
    </Link>
  );
}

function PrincipalDropdown({ compact = false }: { compact?: boolean }) {
  return (
    <details className={compact ? "group" : "group relative"}>
      <summary
        className={`flex cursor-pointer list-none items-center gap-1 font-black transition hover:text-brand-red [&::-webkit-details-marker]:hidden ${
          compact ? "justify-between px-6 py-4" : ""
        }`}
      >
        Meet Your Principals
        <ChevronDown
          aria-hidden="true"
          className="h-4 w-4 transition group-open:rotate-180"
        />
      </summary>
      <div
        className={
          compact
            ? "border-t border-black/10 bg-white"
            : "absolute left-1/2 top-full z-40 mt-4 w-72 -translate-x-1/2 bg-white p-2 text-brand-black shadow-[0_18px_38px_rgb(0_0_0/0.16)]"
        }
      >
        {principalLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block font-black transition hover:bg-brand-green hover:text-white ${
              compact ? "px-8 py-4 text-sm" : "px-4 py-3 text-sm"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </details>
  );
}

export default function HomeSiteHeader() {
  return (
    <header className="relative z-50 bg-white text-brand-black shadow-[0_6px_20px_rgb(0_0_0/0.08)]">
      <Link
        href="/home#get-involved"
        className="flex min-h-12 items-center justify-center bg-brand-green px-4 text-center text-xs font-bold uppercase tracking-[0.28em] text-white sm:tracking-[0.55em]"
      >
        Official Launch Coming Soon <ArrowRight aria-hidden="true" className="ml-2 h-3.5 w-3.5" />
      </Link>

      <div className="flex min-h-20 items-center justify-between gap-5 px-4 sm:px-6 lg:min-h-24">
        <CampaignLogo />

        <nav className="hidden items-center gap-7 text-sm font-black lg:flex">
          {navItems.map((item) => (
            <Link href={item.href} key={item.label} className="transition hover:text-brand-red">
              {item.label}
            </Link>
          ))}
          <PrincipalDropdown />
          <Link
            href="https://www.facebook.com/share/1CYctYbA2m/?mibextid=wwXIfr"
            className="text-2xl leading-none transition hover:text-brand-red"
            aria-label="Facebook"
          >
            f
          </Link>
          <Link
            href="https://x.com/OK2027movement"
            className="text-2xl leading-none transition hover:text-brand-red"
            aria-label="X"
          >
            X
          </Link>
        </nav>

        <Link
          href="/home#get-involved"
          className="hidden min-h-14 w-full max-w-80 items-center justify-center bg-brand-red px-8 text-xl font-black uppercase tracking-wide text-white shadow-[0_10px_22px_rgb(224_40_40/0.24)] transition hover:bg-black md:flex"
        >
          Join
        </Link>

        <details className="relative lg:hidden">
          <summary className="inline-flex h-12 w-12 cursor-pointer list-none items-center justify-center text-brand-green [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Open menu</span>
            <Menu aria-hidden="true" className="h-7 w-7" />
          </summary>
          <nav className="absolute right-0 top-full z-50 mt-4 w-80 max-w-[calc(100vw-2rem)] bg-white text-sm text-brand-black shadow-[0_18px_38px_rgb(0_0_0/0.16)]">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block border-t border-black/10 px-6 py-4 font-black transition hover:bg-brand-green hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <PrincipalDropdown compact />
          </nav>
        </details>
      </div>
    </header>
  );
}
