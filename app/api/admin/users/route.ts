import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AdminUserModel } from "@/lib/models/admin-user";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";

export async function GET(request: NextRequest) {
  const currentAdmin = await getAdminUserFromRequest(request);
  if (!currentAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const admins = await AdminUserModel.find({})
    .select("_id name email role createdAt updatedAt lastLoginAt")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    currentAdmin: {
      id: currentAdmin.id,
      role: currentAdmin.role,
    },
    admins: admins.map((admin) => ({
      id: String(admin._id),
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt ?? null,
      updatedAt: admin.updatedAt ?? null,
      lastLoginAt: admin.lastLoginAt ?? null,
    })),
  });
}
