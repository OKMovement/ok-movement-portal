import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const adminNotificationSchema = new Schema(
  {
    sentByAdminId: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true },
    sentByAdminName: { type: String, required: true, trim: true },
    sentByAdminEmail: { type: String, required: true, lowercase: true, trim: true },
    audience: {
      type: String,
      required: true,
      enum: ["members", "admins", "members_diaspora", "members_by_state", "specific_email"],
    },
    state: { type: String, required: false, trim: true },
    specificEmail: { type: String, required: false, lowercase: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    totalRecipients: { type: Number, required: true, min: 0 },
    delivered: { type: Number, required: true, min: 0 },
    failed: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

export type AdminNotificationDocument = InferSchemaType<typeof adminNotificationSchema>;

export const AdminNotificationModel: Model<AdminNotificationDocument> =
  (models.AdminNotification as Model<AdminNotificationDocument>) ||
  model<AdminNotificationDocument>("AdminNotification", adminNotificationSchema);
