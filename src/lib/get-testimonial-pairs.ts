import { readdirSync } from "node:fs";
import path from "node:path";

export type TestimonialPair = {
  id: string;
  frontSrc: string;
  backSrc: string;
  alt: string;
};

/** Filenames that produce misleading or misspelled labels when derived. */
const ALT_OVERRIDES: Record<string, string> = {
  "on-hope": "hope",
  "on-youth": "young Nigerians",
  inevitatable: "why change is inevitable",
  "rabiu-dias": "the diaspora",
  "rabiu-on-poor": "poverty",
  "rabiu-ballot": "the ballot",
  "rabiu-children": "children and education",
  "rabiu-hope": "hope",
  type: "the leaders Nigeria needs",
  collective: "collective action",
  fight: "the fight ahead",
};

/**
 * These cards are quote graphics, so the topic is all the alt text can honestly
 * convey — the quote itself lives in the image and is not machine-readable.
 */
function formatAltFromId(id: string) {
  const topic =
    ALT_OVERRIDES[id] ??
    id
      .replace(/^(on|rabiu)-/, "")
      .split("-")
      .join(" ");
  return `Quote card: the OK Movement principals on ${topic}`;
}

export function getTestimonialPairs(): TestimonialPair[] {
  const answersDirectory = path.join(process.cwd(), "public", "answers");
  const answerFiles = readdirSync(answersDirectory);
  const pairMap = new Map<string, { frontSrc?: string; backSrc?: string }>();

  for (const fileName of answerFiles) {
    const match = fileName.match(/^(.+)-([12])\.(png|jpe?g|webp|avif)$/i);
    if (!match) {
      continue;
    }

    const [, id, side] = match;
    const pair = pairMap.get(id!) ?? {};
    const filePath = `/answers/${fileName}`;

    if (side === "1") {
      pair.frontSrc = filePath;
    } else {
      pair.backSrc = filePath;
    }

    pairMap.set(id!, pair);
  }

  return Array.from(pairMap.entries())
    .map(([id, pair]) => {
      if (!pair.frontSrc || !pair.backSrc) {
        return null;
      }

      return {
        id,
        frontSrc: pair.frontSrc,
        backSrc: pair.backSrc,
        alt: formatAltFromId(id),
      } satisfies TestimonialPair;
    })
    .filter((pair): pair is TestimonialPair => pair !== null)
    .sort((a, b) => a.id.localeCompare(b.id));
}
