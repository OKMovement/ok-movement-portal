import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { MediaItemModel } from "@/lib/models/media-item";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";

type MediaKind = "image" | "news" | "video";

type Params = {
  params: Promise<{ id: string }>;
};

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

export async function PATCH(request: NextRequest, { params }: Params) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
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

  await connectToDatabase();

  const item = await MediaItemModel.findById(id);
  if (!item) {
    return NextResponse.json({ error: "Media item not found." }, { status: 404 });
  }

  if (typeof body.kind === "string" && ["image", "news", "video"].includes(body.kind)) {
    item.kind = body.kind;
  }
  if (typeof body.title === "string") item.title = body.title.trim();
  if (typeof body.imageUrl === "string") item.imageUrl = body.imageUrl.trim();
  if (typeof body.category === "string") item.category = body.category.trim() || undefined;
  if (typeof body.description === "string") item.description = body.description.trim() || undefined;
  if (typeof body.excerpt === "string") item.excerpt = body.excerpt.trim() || undefined;
  if (typeof body.location === "string") item.location = body.location.trim() || undefined;
  if (typeof body.linkUrl === "string") item.linkUrl = body.linkUrl.trim() || undefined;
  if (typeof body.duration === "string") item.duration = body.duration.trim() || undefined;
  if (typeof body.isPublished === "boolean") item.isPublished = body.isPublished;
  if (typeof body.publishedAt === "string") {
    item.publishedAt = body.publishedAt ? new Date(body.publishedAt) : undefined;
  }

  if (!item.title || !item.imageUrl) {
    return NextResponse.json({ error: "Title and image URL are required." }, { status: 400 });
  }

  await item.save();

  return NextResponse.json({ ok: true, media: toResponseItem(item.toObject()) });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await connectToDatabase();

  const deleted = await MediaItemModel.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: "Media item not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
