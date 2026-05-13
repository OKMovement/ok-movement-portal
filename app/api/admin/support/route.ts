import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ContactSubmissionModel } from "@/lib/models/contact-submission";
import { PvcComplaintModel } from "@/lib/models/pvc-complaint";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";

export async function GET(request: NextRequest) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const [contactSubmissions, complaintSubmissions] = await Promise.all([
    ContactSubmissionModel.find({}).sort({ createdAt: -1 }).lean(),
    PvcComplaintModel.find({}).sort({ createdAt: -1 }).lean(),
  ]);

  const mappedContactSubmissions = contactSubmissions.map((submission) => ({
    source: "contact" as const,
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
  }));

  const mappedComplaintSubmissions = complaintSubmissions.map((submission) => {
    const contact = submission.contact?.trim() ?? "";
    const hasEmail = contact.includes("@");

    return {
      source: "complaint" as const,
      replies: [],
      replyCount: 0,
      lastRepliedAt: null,
      id: String(submission._id),
      requestType: "pvc-complaint",
      name: submission.fullName,
      email: hasEmail ? contact.toLowerCase() : null,
      phone: hasEmail ? null : contact || null,
      region: submission.state ?? null,
      subject: "PVC Complaint Submission",
      message: submission.problem,
      newsletter: false,
      createdAt: submission.createdAt,
    };
  });

  const submissions = [...mappedContactSubmissions, ...mappedComplaintSubmissions].sort((a, b) => {
    const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bDate - aDate;
  });

  return NextResponse.json({
    submissions,
  });
}
