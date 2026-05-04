import { NextResponse, type NextRequest } from "next/server";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";
import { uploadAssetToCloudinary } from "@/lib/server/cloudinary";

const FOLDER_BY_CONTEXT = {
  "event-flier": "ok-movement/events/fliers",
  "press-release": "ok-movement/press-releases",
  media: "ok-movement/media/images",
  "media-image": "ok-movement/media/images",
  "media-video": "ok-movement/media/videos",
  "media-file": "ok-movement/media/files",
} as const;

type UploadContext = keyof typeof FOLDER_BY_CONTEXT;

function isUploadContext(value: string): value is UploadContext {
  return value in FOLDER_BY_CONTEXT;
}

function resolveResourceType(file: File): "image" | "video" | "raw" {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "raw";
}

function isFileTooLarge(file: File): boolean {
  const maxSizeByType = file.type.startsWith("video/")
    ? 100 * 1024 * 1024
    : 20 * 1024 * 1024;
  return file.size > maxSizeByType;
}

export async function POST(request: NextRequest) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const contextRaw = String(formData.get("context") ?? "media");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Please attach a file." }, { status: 400 });
    }

    if (isFileTooLarge(file)) {
      return NextResponse.json(
        { error: "File too large. Images/files max 20MB, videos max 100MB." },
        { status: 400 },
      );
    }

    if (!isUploadContext(contextRaw)) {
      return NextResponse.json({ error: "Invalid upload context." }, { status: 400 });
    }

    const upload = await uploadAssetToCloudinary({
      file,
      folder: FOLDER_BY_CONTEXT[contextRaw],
      resourceType: resolveResourceType(file),
    });

    return NextResponse.json({
      ok: true,
      asset: {
        url: upload.secureUrl,
        publicId: upload.publicId,
        width: upload.width ?? null,
        height: upload.height ?? null,
        format: upload.format ?? null,
        bytes: upload.bytes ?? null,
        resourceType: upload.resourceType ?? null,
        originalFilename: upload.originalFilename ?? null,
      },
      image: {
        url: upload.secureUrl,
        publicId: upload.publicId,
        width: upload.width ?? null,
        height: upload.height ?? null,
        format: upload.format ?? null,
        bytes: upload.bytes ?? null,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown upload error.";
    console.error("Failed to upload file:", error);

    const status = message.includes("Cloudinary is not configured")
      ? 503
      : message.startsWith("Cloudinary upload failed:")
        ? 502
        : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
