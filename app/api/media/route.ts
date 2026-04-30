import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { MediaItemModel } from "@/lib/models/media-item";

type MediaKind = "image" | "news" | "video";

function isMediaKind(value: string): value is MediaKind {
  return value === "image" || value === "news" || value === "video";
}

function toResponseItem(item: {
  _id: unknown;
  kind: MediaKind;
  title: string;
  imageUrl: string;
  category?: string | null;
  description?: string | null;
  excerpt?: string | null;
  location?: string | null;
  linkUrl?: string | null;
  duration?: string | null;
  publishedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: String(item._id),
    kind: item.kind,
    title: item.title,
    imageUrl: item.imageUrl,
    category: item.category ?? "",
    description: item.description ?? "",
    excerpt: item.excerpt ?? "",
    location: item.location ?? "",
    linkUrl: item.linkUrl ?? "",
    duration: item.duration ?? "",
    publishedAt: item.publishedAt ?? null,
    createdAt: item.createdAt ?? null,
    updatedAt: item.updatedAt ?? null,
  };
}

export async function GET(request: NextRequest) {
  await connectToDatabase();

  const kindQuery = request.nextUrl.searchParams.get("kind")?.trim() ?? "";
  const query = isMediaKind(kindQuery)
    ? { isPublished: true, kind: kindQuery }
    : { isPublished: true };

  const media = await MediaItemModel.find(query)
    .sort({ publishedAt: -1, createdAt: -1 })
    .select(
      "_id kind title imageUrl category description excerpt location linkUrl duration publishedAt createdAt updatedAt",
    )
    .lean();

  return NextResponse.json({
    media: media.map((item) => toResponseItem(item)),
  });
}
