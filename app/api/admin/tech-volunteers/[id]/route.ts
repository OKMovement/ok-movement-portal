import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { TechVolunteerModel } from "@/lib/models/tech-volunteer";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: NextRequest, { params }: Params) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await connectToDatabase();

  const deleted = await TechVolunteerModel.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: "Tech volunteer not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
