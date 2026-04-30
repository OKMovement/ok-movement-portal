import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AdminUserModel } from "@/lib/models/admin-user";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: NextRequest, { params }: Params) {
  const currentAdmin = await getAdminUserFromRequest(request);
  if (!currentAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (currentAdmin.role !== "super") {
    return NextResponse.json({ error: "Only super admins can delete admins." }, { status: 403 });
  }

  const { id } = await params;

  if (id === currentAdmin.id) {
    return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
  }

  await connectToDatabase();

  const targetAdmin = await AdminUserModel.findById(id);
  if (!targetAdmin) {
    return NextResponse.json({ error: "Admin not found." }, { status: 404 });
  }

  if (targetAdmin.role === "super") {
    const superAdminsCount = await AdminUserModel.countDocuments({ role: "super" });
    if (superAdminsCount <= 1) {
      return NextResponse.json(
        { error: "At least one super admin must remain." },
        { status: 400 },
      );
    }
  }

  await AdminUserModel.findByIdAndDelete(id);

  return NextResponse.json({ ok: true });
}
