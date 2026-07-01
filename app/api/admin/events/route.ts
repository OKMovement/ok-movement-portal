import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { EventModel } from "@/lib/models/event";
import { EventRegistrationModel } from "@/lib/models/event-registration";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";

export async function GET(request: NextRequest) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const events = await EventModel.find({}).sort({ date: 1, startTime: 1 }).lean();
  const eventIds = events.map((event) => event._id);

  const registrationCounts = await EventRegistrationModel.aggregate<{ _id: string; count: number }>([
    { $match: { eventId: { $in: eventIds } } },
    { $group: { _id: "$eventId", count: { $sum: 1 } } },
  ]);

  const countMap = new Map(registrationCounts.map((item) => [String(item._id), item.count]));

  return NextResponse.json({
    events: events.map((event) => ({
      id: String(event._id),
      title: event.title,
      type: event.type,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      country: event.country ?? "",
      city: event.city,
      state: event.state,
      lga: event.lga ?? "",
      venue: event.venue,
      address: event.address,
      flierImageUrl: event.flierImageUrl ?? "",
      why: event.why,
      capacity: event.capacity,
      registrationOpen: event.registrationOpen,
      registrationsCount: countMap.get(String(event._id)) ?? 0,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    })),
  });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    type?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    country?: string;
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

  const requiredFields = [
    body.title,
    body.type,
    body.date,
    body.startTime,
    body.endTime,
    body.country,
    body.city,
    body.state,
    body.venue,
    body.address,
    body.flierImageUrl,
    body.why,
  ];

  if (requiredFields.some((value) => !String(value ?? "").trim())) {
    return NextResponse.json({ error: "Please fill all event fields." }, { status: 400 });
  }

  const capacity = Number(body.capacity);
  if (!Number.isFinite(capacity) || capacity < 1) {
    return NextResponse.json({ error: "Capacity must be at least 1." }, { status: 400 });
  }

  await connectToDatabase();

  const event = await EventModel.create({
    title: body.title!.trim(),
    type: body.type!.trim(),
    date: body.date!.trim(),
    startTime: body.startTime!.trim(),
    endTime: body.endTime!.trim(),
    country: body.country!.trim(),
    city: body.city!.trim(),
    state: body.state!.trim(),
    lga: body.lga?.trim() || "",
    venue: body.venue!.trim(),
    address: body.address!.trim(),
    flierImageUrl: body.flierImageUrl!.trim(),
    why: body.why!.trim(),
    capacity,
    registrationOpen: body.registrationOpen ?? true,
    createdBy: admin.id,
  });

  return NextResponse.json({
    ok: true,
    event: {
      id: String(event._id),
      title: event.title,
      type: event.type,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      country: event.country ?? "",
      city: event.city,
      state: event.state,
      lga: event.lga ?? "",
      venue: event.venue,
      address: event.address,
      flierImageUrl: event.flierImageUrl ?? "",
      why: event.why,
      capacity: event.capacity,
      registrationOpen: event.registrationOpen,
      registrationsCount: 0,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    },
  });
}
