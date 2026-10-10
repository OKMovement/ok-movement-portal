"use client";

import ShareButtons from "./share-buttons";
import { SHARE_MESSAGES } from "./share-data";

/** Pre-written posts. Pick one, tap a platform, done — no blank-page problem. */
export default function ShareMessageBank() {
  return (
    <div>
      <div className="max-w-[56ch]">
        <h3 className="font-display text-2xl font-extrabold tracking-tight text-ink">
          Don&apos;t know what to say? We got you.
        </h3>
        <p className="mt-2 text-body">
          Pick a message that sounds like you, tap where you want to post it, and send. Each one
          carries a link that brings people straight here.
        </p>
      </div>

      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {SHARE_MESSAGES.map((message, index) => (
          <li key={message.id}>
            <article
              className={`flex h-full flex-col rounded-xl border border-rule bg-paper-raised p-5 shadow-1 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-22px_rgb(0_0_0/0.28)] ${
                index % 2 === 0 ? "sm:-rotate-[0.4deg]" : "sm:rotate-[0.4deg]"
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h4 className="font-display text-lg font-extrabold tracking-tight text-ink">
                  {message.label}
                </h4>
                <span className="text-right text-[11px] font-semibold uppercase tracking-[0.14em] text-green-deep">
                  {message.useFor}
                </span>
              </div>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-body">{message.text}</p>
              <div className="mt-4">
                <ShareButtons text={message.text} path={message.path} />
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
