import { NextResponse, type NextRequest } from "next/server";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";
import { uploadImageToCloudinary } from "@/lib/server/cloudinary";

const FOLDER_BY_CONTEXT = {
  "event-flier": "ok-movement/events/fliers",
  "press-release": "ok-movement/press-releases",
  media: "ok-movement/media",
} as const;

type UploadContext = keyof typeof FOLDER_BY_CONTEXT;

function isUploadContext(value: string): value is UploadContext {
  return value in FOLDER_BY_CONTEXT;
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
      return NextResponse.json({ error: "Please attach an image file." }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be 10MB or smaller." }, { status: 400 });
    }

    if (!isUploadContext(contextRaw)) {
      return NextResponse.json({ error: "Invalid upload context." }, { status: 400 });
    }

    const upload = await uploadImageToCloudinary({
      file,
      folder: FOLDER_BY_CONTEXT[contextRaw],
    });

    return NextResponse.json({
      ok: true,
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
    console.error("Failed to upload image:", error);
    return NextResponse.json({ error: "Unable to upload image right now." }, { status: 500 });
  }
}
