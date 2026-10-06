"use client";

import { ArrowUpRight, Check, Copy, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Partnership details — shared by the hero slide and this modal.      */
/* ------------------------------------------------------------------ */

export const SUPERGROUP_URL =
  "https://smartballotapp.com/supergroup?code=NCZOG5PL-E3QTQMXH";
export const INVITE_CODE = "NCZOG5PL-E3QTQMXH";

export const PARTNERSHIP_IMAGE = "/images/home/smartballot-partnership.jpg";
const QR_IMAGE = "/images/home/smartballot-supergroup-qr.jpg";

function TricolorRule({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`rule-tricolor ${className}`}>
      <span className="bg-brand-green" />
      <span className="bg-paper-sunk" />
      <span className="bg-brand-red" />
    </span>
  );
}

export default function PartnershipModal({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  // Close on Escape and lock background scroll while the dialog is open.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(INVITE_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="partnership-modal-title"
      className="fixed inset-0 z-[400] flex items-end justify-center overflow-y-auto bg-ink/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative my-0 w-full max-w-3xl overflow-hidden rounded-t-2xl bg-paper-raised shadow-2xl sm:my-8 sm:rounded-2xl">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close announcement"
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink shadow-1 transition hover:bg-brand-red hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-deep"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid gap-0 sm:grid-cols-[minmax(0,0.5fr)_minmax(0,1fr)]">
          {/* Announcement flier — kept small; the QR is the focus. */}
          <div className="relative hidden bg-brand-green sm:flex sm:items-center sm:justify-center sm:p-4">
            <Image
              src={PARTNERSHIP_IMAGE}
              alt="OK Movement has partnered with Smart Ballot"
              width={320}
              height={400}
              sizes="(min-width: 640px) 30vw, 100vw"
              className="h-auto w-full max-w-[14rem] rounded-lg object-contain shadow-lg"
            />
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <TricolorRule className="h-[3px] w-12 rounded-full" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                Exciting partnership
              </span>
            </div>

            <h2
              id="partnership-modal-title"
              className="mt-4 font-display text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl"
            >
              OK Movement <span className="text-muted">×</span>{" "}
              <span className="text-green-deep">Smart Ballot</span>
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-body">
              We&apos;ve officially joined hands with{" "}
              <strong className="font-semibold text-ink">Smart Ballot</strong>,
              mobilising <em>polling unit by polling unit</em> and uniting voters
              from all 176,846 polling units in Nigeria in one SuperChat group.
              Together we will build a strong grassroots movement — mobilise,
              organise, empower, win.
            </p>

            {/* QR — the primary way to join; scan with a phone camera. */}
            <div className="mt-6 flex flex-col items-center">
              <div className="rounded-2xl border border-rule bg-white p-4 shadow-1">
                <Image
                  src={QR_IMAGE}
                  alt="QR code to join the Obi/Kwankwaso 2027 SuperChat group"
                  width={240}
                  height={240}
                  className="h-52 w-52 sm:h-56 sm:w-56"
                />
              </div>
              <p className="mt-3 text-center text-sm font-semibold text-ink">
                Scan with your phone to join
              </p>
              <p className="text-center text-xs text-muted">
                Point your camera at the code — no app needed.
              </p>
            </div>

            {/* Fallbacks for anyone reading on the same device. */}
            <div className="mt-5">
              <a
                href={SUPERGROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-md bg-green-deep px-5 text-sm font-semibold tracking-wide text-white shadow-green transition hover:-translate-y-0.5 hover:bg-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-green-deep focus-visible:ring-offset-2"
              >
                Or tap to join the SuperChat
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <div className="mt-3">
                <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                  Invitation code
                </span>
                <div className="mt-1.5 flex items-center gap-2 rounded-md border border-rule bg-paper-sunk px-3 py-2">
                  <code className="min-w-0 flex-1 truncate font-mono text-sm font-semibold tracking-wide text-ink">
                    {INVITE_CODE}
                  </code>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-green-deep transition hover:bg-green-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-green-deep"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-xs font-semibold text-muted sm:text-left">
              Nigeria is OK. Nigeria will be OK.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
