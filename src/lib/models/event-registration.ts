import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const eventRegistrationSchema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: false, trim: true },
    locationType: { type: String, required: false, trim: true, enum: ["nigeria", "diaspora"], default: "nigeria" },
    country: { type: String, required: false, trim: true },
    state: { type: String, required: false, trim: true },
    lga: { type: String, required: false, trim: true },
    address: { type: String, required: false, trim: true },
    notes: { type: String, required: false, trim: true },
  },
  { timestamps: true },
);

eventRegistrationSchema.index({ eventId: 1, email: 1 }, { unique: true });

export type EventRegistrationDocument = InferSchemaType<typeof eventRegistrationSchema>;

export const EventRegistrationModel: Model<EventRegistrationDocument> =
  (models.EventRegistration as Model<EventRegistrationDocument>) ||
  model<EventRegistrationDocument>("EventRegistration", eventRegistrationSchema);
