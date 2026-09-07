import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const donationSchema = new Schema({
  reference: { type: String, required: true, unique: true },
  checkoutKey: { type: String, required: true, unique: true },
  payloadHash: { type: String, required: true },
  provider: { type: String, enum: ["paystack"], required: true },
  amount: { type: Number, required: true },
  amountSubunit: { type: Number, required: true },
  currency: { type: String, enum: ["NGN"], default: "NGN", required: true },
  environment: { type: String, enum: ["test", "live"], required: true },
  status: { type: String, enum: ["pending", "successful", "failed"], default: "pending", required: true },
  checkoutUrl: String,
  accessCode: String,
  transactionId: { type: String, unique: true, sparse: true },
  channel: String,
  paidAt: Date,
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  isDiaspora: { type: Boolean, required: true },
  country: String,
  votingState: String,
  votingLga: String,
  votingWard: String,
}, { timestamps: true });

export type DonationDocument = InferSchemaType<typeof donationSchema>;
export const DonationModel: Model<DonationDocument> =
  (models.Donation as Model<DonationDocument>) || model<DonationDocument>("Donation", donationSchema);
