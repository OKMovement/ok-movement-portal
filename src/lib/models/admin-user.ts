import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const adminUserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["super", "admin"], default: "admin" },
    invitedBy: { type: Schema.Types.ObjectId, ref: "AdminUser", required: false },
    inviteTokenHash: { type: String, required: false },
    inviteTokenExpiresAt: { type: Date, required: false },
    resetTokenHash: { type: String, required: false },
    resetTokenExpiresAt: { type: Date, required: false },
    mustChangePassword: { type: Boolean, default: false },
    lastLoginAt: { type: Date, required: false },
    twoFactorCodeHash: { type: String, required: false },
    twoFactorCodeExpiresAt: { type: Date, required: false },
    twoFactorChallengeHash: { type: String, required: false },
    twoFactorChallengeExpiresAt: { type: Date, required: false },
    twoFactorCodeAttempts: { type: Number, default: 0 },
    trustedDevices: [
      {
        deviceHash: { type: String, required: true },
        userAgent: { type: String, required: false },
        firstSeenAt: { type: Date, required: true },
        lastSeenAt: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true },
);

export type AdminUserDocument = InferSchemaType<typeof adminUserSchema>;

export const AdminUserModel: Model<AdminUserDocument> =
  (models.AdminUser as Model<AdminUserDocument>) ||
  model<AdminUserDocument>("AdminUser", adminUserSchema);
