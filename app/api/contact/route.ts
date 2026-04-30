import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { ContactSubmissionModel } from "@/lib/models/contact-submission";

const contactSubmissionSchema = z.object({
  requestType: z.enum([
    "suggestion",
    "feedback",
    "information",
    "support",
    "donation",
    "volunteer",
    "press",
    "partnership",
    "other",
  ]),
  name: z.string().trim().min(1, "Full name is required."),
  email: z.string().trim().email("A valid email address is required."),
  phone: z.string().trim().optional(),
  region: z.string().trim().optional(),
  subject: z.string().trim().min(1, "Subject is required."),
  message: z.string().trim().min(20, "Message must be at least 20 characters."),
  newsletter: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = contactSubmissionSchema.parse(body);

    await connectToDatabase();

    await ContactSubmissionModel.create({
      requestType: payload.requestType,
      name: payload.name,
      email: payload.email.toLowerCase(),
      phone: payload.phone || undefined,
      region: payload.region || undefined,
      subject: payload.subject,
      message: payload.message,
      newsletter: payload.newsletter ?? true,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return NextResponse.json({ error: firstIssue?.message ?? "Invalid submission data." }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : String(error);
    const isDatabaseIssue =
      /mongo|mongoose|econn|enotfound|timed out|server selection|querysrv/i.test(message);

    if (isDatabaseIssue) {
      return NextResponse.json(
        { error: "Contact service is temporarily unavailable. Please try again shortly." },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: "Unable to submit your message right now." }, { status: 500 });
  }
}
