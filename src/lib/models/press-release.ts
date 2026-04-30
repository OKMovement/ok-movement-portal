import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const pressReleaseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    imageUrl: { type: String, required: false, trim: true },
    fileUrl: { type: String, required: false, trim: true },
    excerpt: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    published: { type: Boolean, required: true, default: false },
    publishedAt: { type: Date, required: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true },
  },
  { timestamps: true },
);

export type PressReleaseDocument = InferSchemaType<typeof pressReleaseSchema>;

export const PressReleaseModel: Model<PressReleaseDocument> =
  (models.PressRelease as Model<PressReleaseDocument>) ||
  model<PressReleaseDocument>("PressRelease", pressReleaseSchema);
