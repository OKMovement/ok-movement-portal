import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { MemberModel } from "@/lib/models/member";

const verifyPhoneSchema = z.object({
  phone: z.string().trim().min(1, "Phone number is required."),
});

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D+/g, "");
  if (!digits) return "";
  // Compare on the last 10 digits so +234 / 0-prefix / spaces all match.
  return digits.slice(-10);
}

function toPhoneEndingPattern(normalized: string): RegExp {
  return new RegExp(`${normalized.split("").join("\\D*")}$`);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = verifyPhoneSchema.parse(body);
    const normalized = normalizePhone(payload.phone);

    if (normalized.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid phone number (at least 10 digits)." },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const phonePattern = toPhoneEndingPattern(normalized);
    const existingMember = await MemberModel.exists({ phone: { $regex: phonePattern } });

    return NextResponse.json(
      { exists: Boolean(existingMember) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
    }

    console.error("Failed to verify member phone:", error);
    const message = error instanceof Error ? error.message : String(error);
    const isDatabaseIssue =
      /mongo|mongoose|econn|enotfound|timed out|server selection|querysrv/i.test(message);

    if (isDatabaseIssue) {
      return NextResponse.json(
        { error: "Verification service is temporarily unavailable. Please try again shortly." },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Unable to verify your phone number right now." },
      { status: 500 },
    );
  }
}
