import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const memberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    engagement: { type: String, required: true, trim: true },
    donationType: { type: String, required: false, enum: ["cash", "materials"], trim: true },
    donationAmount: { type: Number, required: false },
    donationMaterial: {
      type: String,
      required: false,
      enum: ["campaign-flyers", "campaign-cap", "campaign-tshirt", "campaign-wraist-band", "other"],
      trim: true,
    },
    donationMaterialOther: { type: String, required: false, trim: true },
    isDiaspora: { type: Boolean, required: true, default: false },
    country: { type: String, required: false, trim: true },
    votingState: { type: String, required: false, trim: true },
    votingLga: { type: String, required: false, trim: true },
    votingWard: { type: String, required: false, trim: true },
  },
  { timestamps: true },
);

export type MemberDocument = InferSchemaType<typeof memberSchema>;

export const MemberModel: Model<MemberDocument> =
  (models.Member as Model<MemberDocument>) || model<MemberDocument>("Member", memberSchema);
