import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AdminUserModel } from "@/lib/models/admin-user";
import { createTemporaryPassword, hashPassword, normalizeEmail } from "@/lib/server/auth";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";
import { sendAdminInviteEmail } from "@/lib/server/mailer";

export async function POST(request: NextRequest) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { name?: string; email?: string; role?: "admin" | "super" };
    const name = body.name?.trim() ?? "";
    const email = body.email ? normalizeEmail(body.email) : "";
    const requestedRole = body.role === "super" ? "super" : "admin";
    const role = admin.role === "super" ? requestedRole : "admin";

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    await connectToDatabase();

    const existing = await AdminUserModel.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "An admin with this email already exists." }, { status: 409 });
    }

    const temporaryPassword = createTemporaryPassword();
    const passwordHash = await hashPassword(temporaryPassword);

    const invited = await AdminUserModel.create({
      name,
      email,
      passwordHash,
      role,
      invitedBy: admin.id,
      mustChangePassword: true,
    });

    const origin = process.env.APP_BASE_URL || request.nextUrl.origin;
    const signInUrl = `${origin}/admin/sign-in`;

    await sendAdminInviteEmail({
      email,
      invitedByName: admin.name,
      temporaryPassword,
      signInUrl,
    });

    return NextResponse.json({
      ok: true,
      invited: {
        id: String(invited._id),
        name: invited.name,
        email: invited.email,
        role: invited.role,
      },
    });
  } catch (error) {
    console.error("Admin invite failed:", error);
    return NextResponse.json({ error: "Unable to send admin invite right now." }, { status: 500 });
  }
}
