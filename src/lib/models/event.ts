import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    lga: { type: String, required: false, trim: true, default: "" },
    venue: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    flierImageUrl: { type: String, required: false, trim: true },
    why: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    registrationOpen: { type: Boolean, required: true, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true },
  },
  { timestamps: true },
);

export type EventDocument = InferSchemaType<typeof eventSchema>;

export const EventModel: Model<EventDocument> =
  (models.Event as Model<EventDocument>) || model<EventDocument>("Event", eventSchema);
