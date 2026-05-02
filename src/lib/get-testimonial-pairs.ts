import { readdirSync } from "node:fs";
import path from "node:path";

export type TestimonialPair = {
  id: string;
  frontSrc: string;
  backSrc: string;
  alt: string;
};

function formatAltFromId(id: string) {
  return id
    .split("-")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
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
