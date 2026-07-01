import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ContactSubmissionModel } from "@/lib/models/contact-submission";
import { PvcComplaintModel } from "@/lib/models/pvc-complaint";
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
  const source = request.nextUrl.searchParams.get("source") ?? "contact";

  if (source !== "contact" && source !== "complaint") {
    return NextResponse.json({ error: "Invalid submission source." }, { status: 400 });
  }

  await connectToDatabase();

  const deleted =
    source === "complaint"
      ? await PvcComplaintModel.findByIdAndDelete(id)
      : await ContactSubmissionModel.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
