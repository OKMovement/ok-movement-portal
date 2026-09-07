import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

const API_URL = "https://api.paystack.co";

export class PaymentServiceError extends Error {
  constructor(message: string, public status = 502) { super(message); }
}

export function getPaystackConfig() {
  const secretKey = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secretKey || (!secretKey.startsWith("sk_test_") && !secretKey.startsWith("sk_live_"))) {
    throw new PaymentServiceError("Online donations are temporarily unavailable. Please try again later.", 503);
  }
  return { secretKey, environment: secretKey.startsWith("sk_live_") ? "live" as const : "test" as const };
}

async function paystackRequest(path: string, body?: unknown) {
  const { secretKey } = getPaystackConfig();
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: body ? "POST" : "GET",
      headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json" },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.status !== true) {
      throw new PaymentServiceError("Paystack could not complete this request. Please try again shortly.");
    }
    return result.data as unknown;
  } catch (error) {
    if (error instanceof PaymentServiceError) throw error;
    throw new PaymentServiceError("Paystack is taking too long to respond. Please check the payment status before trying again.");
  }
}

function isPaystackCheckoutUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "checkout.paystack.com" && !url.username && !url.password && !url.port;
  } catch { return false; }
}

export async function initializePaystackTransaction(input: {
  reference: string; amountSubunit: number; name: string; email: string; phone: string; callbackUrl: string;
}) {
  const data = await paystackRequest("/transaction/initialize", {
    email: input.email,
    amount: String(input.amountSubunit),
    currency: "NGN",
    reference: input.reference,
    callback_url: input.callbackUrl,
    metadata: { donor_name: input.name, donor_phone: input.phone, donation_reference: input.reference },
  });
  const parsed = z.object({
    authorization_url: z.string().refine(isPaystackCheckoutUrl),
    access_code: z.string().min(1),
    reference: z.string(),
  }).safeParse(data);
  if (!parsed.success || parsed.data.reference !== input.reference) {
    throw new PaymentServiceError("Unable to start Paystack checkout. Please try again.");
  }
  return { checkoutUrl: parsed.data.authorization_url, accessCode: parsed.data.access_code };
}

const transactionSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  status: z.string(),
  reference: z.string(),
  amount: z.number().int().nonnegative(),
  currency: z.string(),
  domain: z.string(),
  channel: z.string().optional(),
  paid_at: z.string().nullable().optional(),
  customer: z.object({ email: z.string() }),
});
export type PaystackTransaction = z.infer<typeof transactionSchema>;

export async function verifyPaystackTransaction(reference: string) {
  const parsed = transactionSchema.safeParse(
    await paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`),
  );
  if (!parsed.success) throw new PaymentServiceError("Unable to verify payment details. Please check again shortly.");
  return parsed.data;
}

export function transactionMatchesDonation(transaction: PaystackTransaction, donation: {
  reference: string; amountSubunit: number; currency: string; email: string; environment: string;
}) {
  return transaction.reference === donation.reference && transaction.amount === donation.amountSubunit &&
    transaction.currency === donation.currency && transaction.customer.email.trim().toLowerCase() === donation.email &&
    transaction.domain === donation.environment;
}

export function validPaystackWebhook(rawBody: string, signature: string | null) {
  if (!signature) return false;
  const { secretKey } = getPaystackConfig();
  const received = Buffer.from(signature);
  const expected = Buffer.from(createHmac("sha512", secretKey).update(rawBody).digest("hex"));
  return received.length === expected.length && timingSafeEqual(received, expected);
}
