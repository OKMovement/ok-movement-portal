import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const mediaItemSchema = new Schema(
  {
    kind: { type: String, enum: ["image", "news", "video"], required: true },
    title: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    category: { type: String, required: false, trim: true },
    description: { type: String, required: false, trim: true },
    excerpt: { type: String, required: false, trim: true },
    location: { type: String, required: false, trim: true },
    linkUrl: { type: String, required: false, trim: true },
    duration: { type: String, required: false, trim: true },
    publishedAt: { type: Date, required: false },
    isPublished: { type: Boolean, required: true, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true },
  },
  { timestamps: true },
);

export type MediaItemDocument = InferSchemaType<typeof mediaItemSchema>;

export const MediaItemModel: Model<MediaItemDocument> =
  (models.MediaItem as Model<MediaItemDocument>) ||
  model<MediaItemDocument>("MediaItem", mediaItemSchema);
