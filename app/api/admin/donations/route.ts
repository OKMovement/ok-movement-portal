import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { DonationModel } from "@/lib/models/donation";
import { MemberModel } from "@/lib/models/member";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";

export async function GET(request: NextRequest) {
  if (!(await getAdminUserFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const [payments, pledges] = await Promise.all([
    DonationModel.find({}).sort({ createdAt: -1 }).lean(),
    MemberModel.find({ engagement: /donate/i, donationType: { $in: ["cash", "materials"] } }).lean(),
  ]);

  const rows = [
    ...payments.map((payment) => ({
      id: String(payment._id),
      name: payment.name,
      email: payment.email,
      phone: payment.phone,
      engagement: "Donate",
      donationType: "cash",
      donationAmount: payment.amount,
      donationMaterial: null,
      donationMaterialOther: null,
      isDiaspora: payment.isDiaspora,
      country: payment.country ?? null,
      city: null,
      stateOfOrigin: null,
      votingState: payment.votingState ?? null,
      votingLga: payment.votingLga ?? null,
      votingWard: payment.votingWard ?? null,
      paymentStatus: payment.status,
      paymentProvider: payment.provider === "flutterwave" ? "Flutterwave" : "Paystack",
      paymentEnvironment: payment.environment,
      paymentReference: payment.reference,
      paymentTransactionId: payment.transactionId ?? null,
      paymentChannel: payment.channel ?? null,
      paidAt: payment.paidAt ?? null,
      createdAt: payment.createdAt,
      isPaymentRecord: true,
    })),
    ...pledges.map((member) => ({
      id: String(member._id),
      name: member.name,
      email: member.email,
      phone: member.phone,
      engagement: member.engagement,
      donationType: member.donationType,
      donationAmount: member.donationAmount ?? null,
      donationMaterial: member.donationMaterial ?? null,
      donationMaterialOther: member.donationMaterialOther ?? null,
      isDiaspora: member.isDiaspora,
      country: member.country ?? null,
      city: member.city ?? null,
      stateOfOrigin: member.stateOfOrigin ?? null,
      votingState: member.votingState ?? null,
      votingLga: member.votingLga ?? null,
      votingWard: member.votingWard ?? null,
      paymentStatus: "pledged",
      paymentProvider: null,
      paymentEnvironment: null,
      paymentReference: null,
      paymentTransactionId: null,
      paymentChannel: null,
      paidAt: null,
      createdAt: member.createdAt,
      isPaymentRecord: false,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ members: rows }, { headers: { "Cache-Control": "no-store" } });
}
