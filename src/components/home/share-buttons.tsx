"use client";

import { Check, Copy, Facebook, MessageCircle, Send, Share2, Twitter } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  SHARE_PLATFORMS,
  buildShareHref,
  buildShareUrl,
  type SharePlatform,
} from "./share-data";

const PLATFORM_ICON: Record<SharePlatform, typeof Twitter> = {
  whatsapp: MessageCircle,
  x: Twitter,
  facebook: Facebook,
  telegram: Send,
};

type ShareButtonsProps = {
  text: string;
  /** Site-relative path the shared link opens. */
  path?: string;
  /** `sm` for rows inside cards, `md` for stand-alone use. */
  size?: "sm" | "md";
};

/**
 * One row of share targets. Each platform gets its own UTM source so the team can
 * see which channel actually brings people in.
 */
export default function ShareButtons({ text, path = "/", size = "sm" }: ShareButtonsProps) {
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const pill =
    size === "md"
      ? "min-h-11 gap-2 px-4 text-sm"
      : "min-h-10 gap-1.5 px-3 text-[13px]";

  const copy = async () => {
    const payload = `${text}\n${buildShareUrl("copy", path)}`;
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard is blocked (insecure context / permissions) — nothing to do silently.
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ text, url: buildShareUrl("native", path) });
    } catch {
      // The sheet was dismissed — not an error worth surfacing.
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {SHARE_PLATFORMS.map((platform) => {
        const Icon = PLATFORM_ICON[platform.id];
        return (
          <a
            key={platform.id}
            href={buildShareHref(platform.id, text, buildShareUrl(platform.id, path))}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center rounded-full font-semibold transition duration-200 hover:-translate-y-0.5 active:scale-[0.97] ${pill} ${platform.className}`}
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
            <span>{platform.label}</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        );
      })}

      <button
        type="button"
        onClick={copy}
        className={`inline-flex items-center justify-center rounded-full border border-rule-strong bg-paper-raised font-semibold text-ink transition duration-200 hover:-translate-y-0.5 hover:border-green-deep hover:text-green-deep active:scale-[0.97] ${pill}`}
      >
        {copied ? (
          <Check aria-hidden="true" className="h-4 w-4 text-green-deep" />
        ) : (
          <Copy aria-hidden="true" className="h-4 w-4" />
        )}
        {copied ? "Copied" : "Copy"}
      </button>

      {canNativeShare ? (
        <button
          type="button"
          onClick={nativeShare}
          className={`inline-flex items-center justify-center rounded-full border border-rule-strong bg-paper-raised font-semibold text-ink transition duration-200 hover:-translate-y-0.5 hover:border-green-deep hover:text-green-deep active:scale-[0.97] ${pill}`}
        >
          <Share2 aria-hidden="true" className="h-4 w-4" />
          More
        </button>
      ) : null}

      <span aria-live="polite" className="sr-only">
        {copied ? "Message and link copied to clipboard" : ""}
      </span>
    </div>
  );
}
