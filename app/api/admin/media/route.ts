import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { MediaItemModel } from "@/lib/models/media-item";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";

type MediaKind = "image" | "news" | "video";

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
  isPublished: boolean;
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
    isPublished: item.isPublished,
    createdAt: item.createdAt ?? null,
    updatedAt: item.updatedAt ?? null,
  };
}

export async function GET(request: NextRequest) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const media = await MediaItemModel.find({})
    .sort({ createdAt: -1 })
    .select("_id kind title imageUrl category description excerpt location linkUrl duration publishedAt isPublished createdAt updatedAt")
    .lean();

  return NextResponse.json({
    media: media.map((item) => toResponseItem(item)),
  });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    kind?: MediaKind;
    title?: string;
    imageUrl?: string;
    category?: string;
    description?: string;
    excerpt?: string;
    location?: string;
    linkUrl?: string;
    duration?: string;
    publishedAt?: string;
    isPublished?: boolean;
  };

  const kind = body.kind;
  const title = body.title?.trim() ?? "";
  const imageUrl = body.imageUrl?.trim() ?? "";

  if (!kind || !["image", "news", "video"].includes(kind)) {
    return NextResponse.json({ error: "Invalid media type." }, { status: 400 });
  }

  if (!title || !imageUrl) {
    return NextResponse.json({ error: "Title and image URL are required." }, { status: 400 });
  }

  await connectToDatabase();

  const created = await MediaItemModel.create({
    kind,
    title,
    imageUrl,
    category: body.category?.trim() || undefined,
    description: body.description?.trim() || undefined,
    excerpt: body.excerpt?.trim() || undefined,
    location: body.location?.trim() || undefined,
    linkUrl: body.linkUrl?.trim() || undefined,
    duration: body.duration?.trim() || undefined,
    publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
    isPublished: body.isPublished ?? true,
    createdBy: admin.id,
  });

  return NextResponse.json({ ok: true, media: toResponseItem(created.toObject()) });
}
