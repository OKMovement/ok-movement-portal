import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { PressReleaseModel } from "@/lib/models/press-release";

export async function GET() {
  await connectToDatabase();

  const releases = await PressReleaseModel.find({ published: true })
    .sort({ publishedAt: -1, createdAt: -1 })
    .select("_id title slug imageUrl fileUrl excerpt body publishedAt createdAt updatedAt")
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
      publishedAt: release.publishedAt ?? null,
      createdAt: release.createdAt,
      updatedAt: release.updatedAt,
    })),
  });
}
