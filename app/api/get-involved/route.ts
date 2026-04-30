import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AdminUserModel } from "@/lib/models/admin-user";
import { MemberModel } from "@/lib/models/member";
import {
  sendDonationAdminNotificationEmail,
  sendMemberWelcomeEmail,
} from "@/lib/server/mailer";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      engagement?: string;
      isDiaspora?: boolean;
      country?: string;
      votingState?: string;
      votingLga?: string;
      votingWard?: string;
    };

    const name = payload.name?.trim();
    const email = payload.email?.trim().toLowerCase();
    const phone = payload.phone?.trim();
    const engagement = payload.engagement?.trim();
    const isDiaspora = Boolean(payload.isDiaspora);
    const country = payload.country?.trim() || undefined;
    const votingState = payload.votingState?.trim() || undefined;
    const votingLga = payload.votingLga?.trim() || undefined;
    const votingWard = payload.votingWard?.trim() || undefined;

    if (!name || !email || !phone || !engagement) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (isDiaspora && !country) {
      return NextResponse.json({ error: "Country is required for diaspora users." }, { status: 400 });
    }

    if (!isDiaspora && (!votingState || !votingLga || !votingWard)) {
      return NextResponse.json(
        { error: "Voting state, LGA and ward are required for local users." },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const existingMember = await MemberModel.exists({ email });
    if (existingMember) {
      return NextResponse.json({ error: "You are already registered." }, { status: 409 });
    }

    await MemberModel.create({
      name,
      email,
      phone,
      engagement,
      isDiaspora,
      country,
      votingState,
      votingLga,
      votingWard,
    });

    try {
      await sendMemberWelcomeEmail({ name, email, engagement });
    } catch (emailError) {
      // Email delivery should not block successful registration persistence.
      console.error("Failed to send get involved welcome email:", emailError);
    }

    if (/donate/i.test(engagement)) {
      try {
        const admins = await AdminUserModel.find({})
          .select("email")
          .lean();

        const adminEmails = admins
          .map((admin) => String(admin.email ?? "").trim().toLowerCase())
          .filter(Boolean);

        await sendDonationAdminNotificationEmail({
          adminEmails,
          name,
          email,
          phone,
          engagement,
          isDiaspora,
          country,
          votingState,
          votingLga,
          votingWard,
        });
      } catch (adminEmailError) {
        console.error("Failed to send donation admin notification email:", adminEmailError);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to create get involved member:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      Number((error as { code?: unknown }).code) === 11000
    ) {
      return NextResponse.json({ error: "You are already registered." }, { status: 409 });
    }

    const message = error instanceof Error ? error.message : String(error);
    const isDatabaseIssue =
      /mongo|mongoose|econn|enotfound|timed out|server selection|querysrv/i.test(message);

    if (isDatabaseIssue) {
      return NextResponse.json(
        { error: "Registration service is temporarily unavailable. Please try again shortly." },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: "Unable to submit registration right now." }, { status: 500 });
  }
}
