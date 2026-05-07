import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const techVolunteerSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    phone: { type: String, required: true, trim: true },
    isDiaspora: { type: Boolean, required: true, default: false },
    state: { type: String, required: false, trim: true },
    country: { type: String, required: false, trim: true },
    primaryRole: { type: String, required: true, trim: true },
    secondarySkills: { type: [String], default: [] },
    experience: { type: String, required: true, trim: true },
    availability: { type: String, required: true, trim: true },
    portfolioUrl: { type: String, required: false, trim: true },
    linkedinUrl: { type: String, required: false, trim: true },
    motivation: { type: String, required: false, trim: true },
    consent: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

techVolunteerSchema.index({ email: 1 }, { unique: true });
techVolunteerSchema.index({ createdAt: -1 });

export type TechVolunteerDocument = InferSchemaType<typeof techVolunteerSchema>;

export const TechVolunteerModel: Model<TechVolunteerDocument> =
  (models.TechVolunteer as Model<TechVolunteerDocument>) ||
  model<TechVolunteerDocument>("TechVolunteer", techVolunteerSchema);
