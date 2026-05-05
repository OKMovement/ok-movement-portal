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
      // Replies are optional for older records created before this field existed.
      replies: (submission.replies ?? []).map((reply) => ({
        message: reply.message,
        sentAt: reply.sentAt,
        sentByAdminId: String(reply.sentByAdminId),
        sentByAdminName: reply.sentByAdminName,
        sentByAdminEmail: reply.sentByAdminEmail,
      })),
      replyCount: submission.replies?.length ?? 0,
      lastRepliedAt:
        submission.replies && submission.replies.length > 0
          ? submission.replies[submission.replies.length - 1]?.sentAt ?? null
          : null,
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
