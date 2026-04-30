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

  const registrationsCount = await EventRegistrationModel.countDocuments({ eventId: event._id });

  return NextResponse.json({
    event: {
      id: String(event._id),
      title: event.title,
      type: event.type,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      city: event.city,
      state: event.state,
      lga: event.lga,
      venue: event.venue,
      address: event.address,
      flierImageUrl: event.flierImageUrl ?? "",
      why: event.why,
      capacity: event.capacity,
      registrationOpen: event.registrationOpen,
      registrationsCount,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    },
  });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json()) as {
    title?: string;
    type?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    city?: string;
    state?: string;
    lga?: string;
    venue?: string;
    address?: string;
    flierImageUrl?: string;
    why?: string;
    capacity?: number;
    registrationOpen?: boolean;
  };

  await connectToDatabase();

  const event = await EventModel.findById(id);
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  if (typeof body.title === "string") event.title = body.title.trim();
  if (typeof body.type === "string") event.type = body.type.trim();
  if (typeof body.date === "string") event.date = body.date.trim();
  if (typeof body.startTime === "string") event.startTime = body.startTime.trim();
  if (typeof body.endTime === "string") event.endTime = body.endTime.trim();
  if (typeof body.city === "string") event.city = body.city.trim();
  if (typeof body.state === "string") event.state = body.state.trim();
  if (typeof body.lga === "string") event.lga = body.lga.trim();
  if (typeof body.venue === "string") event.venue = body.venue.trim();
  if (typeof body.address === "string") event.address = body.address.trim();
  if (typeof body.flierImageUrl === "string") event.flierImageUrl = body.flierImageUrl.trim();
  if (typeof body.why === "string") event.why = body.why.trim();
  if (typeof body.capacity === "number" && Number.isFinite(body.capacity) && body.capacity > 0) {
    event.capacity = body.capacity;
  }
  if (typeof body.registrationOpen === "boolean") {
    event.registrationOpen = body.registrationOpen;
  }

  await event.save();

  const registrationsCount = await EventRegistrationModel.countDocuments({ eventId: event._id });

  return NextResponse.json({
    ok: true,
    event: {
      id: String(event._id),
      title: event.title,
      type: event.type,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      city: event.city,
      state: event.state,
      lga: event.lga,
      venue: event.venue,
      address: event.address,
      flierImageUrl: event.flierImageUrl ?? "",
      why: event.why,
      capacity: event.capacity,
      registrationOpen: event.registrationOpen,
      registrationsCount,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    },
  });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await connectToDatabase();

  const event = await EventModel.findByIdAndDelete(id);
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  await EventRegistrationModel.deleteMany({ eventId: event._id });

  return NextResponse.json({ ok: true });
}
