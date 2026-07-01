import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { EventModel } from "@/lib/models/event";
import { EventRegistrationModel } from "@/lib/models/event-registration";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await connectToDatabase();

  const event = await EventModel.findById(id).lean();
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  const registrations = await EventRegistrationModel.find({ eventId: event._id })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    event: {
      id: String(event._id),
      title: event.title,
      date: event.date,
      venue: event.venue,
      city: event.city,
      state: event.state,
    },
    registrations: registrations.map((registration) => ({
      id: String(registration._id),
      name: registration.name,
      email: registration.email,
      phone: registration.phone ?? null,
      locationType: registration.locationType ?? "nigeria",
      country: registration.country ?? null,
      state: registration.state ?? null,
      lga: registration.lga ?? null,
      address: registration.address ?? null,
      notes: registration.notes ?? null,
      createdAt: registration.createdAt,
    })),
  });
}
