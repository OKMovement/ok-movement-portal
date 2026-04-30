import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AdminUserModel } from "@/lib/models/admin-user";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: Params) {
  const currentAdmin = await getAdminUserFromRequest(request);
  if (!currentAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (currentAdmin.role !== "super") {
    return NextResponse.json({ error: "Only super admins can change roles." }, { status: 403 });
  }

  const { id } = await params;
  const body = (await request.json()) as { role?: "admin" | "super" };
  const nextRole = body.role;

  if (!nextRole || !["admin", "super"].includes(nextRole)) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  await connectToDatabase();

  const targetAdmin = await AdminUserModel.findById(id);
  if (!targetAdmin) {
    return NextResponse.json({ error: "Admin not found." }, { status: 404 });
  }

  if (String(targetAdmin._id) === currentAdmin.id) {
    return NextResponse.json({ error: "You cannot change your own role." }, { status: 400 });
  }

  if (targetAdmin.role === "super" && nextRole === "admin") {
    const superAdminsCount = await AdminUserModel.countDocuments({ role: "super" });
    if (superAdminsCount <= 1) {
      return NextResponse.json(
        { error: "At least one super admin must remain." },
        { status: 400 },
      );
    }
  }

  targetAdmin.role = nextRole;
  await targetAdmin.save();

  return NextResponse.json({
    ok: true,
    admin: {
      id: String(targetAdmin._id),
      role: targetAdmin.role,
    },
  });
}
