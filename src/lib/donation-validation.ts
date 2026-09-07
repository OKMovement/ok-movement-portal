import { z } from "zod";
import { isPhoneValid } from "./phone-validation";

export const donationAmountSchema = z.string().trim()
  .transform((value) => value.replaceAll(",", ""))
  .refine((value) => /^\d+(\.\d{1,2})?$/.test(value), "Enter an amount with up to two decimal places.")
  .transform(Number)
  .refine((value) => value >= 100 && value <= 100_000_000, "Enter an amount between ₦100 and ₦100,000,000.");

export const paymentProviderSchema = z.enum(["paystack", "flutterwave"]);
export type PaymentProvider = z.infer<typeof paymentProviderSchema>;

export const donationCheckoutSchema = z.object({
  checkoutKey: z.string().uuid(),
  provider: paymentProviderSchema,
  donationAmount: donationAmountSchema,
  name: z.string().trim().min(1).max(150),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  phone: z.string().trim().max(30).refine(isPhoneValid, "Enter a valid phone number."),
  isDiaspora: z.boolean(),
  country: z.string().trim().max(100).default(""),
  votingState: z.string().trim().max(100).default(""),
  votingLga: z.string().trim().max(150).default(""),
  votingWard: z.string().trim().max(150).default(""),
}).superRefine((value, context) => {
  if (value.isDiaspora ? !value.country : !(value.votingState && value.votingLga && value.votingWard)) {
    context.addIssue({ code: "custom", message: "Complete your location details." });
  }
});

export const donationReferenceSchema = z.string().regex(/^ok-donation-[a-f0-9-]{36}$/);
