import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
const ENV_PATH = path.join(PROJECT_ROOT, ".env.local");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".webm", ".m4v", ".mkv"]);
const DOCUMENT_EXTENSIONS = new Set([".pdf", ".doc", ".docx", ".txt", ".ppt", ".pptx"]);

function parseEnv(raw) {
  const result = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (!key) continue;
    result[key] = value;
  }
  return result;
}

function getCloudinaryConfig(env) {
  const cloudinaryUrl = (env.CLOUDINARY_URL || "").trim();
  if (cloudinaryUrl) {
    const parsed = new URL(cloudinaryUrl);
    return {
      cloudName: parsed.hostname,
      apiKey: decodeURIComponent(parsed.username),
      apiSecret: decodeURIComponent(parsed.password),
    };
  }

  const cloudName = (env.CLOUDINARY_CLOUD_NAME || "").trim();
  const apiKey = (env.CLOUDINARY_API_KEY || "").trim();
  const apiSecret = (env.CLOUDINARY_API_SECRET || "").trim();
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary config missing in .env.local");
  }

  return { cloudName, apiKey, apiSecret };
}

function createSignature(params, apiSecret) {
  const toSign = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1")
    .update(`${toSign}${apiSecret}`)
    .digest("hex");
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function titleFromFilename(filePath) {
  const basename = path.basename(filePath, path.extname(filePath));
  return basename
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function walkDirectory(rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkDirectory(absolute)));
      continue;
    }

    files.push(absolute);
  }

  return files;
}

function classify(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (IMAGE_EXTENSIONS.has(ext)) {
    return { type: "image", folder: "ok-movement/migrated/images", resourceType: "image" };
  }
  if (VIDEO_EXTENSIONS.has(ext)) {
    return { type: "video", folder: "ok-movement/migrated/videos", resourceType: "video" };
  }
  if (DOCUMENT_EXTENSIONS.has(ext)) {
    return { type: "document", folder: "ok-movement/migrated/documents", resourceType: "raw" };
  }
  return null;
}

async function uploadToCloudinary({ filePath, cloudName, apiKey, apiSecret, folder, resourceType }) {
  const fileBuffer = await fs.readFile(filePath);
  const fileName = path.basename(filePath);
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createSignature({ timestamp, folder }, apiSecret);

  const body = new FormData();
  body.append("file", new Blob([fileBuffer]), fileName);
  body.append("api_key", apiKey);
  body.append("timestamp", String(timestamp));
  body.append("signature", signature);
  body.append("folder", folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: "POST",
    body,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.secure_url || !data.public_id) {
    throw new Error(`Upload failed for ${fileName}: ${data?.error?.message || "Unknown error"}`);
  }

  return {
    secureUrl: data.secure_url,
    publicId: data.public_id,
  };
}

async function main() {
  const envRaw = await fs.readFile(ENV_PATH, "utf8");
  const env = parseEnv(envRaw);

  const mongoUri = (env.MONGODB_URI || "").trim();
  if (!mongoUri) {
    throw new Error("MONGODB_URI missing in .env.local");
  }

  const cloudinary = getCloudinaryConfig(env);

  const adminUserSchema = new mongoose.Schema({
    name: String,
    email: String,
  });

  const mediaItemSchema = new mongoose.Schema(
    {
      kind: { type: String, enum: ["image", "news", "video"], required: true },
      title: { type: String, required: true },
      imageUrl: { type: String, required: true },
      category: String,
      description: String,
      excerpt: String,
      location: String,
      linkUrl: String,
      duration: String,
      publishedAt: Date,
      isPublished: { type: Boolean, default: true },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser", required: true },
    },
    { timestamps: true },
  );

  const pressReleaseSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      imageUrl: String,
      fileUrl: String,
      excerpt: { type: String, required: true },
      body: { type: String, required: true },
      published: { type: Boolean, default: false },
      publishedAt: Date,
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser", required: true },
    },
    { timestamps: true },
  );

  const AdminUserModel = mongoose.models.AdminUser || mongoose.model("AdminUser", adminUserSchema);
  const MediaItemModel = mongoose.models.MediaItem || mongoose.model("MediaItem", mediaItemSchema);
  const PressReleaseModel =
    mongoose.models.PressRelease || mongoose.model("PressRelease", pressReleaseSchema);

  await mongoose.connect(mongoUri, { dbName: "OK-MOVEMENT" });

  const admin = await AdminUserModel.findOne({}).select("_id").lean();
  if (!admin?._id) {
    throw new Error("No admin user found. Create an admin account first, then rerun.");
  }

  const files = await walkDirectory(PUBLIC_DIR);
  const mediaFiles = files
    .map((filePath) => ({ filePath, classification: classify(filePath) }))
    .filter((entry) => entry.classification !== null);

  console.log(`Found ${mediaFiles.length} media files to upload.`);

  const manifest = [];
  let firstImageUrl = "";

  for (const entry of mediaFiles) {
    const relativePath = path.relative(PUBLIC_DIR, entry.filePath).replaceAll(path.sep, "/");
    const { classification } = entry;
    const title = titleFromFilename(entry.filePath);

    try {
      const upload = await uploadToCloudinary({
        filePath: entry.filePath,
        cloudName: cloudinary.cloudName,
        apiKey: cloudinary.apiKey,
        apiSecret: cloudinary.apiSecret,
        folder: classification.folder,
        resourceType: classification.resourceType,
      });

      if (!firstImageUrl && classification.type === "image") {
        firstImageUrl = upload.secureUrl;
      }

      manifest.push({
        localPath: `/${relativePath}`,
        type: classification.type,
        title,
        cloudinaryUrl: upload.secureUrl,
        publicId: upload.publicId,
      });

      if (classification.type === "image") {
        await MediaItemModel.findOneAndUpdate(
          { kind: "image", imageUrl: upload.secureUrl },
          {
            kind: "image",
            title,
            imageUrl: upload.secureUrl,
            category: "Gallery",
            description: title,
            excerpt: title,
            location: "Movement",
            publishedAt: new Date(),
            isPublished: true,
            createdBy: admin._id,
          },
          { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
        );
      }

      if (classification.type === "video") {
        await MediaItemModel.findOneAndUpdate(
          { kind: "video", linkUrl: upload.secureUrl },
          {
            kind: "video",
            title,
            imageUrl: firstImageUrl || upload.secureUrl,
            category: "Video",
            description: title,
            excerpt: title,
            linkUrl: upload.secureUrl,
            publishedAt: new Date(),
            isPublished: true,
            createdBy: admin._id,
          },
          { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
        );
      }

      if (classification.type === "document") {
        const baseSlug = slugify(title) || `press-${Date.now()}`;
        let slug = baseSlug;
        let suffix = 1;

        while (await PressReleaseModel.exists({ slug })) {
          suffix += 1;
          slug = `${baseSlug}-${suffix}`;
        }

        const existing = await PressReleaseModel.findOne({ fileUrl: upload.secureUrl }).lean();
        if (!existing) {
          await PressReleaseModel.create({
            title,
            slug,
            imageUrl: firstImageUrl || "",
            fileUrl: upload.secureUrl,
            excerpt: `${title} is available for download from the movement newsroom.`,
            body: `${title} has been migrated to cloud storage and published by admin.`,
            published: true,
            publishedAt: new Date(),
            createdBy: admin._id,
          });
        }
      }

      console.log(`Uploaded: /${relativePath}`);
    } catch (error) {
      console.error(`Failed: /${relativePath}`);
      console.error(error instanceof Error ? error.message : error);
    }
  }

  const manifestPath = path.join(PROJECT_ROOT, "scripts", "cloudinary-migration-manifest.json");
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`Migration complete. Uploaded ${manifest.length} files.`);
  console.log(`Manifest saved at ${manifestPath}`);

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
