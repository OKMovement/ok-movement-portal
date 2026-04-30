import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ContactSubmissionModel } from "@/lib/models/contact-submission";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";

export async function GET(request: NextRequest) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const submissions = await ContactSubmissionModel.find({}).sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    submissions: submissions.map((submission) => ({
      id: String(submission._id),
      requestType: submission.requestType,
      name: submission.name,
      email: submission.email,
      phone: submission.phone ?? null,
      region: submission.region ?? null,
      subject: submission.subject,
      message: submission.message,
      newsletter: submission.newsletter,
      createdAt: submission.createdAt,
    })),
  });
}
