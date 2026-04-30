import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AdminUserModel } from "@/lib/models/admin-user";
import { hashPassword, hashToken } from "@/lib/server/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      token?: string;
      password?: string;
      confirmPassword?: string;
    };

    const token = body.token?.trim() ?? "";
    const password = body.password ?? "";
    const confirmPassword = body.confirmPassword ?? "";

    if (!token || !password || !confirmPassword) {
      return NextResponse.json({ error: "Token and passwords are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    await connectToDatabase();

    const admin = await AdminUserModel.findOne({
      resetTokenHash: hashToken(token),
      resetTokenExpiresAt: { $gt: new Date() },
    });

    if (!admin) {
      return NextResponse.json({ error: "Invalid or expired reset token." }, { status: 400 });
    }

    admin.passwordHash = await hashPassword(password);
    admin.mustChangePassword = false;
    admin.resetTokenHash = undefined;
    admin.resetTokenExpiresAt = undefined;
    await admin.save();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Reset password failed:", error);
    return NextResponse.json({ error: "Unable to reset password right now." }, { status: 500 });
  }
}
