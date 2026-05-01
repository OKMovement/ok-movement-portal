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
      donationType?: string;
      donationAmount?: string;
      donationMaterial?: string;
      donationMaterialOther?: string;
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
    const rawDonationType = payload.donationType?.trim().toLowerCase();
    const donationType =
      rawDonationType === "cash" || rawDonationType === "materials" ? rawDonationType : undefined;
    const rawDonationAmount = payload.donationAmount?.trim();
    const donationAmountNumeric = rawDonationAmount
      ? Number(rawDonationAmount.replaceAll(",", ""))
      : undefined;
    const rawDonationMaterial = payload.donationMaterial?.trim().toLowerCase();
    const donationMaterial =
      rawDonationMaterial === "campaign-flyers" ||
      rawDonationMaterial === "campaign-cap" ||
      rawDonationMaterial === "campaign-tshirt" ||
      rawDonationMaterial === "campaign-wraist-band" ||
      rawDonationMaterial === "other"
        ? rawDonationMaterial
        : undefined;
    const donationMaterialOther = payload.donationMaterialOther?.trim() || undefined;
    const isDiaspora = Boolean(payload.isDiaspora);
    const country = payload.country?.trim() || undefined;
    const votingState = payload.votingState?.trim() || undefined;
    const votingLga = payload.votingLga?.trim() || undefined;
    const votingWard = payload.votingWard?.trim() || undefined;

    if (!name || !email || !phone || !engagement) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const isDonation = /donate/i.test(engagement);

    if (isDonation && !donationType) {
      return NextResponse.json(
        { error: "Donation type must be either cash or materials." },
        { status: 400 },
      );
    }

    if (
      isDonation &&
      donationType === "cash" &&
      (!Number.isFinite(donationAmountNumeric) || (donationAmountNumeric ?? 0) <= 0)
    ) {
      return NextResponse.json({ error: "Please provide a valid donation amount." }, { status: 400 });
    }

    if (isDonation && donationType === "materials" && !donationMaterial) {
      return NextResponse.json(
        { error: "Please select a valid material type." },
        { status: 400 },
      );
    }

    if (isDonation && donationType === "materials" && donationMaterial === "other" && !donationMaterialOther) {
      return NextResponse.json({ error: "Please specify the material type." }, { status: 400 });
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
      donationType: isDonation ? donationType : undefined,
      donationAmount: isDonation && donationType === "cash" ? donationAmountNumeric : undefined,
      donationMaterial: isDonation && donationType === "materials" ? donationMaterial : undefined,
      donationMaterialOther:
        isDonation && donationType === "materials" && donationMaterial === "other"
          ? donationMaterialOther
          : undefined,
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
          donationType: isDonation ? donationType : undefined,
          donationAmount: isDonation && donationType === "cash" ? donationAmountNumeric : undefined,
          donationMaterial: isDonation && donationType === "materials" ? donationMaterial : undefined,
          donationMaterialOther:
            isDonation && donationType === "materials" && donationMaterial === "other"
              ? donationMaterialOther
              : undefined,
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
