import { NextResponse } from "next/server";
import { z } from "zod";
import { donationReferenceSchema } from "@/lib/donation-validation";
import { reconcileDonation } from "@/lib/server/donations";
import { validFlutterwaveWebhook } from "@/lib/server/flutterwave";

export const runtime = "nodejs";

const eventSchema = z.object({
  event: z.string().optional(),
  type: z.string().optional(),
  data: z.object({
    tx_ref: z.string().optional(),
    reference: z.string().optional(),
  }),
});

export async function POST(request: Request) {
  const rawBody = await request.text();
  try {
    if (!validFlutterwaveWebhook(
      rawBody,
      request.headers.get("flutterwave-signature"),
      request.headers.get("verif-hash"),
    )) {
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Payment service is not configured." }, { status: 503 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }
  const parsed = eventSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ ok: true });
  const eventName = parsed.data.event ?? parsed.data.type;
  if (eventName !== "charge.completed") return NextResponse.json({ ok: true });
  const reference = parsed.data.data.tx_ref ?? parsed.data.data.reference;
  const validReference = donationReferenceSchema.safeParse(reference);
  if (!validReference.success) return NextResponse.json({ ok: true });

  try {
    await reconcileDonation(validReference.data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Payment verification is temporarily unavailable." }, { status: 503 });
  }
}
