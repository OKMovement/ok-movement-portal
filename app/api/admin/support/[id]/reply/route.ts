import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { ContactSubmissionModel } from "@/lib/models/contact-submission";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";
import { sendContactSubmissionReplyEmail } from "@/lib/server/mailer";

type Params = {
  params: Promise<{ id: string }>;
};

const replySchema = z.object({
  message: z
    .string()
    .trim()
    .min(10, "Reply message must be at least 10 characters.")
    .max(4000, "Reply message is too long."),
});

export async function POST(request: NextRequest, { params }: Params) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const payload = replySchema.parse(body);

    await connectToDatabase();

    const submission = await ContactSubmissionModel.findById(id);
    if (!submission) {
      return NextResponse.json({ error: "Submission not found." }, { status: 404 });
    }

    await sendContactSubmissionReplyEmail({
      to: submission.email,
      supporterName: submission.name,
      originalSubject: submission.subject,
      adminName: admin.name,
      replyMessage: payload.message,
    });

    submission.replies.push({
      message: payload.message,
      sentAt: new Date(),
      sentByAdminId: admin.id,
      sentByAdminName: admin.name,
      sentByAdminEmail: admin.email,
    });
    await submission.save();

    const lastReply = submission.replies[submission.replies.length - 1];

    return NextResponse.json({
      ok: true,
      reply: {
        message: lastReply.message,
        sentAt: lastReply.sentAt,
        sentByAdminId: String(lastReply.sentByAdminId),
        sentByAdminName: lastReply.sentByAdminName,
        sentByAdminEmail: lastReply.sentByAdminEmail,
      },
      submission: {
        id: String(submission._id),
        replyCount: submission.replies.length,
        lastRepliedAt: lastReply.sentAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return NextResponse.json({ error: firstIssue?.message ?? "Invalid reply payload." }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Unable to send reply right now.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
