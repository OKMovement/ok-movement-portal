import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "./coming-soon-constants";

const PREVIEW_TOOLTIP_TEXT = "Open PDF preview";

type ComingSoonHeaderProps = {
  mobileMenuOpen: boolean;
  onCloseMenu: () => void;
  onOpenPdf: (fileUrl: string, label: string) => void;
  onToggleMenu: () => void;
};

export default function ComingSoonHeader({
  mobileMenuOpen,
  onCloseMenu,
  onOpenPdf,
  onToggleMenu,
}: ComingSoonHeaderProps) {
  return (
    <header className="relative z-30 flex items-start justify-between px-6 pt-4 md:px-12 md:pt-10 lg:px-20">
      <Link
        className="relative block h-24 w-24  md:size-55"
        href="/"
      >
        <Image
          src="/images/new-logo.png"
          alt="OK Movement logo"
          fill
          sizes="(max-width: 768px) 96px, 144px"
          className="rounded-full object-cover"
          preload
        />
      </Link>

      <nav className="hidden items-center gap-12 pt-8 text-[2rem] md:flex md:text-base">
        {NAV_LINKS.map((link) => {
          const fileUrl = link.fileUrl;

          if (fileUrl) {
            return (
              <button
                key={link.label}
                aria-haspopup="dialog"
                className={`transition-colors hover:text-brand-red ${
                  link.isActive ? "text-brand-red" : "text-white"
                }`}
                title={PREVIEW_TOOLTIP_TEXT}
                type="button"
                onClick={() => onOpenPdf(fileUrl, link.label)}
              >
                {link.label}
              </button>
            );
          }

          return (
            <a
              key={link.label}
              className={`transition-colors hover:text-brand-red ${
                link.isActive ? "text-brand-red" : "text-white"
              }`}
              href={link.href}
            >
              {link.label}
            </a>
          );
        })}
      </nav>

      <button
        aria-expanded={mobileMenuOpen}
        aria-label="Open menu"
        className={`relative mt-8 h-12 w-12 border border-white/15 bg-black/35 p-2.5 md:hidden ${
          mobileMenuOpen ? "text-brand-red" : "text-white"
        }`}
        type="button"
        onClick={onToggleMenu}
      >
        <span className="absolute left-2.5 right-2.5 top-[0.9rem] h-1 rounded-full bg-current" />
        <span className="absolute left-2.5 right-2.5 top-[1.4rem] h-1 rounded-full bg-current" />
        <span className="absolute left-2.5 right-2.5 top-[1.9rem] h-1 rounded-full bg-current" />
      </button>

      <nav
        className={`absolute right-6 top-[7.2rem] z-40 w-72 overflow-hidden bg-black/45 text-sm backdrop-blur-sm transition duration-300 md:hidden ${
          mobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        {NAV_LINKS.map((link) => {
          const fileUrl = link.fileUrl;

          if (fileUrl) {
            return (
              <button
                key={link.label}
                aria-haspopup="dialog"
                className={`block w-full border-t border-white/20 px-8 py-7 text-left transition-colors ${
                  link.isActive ? "text-brand-red" : "text-white"
                }`}
                title={PREVIEW_TOOLTIP_TEXT}
                type="button"
                onClick={() => {
                  onOpenPdf(fileUrl, link.label);
                  onCloseMenu();
                }}
              >
                {link.label}
              </button>
            );
          }

          return (
            <a
              key={link.label}
              className={`block border-t border-white/20 px-8 py-7 transition-colors ${
                link.isActive ? "text-brand-red" : "text-white"
              }`}
              href={link.href}
              onClick={onCloseMenu}
            >
              {link.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
