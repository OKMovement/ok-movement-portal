import { NextResponse } from "next/server";
import { z } from "zod";
import { donationReferenceSchema } from "@/lib/donation-validation";
import { reconcileDonation } from "@/lib/server/donations";
import { validPaystackWebhook } from "@/lib/server/paystack";

export const runtime = "nodejs";

const eventSchema = z.object({
  event: z.literal("charge.success"),
  data: z.object({ reference: donationReferenceSchema }),
});

export async function POST(request: Request) {
  const rawBody = await request.text();
  try {
    if (!validPaystackWebhook(rawBody, request.headers.get("x-paystack-signature"))) {
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Payment service is not configured." }, { status: 503 });
  }

  let payload: unknown;
  try { payload = JSON.parse(rawBody); } catch { return NextResponse.json({ error: "Invalid payload." }, { status: 400 }); }
  const parsed = eventSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ ok: true });

  try {
    await reconcileDonation(parsed.data.data.reference);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Payment verification is temporarily unavailable." }, { status: 503 });
  }
}
