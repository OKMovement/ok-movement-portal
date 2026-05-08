import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { TechVolunteerModel } from "@/lib/models/tech-volunteer";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";

export async function GET(request: NextRequest) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const volunteers = await TechVolunteerModel.find({})
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    volunteers: volunteers.map((item) => ({
      id: String(item._id),
      fullName: item.fullName,
      email: item.email,
      phone: item.phone,
      isDiaspora: item.isDiaspora,
      state: item.state ?? null,
      country: item.country ?? null,
      primaryRole: item.primaryRole,
      secondarySkills: item.secondarySkills ?? [],
      experience: item.experience,
      availability: item.availability ?? null,
      portfolioUrl: item.portfolioUrl ?? null,
      linkedinUrl: item.linkedinUrl ?? null,
      motivation: item.motivation ?? null,
      consent: item.consent,
      createdAt: item.createdAt,
    })),
  });
}
