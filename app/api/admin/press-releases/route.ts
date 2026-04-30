import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { PressReleaseModel } from "@/lib/models/press-release";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";
import { slugify } from "@/lib/server/slug";

export async function GET(request: NextRequest) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const releases = await PressReleaseModel.find({})
    .sort({ createdAt: -1 })
    .select("_id title slug imageUrl fileUrl excerpt body published publishedAt createdAt updatedAt")
    .lean();

  return NextResponse.json({
    releases: releases.map((release) => ({
      id: String(release._id),
      title: release.title,
      slug: release.slug,
      imageUrl: release.imageUrl ?? "",
      fileUrl: release.fileUrl ?? "",
      excerpt: release.excerpt,
      body: release.body,
      published: release.published,
      publishedAt: release.publishedAt ?? null,
      createdAt: release.createdAt,
      updatedAt: release.updatedAt,
    })),
  });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    imageUrl?: string;
    fileUrl?: string;
    excerpt?: string;
    body?: string;
    published?: boolean;
  };

  const title = body.title?.trim() ?? "";
  const imageUrl = body.imageUrl?.trim() ?? "";
  const fileUrl = body.fileUrl?.trim() ?? "";
  const excerpt = body.excerpt?.trim() ?? "";
  const content = body.body?.trim() ?? "";
  const published = Boolean(body.published);

  if (!title || !excerpt || !content) {
    return NextResponse.json(
      { error: "Title, excerpt and body are required." },
      { status: 400 },
    );
  }

  await connectToDatabase();

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let suffix = 1;

  while (await PressReleaseModel.exists({ slug })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const release = await PressReleaseModel.create({
    title,
    slug,
    imageUrl: imageUrl || undefined,
    fileUrl: fileUrl || undefined,
    excerpt,
    body: content,
    published,
    publishedAt: published ? new Date() : undefined,
    createdBy: admin.id,
  });

  return NextResponse.json({
    ok: true,
    release: {
      id: String(release._id),
      title: release.title,
      slug: release.slug,
      imageUrl: release.imageUrl ?? "",
      fileUrl: release.fileUrl ?? "",
      excerpt: release.excerpt,
      body: release.body,
      published: release.published,
      publishedAt: release.publishedAt ?? null,
      createdAt: release.createdAt,
      updatedAt: release.updatedAt,
    },
  });
}
