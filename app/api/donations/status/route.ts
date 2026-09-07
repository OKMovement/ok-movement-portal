import { NextResponse } from "next/server";
import { donationReferenceSchema } from "@/lib/donation-validation";
import { DonationModel } from "@/lib/models/donation";
import { donationPaymentSummary, reconcileDonation } from "@/lib/server/donations";
import { PaymentServiceError } from "@/lib/server/payment-service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const parsed = donationReferenceSchema.safeParse(new URL(request.url).searchParams.get("reference"));
  if (!parsed.success) return NextResponse.json({ error: "Invalid donation reference." }, { status: 400 });

  try {
    let verificationError = "";
    const donation = await reconcileDonation(parsed.data).catch(async (error: unknown) => {
      if (!(error instanceof PaymentServiceError)) throw error;
      verificationError = error.message;
      return DonationModel.findOne({ reference: parsed.data });
    });
    if (!donation) return NextResponse.json({ error: "Donation not found." }, { status: 404 });

    return NextResponse.json(
      { ...donationPaymentSummary(donation), verificationError },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "Unable to check your payment. Please try again shortly." }, { status: 503 });
  }
}
