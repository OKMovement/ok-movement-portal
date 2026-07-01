import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { EventModel } from "@/lib/models/event";
import { EventRegistrationModel } from "@/lib/models/event-registration";

export async function GET() {
  await connectToDatabase();

  const todayIso = new Date().toISOString().slice(0, 10);
  const events = await EventModel.find({ date: { $gte: todayIso } })
    .sort({ date: 1, startTime: 1 })
    .lean();

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
    })),
  });
}
