import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AdminUserModel } from "@/lib/models/admin-user";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/server/session";

export async function getAdminUserFromRequest(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const payload = verifyAdminSessionToken(token);
  if (!payload) {
    return null;
  }

  await connectToDatabase();

  const admin = await AdminUserModel.findById(payload.sub)
    .select("_id name email role mustChangePassword")
    .lean();

  if (!admin) {
    return null;
  }

  return {
    id: String(admin._id),
    name: admin.name,
    email: admin.email,
    role: admin.role,
    mustChangePassword: admin.mustChangePassword,
  };
}
