import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { PressReleaseModel } from "@/lib/models/press-release";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";
import { slugify } from "@/lib/server/slug";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: Params) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json()) as {
    title?: string;
    imageUrl?: string;
    fileUrl?: string;
    excerpt?: string;
    body?: string;
    published?: boolean;
  };

  await connectToDatabase();

  const release = await PressReleaseModel.findById(id);
  if (!release) {
    return NextResponse.json({ error: "Press release not found." }, { status: 404 });
  }

  if (typeof body.title === "string" && body.title.trim()) {
    const nextTitle = body.title.trim();
    if (nextTitle !== release.title) {
      const baseSlug = slugify(nextTitle);
      let slug = baseSlug;
      let suffix = 1;
      while (await PressReleaseModel.exists({ slug, _id: { $ne: id } })) {
        suffix += 1;
        slug = `${baseSlug}-${suffix}`;
      }
      release.slug = slug;
    }
    release.title = nextTitle;
  }

  if (typeof body.excerpt === "string") {
    release.excerpt = body.excerpt.trim();
  }

  if (typeof body.imageUrl === "string") {
    release.imageUrl = body.imageUrl.trim();
  }

  if (typeof body.fileUrl === "string") {
    release.fileUrl = body.fileUrl.trim() || undefined;
  }

  if (typeof body.body === "string") {
    release.body = body.body.trim();
  }

  if (typeof body.published === "boolean") {
    release.published = body.published;
    release.publishedAt = body.published ? release.publishedAt ?? new Date() : undefined;
  }

  await release.save();

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

export async function DELETE(request: NextRequest, { params }: Params) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await connectToDatabase();
  const deleted = await PressReleaseModel.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ error: "Press release not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
