import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { MemberModel } from "@/lib/models/member";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";

export async function GET(request: NextRequest) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const members = await MemberModel.find({}).sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    members: members.map((member) => ({
      id: String(member._id),
      name: member.name,
      email: member.email,
      phone: member.phone,
      engagement: member.engagement,
      donationType: member.donationType ?? null,
      donationAmount: member.donationAmount ?? null,
      donationMaterial: member.donationMaterial ?? null,
      donationMaterialOther: member.donationMaterialOther ?? null,
      isDiaspora: member.isDiaspora,
      country: member.country ?? null,
      votingState: member.votingState ?? null,
      votingLga: member.votingLga ?? null,
      votingWard: member.votingWard ?? null,
      createdAt: member.createdAt,
    })),
  });
}
