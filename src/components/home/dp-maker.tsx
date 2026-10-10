"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Camera,
  Check,
  ChevronDown,
  Download,
  ImagePlus,
  RotateCcw,
  Share2,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import Confetti from "./confetti";
import ShareButtons from "./share-buttons";
import {
  BRAND,
  LOGO_SRC,
  canShareImageFiles,
  canvasToBlob,
  drawLogoBadge,
  drawTricolorRing,
  fitFont,
  loadFileImage,
  loadImage,
  resolveDisplayFont,
  roundRectPath,
  saveBlob,
  shareImage,
} from "./share-canvas";
import { HASHTAG_LINE } from "./share-data";

const SIZE = 1080;
const CENTER = SIZE / 2;
const PHOTO_RADIUS = 496;
const RING_WIDTH = 44;
const FILENAME = "ok-movement-dp.png";

type FrameStyle = "bold" | "banner" | "ring";
type ThemeId = "green" | "red" | "ink" | "sun";
type MessageId = "ok" | "voting" | "pvc" | "bring20" | "nigeria";

type Theme = {
  label: string;
  solid: string;
  gradMid: string;
  gradEnd: string;
  text: string;
  accent: string;
};

const THEMES: Record<ThemeId, Theme> = {
  green: {
    label: "Green",
    solid: BRAND.greenDeep,
    gradMid: "rgba(0,102,58,0.82)",
    gradEnd: "rgba(0,76,43,0.96)",
    text: "#ffffff",
    accent: BRAND.sun,
  },
  red: {
    label: "Red",
    solid: BRAND.red,
    gradMid: "rgba(224,40,40,0.82)",
    gradEnd: "rgba(160,20,20,0.96)",
    text: "#ffffff",
    accent: BRAND.sun,
  },
  ink: {
    label: "Black",
    solid: BRAND.ink,
    gradMid: "rgba(11,16,12,0.8)",
    gradEnd: "rgba(11,16,12,0.96)",
    text: "#ffffff",
    accent: BRAND.sun,
  },
  sun: {
    label: "Yellow",
    solid: BRAND.sun,
    gradMid: "rgba(247,201,104,0.88)",
    gradEnd: "rgba(247,201,104,0.97)",
    text: BRAND.ink,
    accent: BRAND.greenDeep,
  },
};

const FRAMES: readonly { id: FrameStyle; label: string }[] = [
  { id: "bold", label: "Big words" },
  { id: "banner", label: "Name banner" },
  { id: "ring", label: "Just the ring" },
];

const MESSAGES: readonly { id: MessageId; label: string; caption: string }[] = [
  { id: "ok", label: "I'M OK", caption: "I'm OK, and Nigeria will be too." },
  { id: "voting", label: "I'M VOTING", caption: "I'm voting on January 16." },
  { id: "pvc", label: "PVC READY", caption: "My PVC is sorted." },
  { id: "bring20", label: "BRING 20", caption: "I'm bringing 20 people with me." },
  { id: "nigeria", label: "NIGERIA WILL BE OK", caption: "Nigeria will be OK." },
];

type Placement = { zoom: number; x: number; y: number };
const DEFAULT_PLACEMENT: Placement = { zoom: 1, x: 0, y: 0 };

type DrawOptions = {
  photo: HTMLImageElement | null;
  logo: HTMLImageElement | null;
  placement: Placement;
  frame: FrameStyle;
  theme: ThemeId;
  message: string;
  caption: string;
  fontFamily: string;
};

/** Largest offset that still keeps the photo covering the circle. */
function maxOffset(photo: HTMLImageElement, zoom: number) {
  const diameter = PHOTO_RADIUS * 2;
  const scale = Math.max(diameter / photo.width, diameter / photo.height) * zoom;
  return {
    x: Math.max(0, (photo.width * scale - diameter) / 2),
    y: Math.max(0, (photo.height * scale - diameter) / 2),
    scale,
  };
}

function drawDp(ctx: CanvasRenderingContext2D, o: DrawOptions): void {
  const theme = THEMES[o.theme];
  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = BRAND.paper;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Photo (or the placeholder disc) clipped to the inner circle.
  ctx.save();
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, PHOTO_RADIUS, 0, Math.PI * 2);
  ctx.clip();

  if (o.photo) {
    const limit = maxOffset(o.photo, o.placement.zoom);
    const ox = Math.max(-limit.x, Math.min(limit.x, o.placement.x));
    const oy = Math.max(-limit.y, Math.min(limit.y, o.placement.y));
    const w = o.photo.width * limit.scale;
    const h = o.photo.height * limit.scale;
    ctx.drawImage(o.photo, CENTER - w / 2 + ox, CENTER - h / 2 + oy, w, h);
  } else {
    ctx.fillStyle = BRAND.greenLift;
    ctx.fillRect(0, 0, SIZE, SIZE);
    // A simple silhouette so the empty state reads as "your photo goes here".
    ctx.fillStyle = "rgba(0,102,58,0.22)";
    ctx.beginPath();
    ctx.arc(CENTER, CENTER - 70, 150, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(CENTER, CENTER + 330, 300, 280, 0, Math.PI, Math.PI * 2);
    ctx.fill();
  }

  if (o.frame === "bold") {
    const gradient = ctx.createLinearGradient(0, SIZE * 0.5, 0, SIZE);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(0.5, theme.gradMid);
    gradient.addColorStop(1, theme.gradEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, SIZE * 0.5, SIZE, SIZE * 0.5);
  }
  ctx.restore();

  drawTricolorRing(ctx, CENTER, CENTER, PHOTO_RADIUS + RING_WIDTH / 2, RING_WIDTH);

  // Logo badge sits on the ring at the top right, fully inside the circular crop
  // that WhatsApp / X / Instagram apply to profile pictures.
  const badgeAngle = -Math.PI / 4;
  const badgeDistance = 455;
  drawLogoBadge(
    ctx,
    o.logo,
    CENTER + Math.cos(badgeAngle) * badgeDistance,
    CENTER + Math.sin(badgeAngle) * badgeDistance,
    78,
  );

  const caption = o.caption.trim();
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  if (o.frame === "bold") {
    const headline = `${o.message}.`;
    ctx.fillStyle = theme.text;
    fitFont(ctx, headline, 800, o.fontFamily, 150, 600, 40);
    ctx.fillText(headline, CENTER, caption ? 866 : 905);
    if (caption) {
      ctx.fillStyle = theme.accent;
      fitFont(ctx, caption, 700, o.fontFamily, 40, 520, 22);
      ctx.fillText(caption, CENTER, 930);
    } else {
      ctx.fillStyle = o.theme === "sun" ? "rgba(11,16,12,0.75)" : "rgba(255,255,255,0.85)";
      ctx.font = `700 30px ${o.fontFamily}`;
      ctx.fillText("OBI · KWANKWASO · 2027", CENTER, 955);
    }
  } else if (o.frame === "banner") {
    const w = 600;
    const h = caption ? 132 : 100;
    const x = CENTER - w / 2;
    const y = caption ? 852 : 874;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 10;
    roundRectPath(ctx, x, y, w, h, h / 2.4);
    ctx.fillStyle = theme.solid;
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = theme.text;
    fitFont(ctx, o.message, 800, o.fontFamily, 64, w - 80, 26);
    ctx.fillText(o.message, CENTER, caption ? y + 64 : y + 68);
    if (caption) {
      ctx.fillStyle = theme.accent;
      fitFont(ctx, caption, 700, o.fontFamily, 32, w - 90, 20);
      ctx.fillText(caption, CENTER, y + 108);
    }
  }
}

export default function DpMaker() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const selfieRef = useRef<HTMLInputElement | null>(null);
  const revokeRef = useRef<(() => void) | null>(null);
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [logo, setLogo] = useState<HTMLImageElement | null>(null);
  const [fontFamily, setFontFamily] = useState('"Helvetica Neue", Arial, sans-serif');
  const [placement, setPlacement] = useState<Placement>(DEFAULT_PLACEMENT);
  const [frame, setFrame] = useState<FrameStyle>("bold");
  const [theme, setTheme] = useState<ThemeId>("green");
  const [messageId, setMessageId] = useState<MessageId>("ok");
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [canShareFiles, setCanShareFiles] = useState(false);
  const [saved, setSaved] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const message = MESSAGES.find((item) => item.id === messageId) ?? MESSAGES[0]!;

  useEffect(() => {
    let alive = true;
    loadImage(LOGO_SRC)
      .then((img) => alive && setLogo(img))
      .catch(() => undefined);
    resolveDisplayFont().then((family) => alive && setFontFamily(family));
    setCanShareFiles(canShareImageFiles());
    return () => {
      alive = false;
      revokeRef.current?.();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    drawDp(ctx, {
      photo,
      logo,
      placement,
      frame,
      theme,
      message: message.label,
      caption,
      fontFamily,
    });
  }, [photo, logo, placement, frame, theme, message.label, caption, fontFamily]);

  useEffect(() => {
    if (!celebrate) return;
    const id = window.setTimeout(() => setCelebrate(false), 4200);
    return () => window.clearTimeout(id);
  }, [celebrate]);

  const acceptFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus("That is not a picture. Please choose a photo.");
      return;
    }
    try {
      const loaded = await loadFileImage(file);
      revokeRef.current?.();
      revokeRef.current = loaded.revoke;
      setPhoto(loaded.img);
      setPlacement(DEFAULT_PLACEMENT);
      setSaved(false);
      setStatus("");
    } catch {
      setStatus("We could not open that photo. Please try another one.");
    }
  }, []);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    void acceptFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    void acceptFile(event.dataTransfer.files?.[0]);
  };

  const clampPlacement = useCallback(
    (next: Placement): Placement => {
      if (!photo) return next;
      const limit = maxOffset(photo, next.zoom);
      return {
        zoom: next.zoom,
        x: Math.max(-limit.x, Math.min(limit.x, next.x)),
        y: Math.max(-limit.y, Math.min(limit.y, next.y)),
      };
    },
    [photo],
  );

  // Dragging the preview pans the photo. Offsets are stored in 1080-space.
  const onPointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!photo) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY, px: placement.x, py: placement.y };
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const start = dragRef.current;
    if (!start || !photo) return;
    const ratio = SIZE / event.currentTarget.getBoundingClientRect().width;
    setPlacement((current) =>
      clampPlacement({
        ...current,
        x: start.px + (event.clientX - start.x) * ratio,
        y: start.py + (event.clientY - start.y) * ratio,
      }),
    );
  };
  const endDrag = () => {
    dragRef.current = null;
  };

  const nudge = (dx: number, dy: number) =>
    setPlacement((current) => clampPlacement({ ...current, x: current.x + dx, y: current.y + dy }));

  const setZoom = (zoom: number) =>
    setPlacement((current) => clampPlacement({ ...current, zoom: Math.max(1, Math.min(3, zoom)) }));

  // Keyboard users can nudge the photo and zoom without a pointer.
  const onCanvasKeyDown = (event: ReactKeyboardEvent<HTMLCanvasElement>) => {
    if (!photo) return;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-30, 0],
      ArrowRight: [30, 0],
      ArrowUp: [0, -30],
      ArrowDown: [0, 30],
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      nudge(move[0], move[1]);
    } else if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      setZoom(placement.zoom + 0.1);
    } else if (event.key === "-") {
      event.preventDefault();
      setZoom(placement.zoom - 0.1);
    }
  };

  const finish = () => {
    setSaved(true);
    setCelebrate(true);
  };

  const download = async () => {
    const canvas = canvasRef.current;
    if (!photo || !canvas) return;
    setBusy(true);
    try {
      saveBlob(await canvasToBlob(canvas), FILENAME);
      finish();
    } finally {
      setBusy(false);
    }
  };

  const share = async () => {
    const canvas = canvasRef.current;
    if (!photo || !canvas) return;
    setBusy(true);
    try {
      const blob = await canvasToBlob(canvas);
      const result = await shareImage(
        blob,
        FILENAME,
        `${message.caption} Make your DP and join me. ${HASHTAG_LINE}`,
      );
      if (result === "unsupported") {
        saveBlob(blob, FILENAME);
        finish();
      } else if (result === "shared") {
        finish();
      }
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    revokeRef.current?.();
    revokeRef.current = null;
    setPhoto(null);
    setPlacement(DEFAULT_PLACEMENT);
    setCaption("");
    setSaved(false);
    setStatus("");
  };

  const postText = `${message.caption} Make your DP and join me. ${HASHTAG_LINE}`;

  return (
    <div className="sticker-lg overflow-hidden rounded-3xl bg-white text-body">
      {celebrate ? <Confetti /> : null}

      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="sr-only"
        aria-label="Choose a photo for your profile picture"
      />
      <input
        ref={selfieRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={onFileChange}
        className="sr-only"
        aria-label="Take a selfie for your profile picture"
      />

      <div className="grid lg:grid-cols-[minmax(0,27rem)_minmax(0,1fr)]">
        {/* Picture */}
        <div className="relative border-b-2 border-ink bg-[#f7c968] p-5 sm:p-8 lg:border-b-0 lg:border-r-2">
          <div
            aria-hidden="true"
            className="dot-grid pointer-events-none absolute inset-0 opacity-70"
          />
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`sticker-lg relative mx-auto aspect-square w-full max-w-[16rem] overflow-hidden rounded-full bg-white transition sm:max-w-[22rem] ${
              dragOver ? "scale-[1.02] !border-brand-red" : ""
            }`}
          >
            <canvas
              ref={canvasRef}
              width={SIZE}
              height={SIZE}
              role="img"
              tabIndex={photo ? 0 : -1}
              aria-label={
                photo
                  ? "Your profile picture. Drag it to move your photo. Use the arrow keys to move it and plus or minus to resize."
                  : "Preview of your profile picture. Choose a photo to see it here."
              }
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onKeyDown={onCanvasKeyDown}
              className={`relative block h-full w-full touch-pan-y ${
                photo ? "cursor-grab active:cursor-grabbing" : ""
              }`}
            />
            {!photo ? (
              <button
                type="button"
                onClick={() => uploadRef.current?.click()}
                aria-label="Choose your photo"
                className="absolute inset-0 flex items-center justify-center rounded-full bg-white/40 transition hover:bg-white/20"
              >
                <span className="sticker flex h-20 w-20 items-center justify-center rounded-full bg-brand-green text-ink">
                  <ImagePlus aria-hidden="true" className="h-9 w-9" />
                </span>
              </button>
            ) : null}
          </div>
        </div>

        {/* What to do */}
        <div className="flex flex-col justify-center gap-6 p-6 sm:p-9 lg:p-12">
          {!photo ? (
            <>
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-red">
                  Step 1 of 2
                </p>
                <h3 className="mt-2 font-display text-3xl font-extrabold uppercase leading-[1] tracking-tight text-ink sm:text-4xl">
                  Make your profile picture
                </h3>
                <p className="mt-3 max-w-[40ch] text-lg font-medium leading-relaxed text-body">
                  Choose a photo of yourself. We put the OK Movement frame on it. It takes less
                  than one minute.
                </p>
              </div>

              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={() => uploadRef.current?.click()}
                  className="sticker sticker-press inline-flex min-h-[4.5rem] items-center justify-center gap-3 rounded-xl bg-brand-green px-6 text-lg font-extrabold uppercase tracking-[0.06em] text-ink"
                >
                  <ImagePlus aria-hidden="true" className="h-7 w-7" />
                  Choose your photo
                </button>
                <button
                  type="button"
                  onClick={() => selfieRef.current?.click()}
                  className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-xl border-2 border-ink bg-white px-6 text-base font-bold text-ink transition hover:bg-ink hover:text-white"
                >
                  <Camera aria-hidden="true" className="h-5 w-5" />
                  Or take a selfie now
                </button>
              </div>

              <p className="text-sm font-medium text-muted">
                🔒 Your photo stays on your phone or computer. Nobody else can see it.
              </p>

              <p aria-live="polite" className="min-h-[1.5rem] text-base font-bold text-brand-red">
                {status}
              </p>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="dp-caption" className="text-base font-bold text-ink">
                  Your name on the picture{" "}
                  <span className="font-medium text-muted">(you can skip this)</span>
                </label>
                <input
                  id="dp-caption"
                  type="text"
                  value={caption}
                  maxLength={26}
                  onChange={(event) => setCaption(event.target.value)}
                  placeholder="Type your name or state"
                  autoComplete="name"
                  className="mt-2 block min-h-14 w-full rounded-xl border-2 border-ink bg-white px-4 text-lg font-medium text-ink placeholder:text-faint focus:border-green-deep"
                />
              </div>

              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={download}
                  disabled={busy}
                  className="sticker sticker-press inline-flex min-h-[4.5rem] items-center justify-center gap-3 rounded-xl bg-brand-green px-6 text-lg font-extrabold uppercase tracking-[0.06em] text-ink disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Download aria-hidden="true" className="h-7 w-7" />
                  Save my picture
                </button>
                {canShareFiles ? (
                  <button
                    type="button"
                    onClick={share}
                    disabled={busy}
                    className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-xl border-2 border-ink bg-white px-6 text-base font-bold text-ink transition hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Share2 aria-hidden="true" className="h-5 w-5" />
                    Send it to my friends
                  </button>
                ) : null}
              </div>

              {saved ? (
                <section
                  aria-live="polite"
                  className="sticker rounded-2xl bg-[#f7c968] p-5 text-ink sm:p-6"
                >
                  <h4 className="font-display text-2xl font-extrabold uppercase tracking-tight">
                    Done! It is saved. 🎉
                  </h4>
                  <p className="mt-2 text-base font-medium">
                    Now open WhatsApp, change your profile photo and choose this picture. Then tell
                    your friends to make theirs.
                  </p>
                  <div className="mt-4">
                    <ShareButtons text={postText} size="md" />
                  </div>
                </section>
              ) : null}

              {/* Everything below is optional. */}
              <details className="group rounded-2xl border-2 border-ink/15 bg-paper-sunk">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 text-base font-bold text-ink [&::-webkit-details-marker]:hidden">
                  Face not in the middle? Fix your picture
                  <ChevronDown
                    aria-hidden="true"
                    className="h-5 w-5 transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <div className="space-y-5 border-t-2 border-ink/10 p-5">

                <div>
                  <label htmlFor="dp-zoom" className="text-base font-bold text-ink">
                    Make your face bigger or smaller
                  </label>
                  <input
                    id="dp-zoom"
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={placement.zoom}
                    onChange={(event) => setZoom(Number(event.target.value))}
                    className="mt-2 block w-full accent-[#00663a]"
                  />
                  <div className="mt-1 flex justify-between text-xs font-semibold text-muted">
                    <span>Smaller</span>
                    <span>Bigger</span>
                  </div>
                </div>

                <div role="group" aria-label="Move your photo" className="flex items-center gap-2">
                  <span className="mr-1 text-base font-bold text-ink">Move it:</span>
                  {(
                    [
                      { label: "Move left", Icon: ArrowLeft, dx: -40, dy: 0 },
                      { label: "Move up", Icon: ArrowUp, dx: 0, dy: -40 },
                      { label: "Move down", Icon: ArrowDown, dx: 0, dy: 40 },
                      { label: "Move right", Icon: ArrowRight, dx: 40, dy: 0 },
                    ] as const
                  ).map(({ label, Icon, dx, dy }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => nudge(dx, dy)}
                      aria-label={label}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-lg border-2 border-ink bg-white text-ink transition hover:bg-ink hover:text-white active:scale-95"
                    >
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </button>
                  ))}
                </div>

                <div className="space-y-4 border-t-2 border-ink/10 pt-5">
                  <p className="text-base font-bold text-ink">Change the look</p>
                    <div>
                      <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-muted">
                        Style
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {FRAMES.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            aria-pressed={frame === item.id}
                            onClick={() => setFrame(item.id)}
                            className={`min-h-11 rounded-full border-2 px-4 text-sm font-extrabold uppercase tracking-[0.06em] transition duration-200 ${
                              frame === item.id
                                ? "border-ink bg-ink text-white"
                                : "border-rule-strong bg-white text-ink hover:border-ink"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-muted">
                        Colour
                      </p>
                      <div className="mt-2 flex flex-wrap gap-3">
                        {(Object.keys(THEMES) as ThemeId[]).map((id) => {
                          const active = theme === id;
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setTheme(id)}
                              aria-pressed={active}
                              aria-label={`${THEMES[id].label} colour`}
                              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink transition duration-200 hover:-translate-y-0.5 ${
                                active ? "shadow-[3px_3px_0_0_#0b100c]" : ""
                              }`}
                              style={{ background: THEMES[id].solid }}
                            >
                              {active ? (
                                <Check
                                  aria-hidden="true"
                                  className={`h-5 w-5 ${id === "sun" ? "text-ink" : "text-white"}`}
                                />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-muted">
                        Words
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {MESSAGES.map((item) => {
                          const active = messageId === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              aria-pressed={active}
                              onClick={() => setMessageId(item.id)}
                              className={`min-h-11 rounded-full border-2 px-4 text-sm font-extrabold uppercase tracking-[0.06em] transition duration-200 ${
                                active
                                  ? "border-ink bg-ink text-white"
                                  : "border-rule-strong bg-white text-ink hover:border-ink"
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </details>

              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-12 w-fit items-center gap-2 rounded-lg px-1 text-base font-bold text-muted transition hover:text-ink"
              >
                <RotateCcw aria-hidden="true" className="h-4 w-4" />
                Use a different photo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
