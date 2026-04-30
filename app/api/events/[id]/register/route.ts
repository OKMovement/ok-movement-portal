import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { EventModel } from "@/lib/models/event";
import { EventRegistrationModel } from "@/lib/models/event-registration";
import { sendEventRegistrationConfirmationEmail } from "@/lib/server/mailer";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;

  const body = (await request.json()) as {
    name?: string;
    email?: string;
    phone?: string;
    state?: string;
    lga?: string;
    notes?: string;
  };

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const phone = body.phone?.trim() || undefined;

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  await connectToDatabase();

  const event = await EventModel.findById(id).lean();
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  if (!event.registrationOpen) {
    return NextResponse.json({ error: "Registration is closed for this event." }, { status: 400 });
  }

  const existingCount = await EventRegistrationModel.countDocuments({ eventId: event._id });
  if (existingCount >= event.capacity) {
    return NextResponse.json({ error: "This event has reached capacity." }, { status: 400 });
  }

  try {
    const registration = await EventRegistrationModel.create({
      eventId: event._id,
      name,
      email,
      phone,
      state: body.state?.trim() || undefined,
      lga: body.lga?.trim() || undefined,
      notes: body.notes?.trim() || undefined,
    });

    const eventTime = [event.startTime, event.endTime].filter(Boolean).join(" - ");
    const venueOrLink = event.address?.trim() || event.venue?.trim() || "To be announced";
    sendEventRegistrationConfirmationEmail({
      name,
      email,
      eventName: event.title,
      eventDate: event.date,
      eventTime: eventTime || "To be announced",
      venueOrLink,
    }).catch((mailError) => {
      console.error("Failed to send event registration confirmation email:", mailError);
    });

    return NextResponse.json({
      ok: true,
      registration: {
        id: String(registration._id),
        name: registration.name,
        email: registration.email,
      },
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: unknown }).code === 11000
    ) {
      return NextResponse.json(
        { error: "You are already registered for this event with this email." },
        { status: 409 },
      );
    }

    console.error("Failed to register event attendee:", error);
    return NextResponse.json({ error: "Unable to complete registration." }, { status: 500 });
  }
}
