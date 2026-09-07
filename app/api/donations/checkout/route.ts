import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { donationCheckoutSchema } from "@/lib/donation-validation";
import { DonationModel } from "@/lib/models/donation";
import { getPaystackConfig, initializePaystackTransaction, PaymentServiceError } from "@/lib/server/paystack";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const parsed = donationCheckoutSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid donation details." }, { status: 400 });
    }
    const { environment } = getPaystackConfig();
    const baseUrl = process.env.APP_BASE_URL?.trim();
    if (!baseUrl) throw new PaymentServiceError("Online donations are temporarily unavailable.", 503);

    const { checkoutKey, donationAmount: amount, ...donor } = parsed.data;
    const amountSubunit = Math.round(amount * 100);
    const payloadHash = createHash("sha256").update(JSON.stringify({ amountSubunit, ...donor })).digest("hex");
    await connectToDatabase();
    await DonationModel.init();

    const donation = await DonationModel.findOneAndUpdate(
      { checkoutKey },
      { $setOnInsert: {
        ...donor,
        amount,
        amountSubunit,
        checkoutKey,
        payloadHash,
        environment,
        reference: `ok-donation-${randomUUID()}`,
        currency: "NGN",
        status: "pending",
      } },
      { upsert: true, new: true },
    );

    if (donation.payloadHash !== payloadHash || donation.environment !== environment) {
      return NextResponse.json({ error: "Donation details changed. Please submit the form again." }, { status: 409 });
    }

    if (!donation.checkoutUrl) {
      const callbackUrl = new URL("/home/donations/payment", baseUrl);
      const checkout = await initializePaystackTransaction({
        reference: donation.reference,
        amountSubunit,
        name: donor.name,
        email: donor.email,
        phone: donor.phone,
        callbackUrl: callbackUrl.toString(),
      });
      donation.checkoutUrl = checkout.checkoutUrl;
      donation.accessCode = checkout.accessCode;
      await donation.save();
    }

    return NextResponse.json(
      { checkoutUrl: donation.checkoutUrl },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof PaymentServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Unable to start your donation. Please try again shortly." }, { status: 503 });
  }
}
