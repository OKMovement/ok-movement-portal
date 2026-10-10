/**
 * Small canvas toolkit shared by the DP maker and the pledge-card maker.
 * Everything runs in the browser — no photo is ever uploaded anywhere.
 */

export const BRAND = {
  green: "#00a651",
  greenDeep: "#00663a",
  red: "#e02828",
  ink: "#0b100c",
  paper: "#ffffff",
  paperSunk: "#fafaf7",
  greenLift: "#e7f2e9",
  sun: "#f7c968",
} as const;

export const LOGO_SRC = "/images/new-logo.png";

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load ${src}`));
    img.src = src;
  });
}

/** Reads a user-picked file into an image. `revoke` frees the temporary object URL. */
export async function loadFileImage(
  file: File,
): Promise<{ img: HTMLImageElement; revoke: () => void }> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    return { img, revoke: () => URL.revokeObjectURL(url) };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}

let cachedDisplayFont: string | null = null;

/**
 * Resolves the site's display typeface (Archivo via next/font, whose family name
 * is hashed) so canvas text matches the page. Falls back to a system stack.
 */
export async function resolveDisplayFont(): Promise<string> {
  if (cachedDisplayFont) return cachedDisplayFont;
  let family = '"Helvetica Neue", Arial, sans-serif';
  try {
    const probe = document.createElement("span");
    probe.className = "font-display";
    probe.textContent = "OK";
    probe.style.cssText = "position:absolute;visibility:hidden;font-weight:800";
    document.body.appendChild(probe);
    const computed = getComputedStyle(probe).fontFamily;
    probe.remove();
    if (computed) family = computed;
    await document.fonts.load(`800 64px ${family}`);
  } catch {
    // Canvas text still renders with the fallback stack.
  }
  cachedDisplayFont = family;
  return family;
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not export image"))),
      "image/png",
    );
  });
}

export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** True when this browser can hand an image *file* to the system share sheet. */
export function canShareImageFiles(): boolean {
  if (typeof navigator === "undefined" || typeof navigator.canShare !== "function") return false;
  try {
    const probe = new File([""], "probe.png", { type: "image/png" });
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

export type NativeShareResult = "shared" | "cancelled" | "unsupported";

/** Opens the phone's share sheet with the image attached, where the browser allows it. */
export async function shareImage(
  blob: Blob,
  filename: string,
  text: string,
): Promise<NativeShareResult> {
  const file = new File([blob], filename, { type: "image/png" });
  const data: ShareData = { files: [file], text };
  if (typeof navigator === "undefined" || !navigator.canShare?.(data)) return "unsupported";
  try {
    await navigator.share(data);
    return "shared";
  } catch (error) {
    return error instanceof DOMException && error.name === "AbortError"
      ? "cancelled"
      : "unsupported";
  }
}

/** Shrinks the font until `text` fits `maxWidth`, then returns the size used. */
export function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  weight: number,
  family: string,
  startSize: number,
  maxWidth: number,
  minSize = 18,
): number {
  let size = startSize;
  while (size > minSize) {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  ctx.font = `${weight} ${size}px ${family}`;
  return size;
}

export function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/** Three equal arcs — green, ink, red — the campaign's tricolour as a ring. */
export function drawTricolorRing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  width: number,
): void {
  const colors = [BRAND.green, BRAND.ink, BRAND.red];
  const third = (Math.PI * 2) / 3;
  const start = -Math.PI / 2 - Math.PI / 3;
  ctx.save();
  ctx.lineWidth = width;
  ctx.lineCap = "butt";
  colors.forEach((color, i) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.arc(cx, cy, radius, start + i * third, start + (i + 1) * third);
    ctx.stroke();
  });
  ctx.restore();
}

/** Round logo badge: white disc, hairline ring, logo inset. */
export function drawLogoBadge(
  ctx: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  cx: number,
  cy: number,
  radius: number,
): void {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = BRAND.paper;
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = radius * 0.28;
  ctx.shadowOffsetY = radius * 0.08;
  ctx.fill();
  ctx.restore();

  if (logo) {
    const inset = radius * 0.1;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius - inset, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(
      logo,
      cx - radius + inset,
      cy - radius + inset,
      (radius - inset) * 2,
      (radius - inset) * 2,
    );
    ctx.restore();
  }
}
