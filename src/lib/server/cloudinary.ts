type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

type UploadAssetArgs = {
  file: File;
  folder?: string;
  resourceType?: "image" | "video" | "raw" | "auto";
};

export type CloudinaryUploadResult = {
  secureUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  resourceType?: string;
  originalFilename?: string;
};

function parseCloudinaryUrl(value: string): CloudinaryConfig | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const withoutScheme = trimmed.startsWith("cloudinary://")
    ? trimmed.slice("cloudinary://".length)
    : trimmed;

  // Split on the final "@" so unescaped "@" in secrets still work.
  const atIndex = withoutScheme.lastIndexOf("@");
  if (atIndex === -1) return null;

  const credentials = withoutScheme.slice(0, atIndex);
  const hostWithOptionalPath = withoutScheme.slice(atIndex + 1);
  const cloudName = hostWithOptionalPath.split("/")[0]?.trim();

  const colonIndex = credentials.indexOf(":");
  if (colonIndex === -1) return null;

  const apiKey = decodeURIComponent(credentials.slice(0, colonIndex).trim());
  const apiSecret = decodeURIComponent(credentials.slice(colonIndex + 1).trim());

  if (!apiKey || !apiSecret || !cloudName) return null;
  return { cloudName, apiKey, apiSecret };
}

function getCloudinaryConfig(): CloudinaryConfig {
  const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();
  if (cloudinaryUrl) {
    const parsedFromRaw = parseCloudinaryUrl(cloudinaryUrl);
    if (parsedFromRaw) {
      return parsedFromRaw;
    }

    try {
      const parsed = new URL(cloudinaryUrl);
      const apiKey = decodeURIComponent(parsed.username);
      const apiSecret = decodeURIComponent(parsed.password);
      const cloudName = parsed.hostname;

      if (apiKey && apiSecret && cloudName) {
        return { cloudName, apiKey, apiSecret };
      }
    } catch {
      // Fallback to explicit env keys below.
    }
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET.",
    );
  }

  return { cloudName, apiKey, apiSecret };
}

export async function uploadAssetToCloudinary({
  file,
  folder,
  resourceType = "auto",
}: UploadAssetArgs): Promise<CloudinaryUploadResult> {
  const normalizedResourceType =
    resourceType === "image" || resourceType === "video" || resourceType === "raw" || resourceType === "auto"
      ? resourceType
      : "auto";

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

  const body = new FormData();
  body.append("file", file, file.name || "upload.bin");
  if (folder) {
    body.append("folder", folder);
  }
  if (normalizedResourceType === "raw" && file.name) {
    body.append("use_filename", "true");
    body.append("unique_filename", "true");
    body.append("filename_override", file.name);
  }

  const authorization = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${normalizedResourceType}/upload`,
    {
      method: "POST",
      headers: {
        Authorization: authorization,
      },
      body,
    },
  );

  const data = (await response.json().catch(() => null)) as
    | {
        secure_url?: string;
        public_id?: string;
        width?: number;
        height?: number;
        format?: string;
        bytes?: number;
        resource_type?: string;
        original_filename?: string;
        error?: { message?: string };
      }
    | null;

  if (!response.ok || !data?.secure_url || !data.public_id) {
    const reason = data?.error?.message ?? "Unknown Cloudinary upload error.";
    throw new Error(`Cloudinary upload failed: ${reason}`);
  }

  return {
    secureUrl: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
    bytes: data.bytes,
    resourceType: data.resource_type,
    originalFilename: data.original_filename,
  };
}

export async function uploadImageToCloudinary({
  file,
  folder,
}: Omit<UploadAssetArgs, "resourceType">): Promise<CloudinaryUploadResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image uploads are allowed.");
  }

  return uploadAssetToCloudinary({ file, folder, resourceType: "image" });
}
