"use client";

import { usePathname } from "next/navigation";

export default function AskOkFab() {
  const pathname = usePathname();
  if (pathname === "/home/ask-ok") return null;
  if (pathname.includes("admin")) return null;

  return (
    <a
      href="/home/ask-ok"
      aria-label="Ask OK — AI fact-checker"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-0 rounded-full bg-gradient-to-r from-brand-green to-[#00c060] pr-1 text-white shadow-[0_8px_30px_-6px_rgb(0_166_81/0.5)] transition-all duration-300 hover:shadow-[0_12px_40px_-6px_rgb(0_166_81/0.6)] active:scale-[0.97]"
    >
      <div className="flex items-center gap-2 py-2 pl-4 pr-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[18px] w-[18px] shrink-0"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <circle cx="9" cy="10" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="12" cy="10" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="15" cy="10" r="0.8" fill="currentColor" stroke="none" />
        </svg>
        <div className="flex flex-col leading-tight">
          <span className="text-[14px] font-semibold tracking-wide">
            Ask <span className="font-bold text-[#004d27]">O</span><span className="font-bold text-[#ff4d4d]">K</span>
          </span>
          <span className="text-[9px] font-normal text-white/70">
            Fact-check news about our principals
          </span>
        </div>
      </div>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-[9px] font-extrabold tracking-tight backdrop-blur-sm">
        AI
      </span>
    </a>
  );
}
