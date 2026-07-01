import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const pvcComplaintSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    state: { type: String, required: false, trim: true },
    problem: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export type PvcComplaintDocument = InferSchemaType<typeof pvcComplaintSchema>;

export const PvcComplaintModel: Model<PvcComplaintDocument> =
  (models.PvcComplaint as Model<PvcComplaintDocument>) ||
  model<PvcComplaintDocument>("PvcComplaint", pvcComplaintSchema);
