import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AdminUserModel } from "@/lib/models/admin-user";
import { createRandomToken, hashToken, normalizeEmail } from "@/lib/server/auth";
import { sendPasswordResetEmail } from "@/lib/server/mailer";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email ? normalizeEmail(body.email) : "";

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    await connectToDatabase();

    const admin = await AdminUserModel.findOne({ email });

    if (admin) {
      const rawToken = createRandomToken();
      admin.resetTokenHash = hashToken(rawToken);
      admin.resetTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 30);
      await admin.save();

      const origin = process.env.APP_BASE_URL || new URL(request.url).origin;
      const resetUrl = `${origin}/admin/reset-password?token=${rawToken}`;
      await sendPasswordResetEmail({ email: admin.email, resetUrl });
    }

    return NextResponse.json({
      ok: true,
      message: "If this email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password failed:", error);
    return NextResponse.json({ error: "Unable to process request right now." }, { status: 500 });
  }
}
