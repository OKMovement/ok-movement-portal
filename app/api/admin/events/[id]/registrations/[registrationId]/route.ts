import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { EventRegistrationModel } from "@/lib/models/event-registration";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";

type Params = {
  params: Promise<{ id: string; registrationId: string }>;
};

export async function DELETE(request: NextRequest, { params }: Params) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, registrationId } = await params;

  await connectToDatabase();

  const registration = await EventRegistrationModel.findOneAndDelete({
    _id: registrationId,
    eventId: id,
  });

  if (!registration) {
    return NextResponse.json({ error: "Registration not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
