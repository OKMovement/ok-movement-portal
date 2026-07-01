import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { PvcComplaintModel } from "@/lib/models/pvc-complaint";

const pvcComplaintSchema = z.object({
  fullName: z.string().trim().min(2, "Your name is required."),
  contact: z.string().trim().min(5, "Phone number or email is required."),
  state: z.string().trim().max(80, "State is too long.").optional(),
  problem: z.string().trim().min(10, "Please describe the problem in more detail."),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = pvcComplaintSchema.parse(body);

    await connectToDatabase();

    await PvcComplaintModel.create({
      fullName: payload.fullName,
      contact: payload.contact,
      state: payload.state || undefined,
      problem: payload.problem,
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
        { error: "Complaint service is temporarily unavailable. Please try again shortly." },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: "Unable to submit complaint right now." }, { status: 500 });
  }
}
