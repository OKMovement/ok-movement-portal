import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { DIASPORA_ENGAGEMENT } from "@/lib/diaspora";
import { MemberModel } from "@/lib/models/member";
import { isNigerianPhoneNumber, isPhoneValid } from "@/lib/phone-validation";
import { sendDiasporaWelcomeEmail } from "@/lib/server/mailer";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      country?: string;
    };

    const name = payload.name?.trim();
    const email = payload.email?.trim().toLowerCase();
    const phone = payload.phone?.trim();
    const country = payload.country?.trim();

    if (!name || !email || !phone || !country) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!isPhoneValid(phone)) {
      return NextResponse.json({ error: "Please enter a valid international phone number." }, { status: 400 });
    }

    if (isNigerianPhoneNumber(phone)) {
      return NextResponse.json(
        {
          error: "Nigerian phone numbers should register through the member registration page.",
          code: "nigerian_phone",
          redirect: "/home/get-involved",
        },
        { status: 400 },
      );
    }

    await connectToDatabase();

    if (await MemberModel.exists({ email })) {
      return NextResponse.json({ error: "You are already registered." }, { status: 409 });
    }

    await MemberModel.create({
      name,
      email,
      phone,
      country,
      isDiaspora: true,
      engagement: DIASPORA_ENGAGEMENT,
    });

    try {
      await sendDiasporaWelcomeEmail({ name, email, country });
    } catch (emailError) {
      // A mail provider problem should not undo a successful registration.
      console.error("Failed to send diaspora welcome email:", emailError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to create diaspora registration:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      Number((error as { code?: unknown }).code) === 11000
    ) {
      return NextResponse.json({ error: "You are already registered." }, { status: 409 });
    }

    return NextResponse.json({ error: "Unable to submit your registration right now." }, { status: 500 });
  }
}
