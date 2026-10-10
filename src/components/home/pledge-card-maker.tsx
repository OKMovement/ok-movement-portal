"use client";

import { Download, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { siteConfig } from "@/lib/seo";

import { nigerianStates } from "./get-involved-data";
import {
  BRAND,
  LOGO_SRC,
  canShareImageFiles,
  canvasToBlob,
  drawLogoBadge,
  fitFont,
  loadImage,
  resolveDisplayFont,
  roundRectPath,
  saveBlob,
  shareImage,
} from "./share-canvas";
import {
  HASHTAG_LINE,
  PLEDGE_COUNTS,
  PLEDGE_STYLES,
  type PledgeStyle,
} from "./share-data";
import ShareButtons from "./share-buttons";

type Format = "square" | "story";

const WIDTH = 1080;
const HEIGHTS: Record<Format, number> = { square: 1080, story: 1920 };
const DIASPORA = "Nigerians abroad";

const HEADLINES: Record<PledgeStyle, (count: number) => [string, string]> = {
  bring: (count) => ["I'M BRINGING", `${count} VOTERS.`],
  in: () => ["I'M IN.", "ARE YOU?"],
  ok: () => ["NIGERIA", "WILL BE OK."],
};

const SUBLINES: Record<PledgeStyle, string> = {
  bring: "Nigeria will be OK, and it starts with us.",
  in: "Join me in the OK Movement.",
  ok: "I'm standing with the OK Movement.",
};

type CardOptions = {
  format: Format;
  style: PledgeStyle;
  count: number;
  name: string;
  state: string;
  logo: HTMLImageElement | null;
  fontFamily: string;
  host: string;
};

function drawCard(ctx: CanvasRenderingContext2D, o: CardOptions): void {
  const W = WIDTH;
  const H = HEIGHTS[o.format];
  const story = o.format === "story";
  const margin = 80;

  // Ground + glow
  ctx.fillStyle = BRAND.greenDeep;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.88, H * 0.12, 20, W * 0.88, H * 0.12, W * 0.9);
  glow.addColorStop(0, "rgba(0,166,81,0.65)");
  glow.addColorStop(1, "rgba(0,166,81,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Logo watermark, bleeding off the bottom right.
  if (o.logo) {
    ctx.save();
    ctx.globalAlpha = 0.09;
    const mark = W * 1.05;
    ctx.drawImage(o.logo, W - mark * 0.78, H - mark * 0.82, mark, mark);
    ctx.restore();
  }

  // Tricolour bar
  const bar = ["#00a651", "#ffffff", "#e02828"];
  bar.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect((W / 3) * i, 0, W / 3 + 1, 22);
  });

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  // Eyebrow
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.font = `700 28px ${o.fontFamily}`;
  if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "5px";
  ctx.fillText("OK MOVEMENT · OBI–KWANKWASO 2027", margin, story ? 150 : 120);
  if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px";

  // Headline — both lines share one size so they read as a single block.
  const [line1, line2] = HEADLINES[o.style](o.count);
  const maxWidth = W - margin * 2;
  const start = story ? 190 : 170;
  const size = Math.min(
    fitFont(ctx, line1, 800, o.fontFamily, start, maxWidth, 60),
    fitFont(ctx, line2, 800, o.fontFamily, start, maxWidth, 60),
  );
  const top = story ? 470 : 240;
  ctx.font = `800 ${size}px ${o.fontFamily}`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(line1, margin, top + size);
  ctx.fillStyle = BRAND.sun;
  ctx.fillText(line2, margin, top + size * 2.02);

  // Sub line
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  fitFont(ctx, SUBLINES[o.style], 600, o.fontFamily, 40, maxWidth, 24);
  ctx.fillText(SUBLINES[o.style], margin, top + size * 2.02 + 78);

  // Name card + footer
  const footerY = story ? H - 170 : H - 52;
  const cardH = 190;
  const cardY = footerY - 68 - cardH;
  const cardW = W - margin * 2;

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 14;
  roundRectPath(ctx, margin, cardY, cardW, cardH, 28);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.restore();

  const badgeR = 66;
  const textMax = cardW - 60 - badgeR * 2 - 30;
  const name = o.name.trim() || "Your name";
  ctx.fillStyle = o.name.trim() ? BRAND.ink : "rgba(11,16,12,0.35)";
  fitFont(ctx, name, 800, o.fontFamily, 76, textMax, 28);
  ctx.fillText(name, margin + 36, cardY + 92);
  ctx.fillStyle = BRAND.greenDeep;
  ctx.font = `700 34px ${o.fontFamily}`;
  ctx.fillText(`${o.state || "Nigeria"} · OK Movement`, margin + 36, cardY + 148);

  drawLogoBadge(ctx, o.logo, margin + cardW - 36 - badgeR, cardY + cardH / 2, badgeR);

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = `700 30px ${o.fontFamily}`;
  ctx.fillText(`${o.host}  ·  #OKMovement  #ObiKwankwaso2027`, W / 2, footerY);
}

export default function PledgeCardMaker() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [logo, setLogo] = useState<HTMLImageElement | null>(null);
  const [fontFamily, setFontFamily] = useState('"Helvetica Neue", Arial, sans-serif');
  const [format, setFormat] = useState<Format>("square");
  const [style, setStyle] = useState<PledgeStyle>("bring");
  const [count, setCount] = useState<number>(20);
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [canShareFiles, setCanShareFiles] = useState(false);

  const host = new URL(siteConfig.url).host;

  useEffect(() => {
    let alive = true;
    loadImage(LOGO_SRC)
      .then((img) => alive && setLogo(img))
      .catch(() => undefined);
    resolveDisplayFont().then((family) => alive && setFontFamily(family));
    setCanShareFiles(canShareImageFiles());
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    canvas.height = HEIGHTS[format];
    drawCard(ctx, { format, style, count, name, state, logo, fontFamily, host });
  }, [format, style, count, name, state, logo, fontFamily, host]);

  const filename = `ok-movement-pledge-${format}.png`;
  const ready = name.trim().length > 0;

  const caption =
    style === "bring"
      ? `I'm bringing ${count} voters to the OK Movement. Who's joining me? ${HASHTAG_LINE}`
      : style === "in"
        ? `I'm in. Are you? Join me in the OK Movement for Obi–Kwankwaso 2027. ${HASHTAG_LINE}`
        : `Nigeria will be OK, and it starts with us. I'm standing with the OK Movement. ${HASHTAG_LINE}`;

  const getBlob = async () => (canvasRef.current ? canvasToBlob(canvasRef.current) : null);

  const download = async () => {
    if (!ready) {
      setStatus("Type your name first so your card is yours.");
      return;
    }
    setBusy(true);
    try {
      const blob = await getBlob();
      if (blob) {
        saveBlob(blob, filename);
        setStatus("Card saved. Post it, tag a friend, and ask them to make theirs. 🎉");
      }
    } finally {
      setBusy(false);
    }
  };

  const share = async () => {
    if (!ready) {
      setStatus("Type your name first so your card is yours.");
      return;
    }
    setBusy(true);
    try {
      const blob = await getBlob();
      if (!blob) return;
      const result = await shareImage(blob, filename, caption);
      if (result === "unsupported") {
        saveBlob(blob, filename);
        setStatus("Your browser can't share pictures directly, so we saved it. Post it from your gallery.");
      } else if (result === "shared") {
        setStatus("Shared. Thank you for spreading the word!");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start lg:gap-12">
      <div className="mx-auto w-full" style={{ maxWidth: format === "story" ? "17rem" : "26rem" }}>
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHTS[format]}
          role="img"
          aria-label={`Preview of your pledge card${name.trim() ? ` for ${name.trim()}` : ""}`}
          className="block h-auto w-full rounded-xl shadow-4"
        />
      </div>

      <div className="space-y-7">
        <div>
          <h3 className="font-display text-2xl font-extrabold tracking-tight text-ink">
            Make it public.
          </h3>
          <p className="mt-2 max-w-[52ch] text-body">
            A pledge you post is a pledge you keep. Make your card, drop it on your status, and
            dare three friends to do the same.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="pledge-name"
              className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted"
            >
              Your name
            </label>
            <input
              id="pledge-name"
              type="text"
              value={name}
              maxLength={28}
              autoComplete="name"
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Amina Bello"
              className="mt-3 block min-h-12 w-full rounded-lg border border-rule-strong bg-paper-raised px-4 text-sm text-ink placeholder:text-faint focus:border-green-deep"
            />
          </div>
          <div>
            <label
              htmlFor="pledge-state"
              className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted"
            >
              Your state
            </label>
            <select
              id="pledge-state"
              value={state}
              onChange={(event) => setState(event.target.value)}
              className="mt-3 block min-h-12 w-full rounded-lg border border-rule-strong bg-paper-raised px-4 text-sm text-ink focus:border-green-deep"
            >
              <option value="">Choose your state</option>
              {nigerianStates.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
              <option value={DIASPORA}>{DIASPORA}</option>
            </select>
          </div>
        </div>

        <fieldset>
          <legend className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted">
            What does your card say?
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {PLEDGE_STYLES.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={style === item.id}
                onClick={() => setStyle(item.id)}
                className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${
                  style === item.id
                    ? "border-green-deep bg-green-deep text-white"
                    : "border-rule-strong bg-paper-raised text-ink hover:border-green-deep"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>

        {style === "bring" ? (
          <fieldset>
            <legend className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted">
              How many voters are you bringing?
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {PLEDGE_COUNTS.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={count === value}
                  onClick={() => setCount(value)}
                  className={`min-h-11 min-w-14 rounded-full border px-4 font-display text-base font-extrabold transition duration-200 hover:-translate-y-0.5 ${
                    count === value
                      ? "border-brand-red bg-brand-red text-white"
                      : "border-rule-strong bg-paper-raised text-ink hover:border-brand-red"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        <fieldset>
          <legend className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted">
            Where will you post it?
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                { id: "square", label: "Feed / DP (square)" },
                { id: "story", label: "WhatsApp status / Story (tall)" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={format === item.id}
                onClick={() => setFormat(item.id)}
                className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${
                  format === item.id
                    ? "border-green-deep bg-green-deep text-white"
                    : "border-rule-strong bg-paper-raised text-ink hover:border-green-deep"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={download}
            disabled={busy}
            className="inline-flex min-h-12 items-center gap-2 rounded-md bg-green-deep px-6 text-sm font-semibold text-white shadow-green transition hover:-translate-y-0.5 hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download aria-hidden="true" className="h-4 w-4" />
            Download card
          </button>
          {canShareFiles ? (
            <button
              type="button"
              onClick={share}
              disabled={busy}
              className="inline-flex min-h-12 items-center gap-2 rounded-md bg-brand-red px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Share2 aria-hidden="true" className="h-4 w-4" />
              Share it
            </button>
          ) : null}
        </div>

        <p aria-live="polite" className="min-h-[1.5rem] text-sm font-medium text-green-deep">
          {status}
        </p>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted">
            Post the words too
          </p>
          <p className="mt-2 max-w-[56ch] text-sm text-body">{caption}</p>
          <div className="mt-3">
            <ShareButtons text={caption} />
          </div>
        </div>
      </div>
    </div>
  );
}
