import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AdminUserModel } from "@/lib/models/admin-user";
import { normalizeEmail, verifyPassword } from "@/lib/server/auth";
import { setAdminSession } from "@/lib/server/admin-session";
import { ensureBootstrapAdmin } from "@/lib/server/bootstrap-admin";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email ? normalizeEmail(body.email) : "";
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    await ensureBootstrapAdmin();
    await connectToDatabase();

    const admin = await AdminUserModel.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    await setAdminSession({
      id: String(admin._id),
      email: admin.email,
      role: admin.role,
      name: admin.name,
    });

    return NextResponse.json({
      ok: true,
      admin: {
        id: String(admin._id),
        name: admin.name,
        email: admin.email,
        role: admin.role,
        mustChangePassword: admin.mustChangePassword,
      },
    });
  } catch (error) {
    console.error("Admin sign in failed:", error);
    return NextResponse.json({ error: "Unable to sign in right now." }, { status: 500 });
  }
}
