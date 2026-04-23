import { FOOTER_CONTENT, SOCIAL_LINKS, type SocialLink } from "./coming-soon-constants";

function SocialIcon({ platform }: { platform: SocialLink["platform"] }) {
  if (platform === "facebook") {
    return (
      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
        <path
          d="M14 8h3V5h-3c-2.9 0-5 2.1-5 5v3H7v3h2v5h3v-5h3l1-3h-4v-3c0-1.2.8-2 2-2z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (platform === "instagram") {
    return (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="3.7" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  if (platform === "youtube") {
    return (
      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
        <path
          d="M21 8.2a3 3 0 0 0-2.1-2.1C17.2 5.6 12 5.6 12 5.6s-5.2 0-6.9.5A3 3 0 0 0 3 8.2 31 31 0 0 0 2.5 12a31 31 0 0 0 .5 3.8 3 3 0 0 0 2.1 2.1c1.7.5 6.9.5 6.9.5s5.2 0 6.9-.5a3 3 0 0 0 2.1-2.1c.4-1.2.5-2.5.5-3.8s-.1-2.6-.5-3.8z"
          fill="currentColor"
        />
        <path d="m10 15.3 4.7-3.3L10 8.7v6.6z" fill="black" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
      <path
        d="m4 4 6.6 8.8L4.3 20H7l4.8-5.6L16 20h4L13 10.8 18.8 4H16l-4.2 4.9L8.3 4H4z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function ComingSoonFooter() {
  return (
    <footer className="relative z-20 w-full border-t border-white/30 bg-black/55 px-6 py-4 backdrop-blur-md md:px-12 md:py-3 lg:px-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-5">
        {/* <p className="text-[0.95rem] text-white/90 md:shrink-0">{FOOTER_CONTENT.subscribeLabel}</p>

        <form
          className="flex w-full max-w-[26rem] items-center gap-2"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            aria-label="Email address"
            className="h-11 w-full rounded-[14px] border border-white/45 bg-black/20 px-4 text-[0.95rem] text-white placeholder:text-white/65 outline-none transition focus:border-white"
            placeholder={FOOTER_CONTENT.emailPlaceholder}
            type="email"
          />
          <button
            className="h-11 w-11 shrink-0 rounded-full border border-white/70 text-[0.9rem] text-white transition hover:bg-white/20"
            type="submit"
          >
            Go
          </button>
        </form> */}

        <p className="text-[0.95rem] text-white/85 md:shrink-0">{FOOTER_CONTENT.subscribeLabel}</p>

        <div className="flex items-center gap-2 md:gap-3">
          {SOCIAL_LINKS.map((socialLink) => (
            <a
              key={socialLink.label}
              aria-label={socialLink.label}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/45 text-white/95 transition hover:border-brand-red hover:text-brand-red"
              href={socialLink.href}
              rel="noreferrer"
              target="_blank"
            >
              <SocialIcon platform={socialLink.platform} />
            </a>
          ))}
        </div>

        <p className="text-[0.82rem] text-white/80 md:ml-auto md:shrink-0">{FOOTER_CONTENT.copyright}</p>
      </div>
    </footer>
  );
}
