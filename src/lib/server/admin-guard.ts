import { redirect } from "next/navigation";
import { getAdminSessionFromCookies } from "@/lib/server/admin-session";
import { connectToDatabase } from "@/lib/db";
import { AdminUserModel } from "@/lib/models/admin-user";

export async function requireAdminSession() {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    redirect("/admin/sign-in");
  }
  return session;
}

export async function getCurrentAdminUser() {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return null;
  }

  await connectToDatabase();

  const admin = await AdminUserModel.findById(session.sub)
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
