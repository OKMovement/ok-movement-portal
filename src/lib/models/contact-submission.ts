import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const contactSubmissionSchema = new Schema(
  {
    requestType: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: false, trim: true },
    region: { type: String, required: false, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    newsletter: { type: Boolean, required: true, default: true },
  },
  { timestamps: true },
);

export type ContactSubmissionDocument = InferSchemaType<typeof contactSubmissionSchema>;

export const ContactSubmissionModel: Model<ContactSubmissionDocument> =
  (models.ContactSubmission as Model<ContactSubmissionDocument>) ||
  model<ContactSubmissionDocument>("ContactSubmission", contactSubmissionSchema);
