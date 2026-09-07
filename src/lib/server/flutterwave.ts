import { timingSafeEqual, createHmac } from "node:crypto";
import { z } from "zod";
import { PaymentServiceError } from "./payment-service";

const API_URL = "https://api.flutterwave.com/v3";

export function getFlutterwaveConfig() {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY?.trim();
  if (!secretKey || (!secretKey.startsWith("FLWSECK_TEST-") && !secretKey.startsWith("FLWSECK-"))) {
    throw new PaymentServiceError("Flutterwave donations are temporarily unavailable. Please choose Paystack or try again later.", 503);
  }
  return {
    secretKey,
    environment: secretKey.startsWith("FLWSECK_TEST-") ? "test" as const : "live" as const,
  };
}

async function flutterwaveRequest(path: string, body?: unknown) {
  const { secretKey } = getFlutterwaveConfig();
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: body ? "POST" : "GET",
      headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json" },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.status !== "success") {
      throw new PaymentServiceError("Flutterwave could not complete this request. Please try again shortly.");
    }
    return result.data as unknown;
  } catch (error) {
    if (error instanceof PaymentServiceError) throw error;
    throw new PaymentServiceError("Flutterwave is taking too long to respond. Please check the payment status before trying again.");
  }
}

function isFlutterwaveCheckoutUrl(value: string) {
  try {
    const url = new URL(value);
    const allowedHosts = new Set([
      "checkout.flutterwave.com",
      "checkout-v2.dev-flutterwave.com",
    ]);
    return url.protocol === "https:"
      && allowedHosts.has(url.hostname)
      && !url.username
      && !url.password
      && !url.port;
  } catch {
    return false;
  }
}

export async function initializeFlutterwaveTransaction(input: {
  reference: string;
  amount: number;
  name: string;
  email: string;
  phone: string;
  callbackUrl: string;
}) {
  const data = await flutterwaveRequest("/payments", {
    tx_ref: input.reference,
    amount: input.amount,
    currency: "NGN",
    redirect_url: input.callbackUrl,
    customer: { email: input.email, name: input.name, phonenumber: input.phone },
    customizations: {
      title: "OK Movement Donation",
      description: "Support the OK Movement",
    },
    meta: { donation_reference: input.reference },
  });
  const parsed = z.object({ link: z.string().refine(isFlutterwaveCheckoutUrl) }).safeParse(data);
  if (!parsed.success) {
    throw new PaymentServiceError("Unable to start Flutterwave checkout. Please try again.");
  }
  return { checkoutUrl: parsed.data.link };
}

const transactionSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  tx_ref: z.string(),
  status: z.string(),
  amount: z.number().nonnegative(),
  currency: z.string(),
  payment_type: z.string().optional(),
  created_at: z.string().nullable().optional(),
  customer: z.object({ email: z.string() }).optional(),
});
export type FlutterwaveTransaction = z.infer<typeof transactionSchema>;

export async function verifyFlutterwaveTransaction(reference: string) {
  const parsed = transactionSchema.safeParse(
    await flutterwaveRequest(`/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`),
  );
  if (!parsed.success) {
    throw new PaymentServiceError("Unable to verify Flutterwave payment details. Please check again shortly.");
  }
  return parsed.data;
}

export function flutterwaveTransactionMatchesDonation(transaction: FlutterwaveTransaction, donation: {
  reference: string;
  amountSubunit: number;
  currency: string;
}) {
  return transaction.tx_ref === donation.reference
    && Math.round(transaction.amount * 100) === donation.amountSubunit
    && transaction.currency === donation.currency;
}

function safeEqual(received: string, expected: string) {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer);
}

export function validFlutterwaveWebhook(rawBody: string, signature: string | null, legacyHash: string | null) {
  const secretHash = process.env.FLUTTERWAVE_SECRET_HASH?.trim();
  if (!secretHash) {
    throw new PaymentServiceError("Flutterwave webhook verification is not configured.", 503);
  }
  if (signature) {
    const expected = createHmac("sha256", secretHash).update(rawBody).digest("base64");
    return safeEqual(signature, expected);
  }
  return Boolean(legacyHash && safeEqual(legacyHash, secretHash));
}
