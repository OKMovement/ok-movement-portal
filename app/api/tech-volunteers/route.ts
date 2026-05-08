import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { isPhoneValid } from "@/lib/phone-validation";
import { AdminUserModel } from "@/lib/models/admin-user";
import { TechVolunteerModel } from "@/lib/models/tech-volunteer";
import {
  sendTechVolunteerAdminNotificationEmail,
  sendTechVolunteerSubmissionEmail,
} from "@/lib/server/mailer";
import {
  AVAILABILITY_OPTIONS,
  DIASPORA_COUNTRIES,
  EXPERIENCE_LEVELS,
  NIGERIAN_STATES,
  VOLUNTEER_ROLES,
} from "../../../lib/tech-volunteers-data";

const roleIds = new Set(VOLUNTEER_ROLES.map((role) => role.id));
const roleLabelById = new Map(VOLUNTEER_ROLES.map((role) => [role.id, role.title]));
const stateOptions = new Set(NIGERIAN_STATES);
const countryOptions = new Set(DIASPORA_COUNTRIES);
const experienceOptions = new Set(EXPERIENCE_LEVELS);
const availabilityOptions = new Set(AVAILABILITY_OPTIONS);

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const techVolunteerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name is required."),
    email: z.string().trim().email("A valid email address is required."),
    phone: z.string().trim().min(7, "Phone number is required."),
    state: z.string().trim().optional(),
    isDiaspora: z.boolean().optional().default(false),
    country: z.string().trim().optional(),
    primaryRole: z.string().trim().min(1, "Primary role is required."),
    experience: z.string().trim().min(1, "Experience level is required."),
    availability: z.string().trim().optional(),
    portfolioUrl: z.string().trim().optional(),
    linkedinUrl: z.string().trim().optional(),
    motivation: z.string().trim().max(2000, "Motivation must be 2000 characters or less.").optional(),
    consent: z.boolean().optional().default(false),
    secondarySkills: z.array(z.string().trim()).optional().default([]),
  })
  .superRefine((payload, ctx) => {
    if (!isPhoneValid(payload.phone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: "Please enter a valid phone number (include country code).",
      });
    }

    if (!roleIds.has(payload.primaryRole)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["primaryRole"],
        message: "Please select a valid primary role.",
      });
    }

    if (!experienceOptions.has(payload.experience)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["experience"],
        message: "Please select a valid experience level.",
      });
    }

    if (payload.availability && !availabilityOptions.has(payload.availability)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["availability"],
        message: "Please select a valid availability option.",
      });
    }

    if (payload.isDiaspora) {
      if (!payload.country) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["country"],
          message: "Country is required for diaspora volunteers.",
        });
      } else if (!countryOptions.has(payload.country)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["country"],
          message: "Please select a valid country option.",
        });
      }
    } else if (!payload.state) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["state"],
        message: "State is required for volunteers in Nigeria.",
      });
    } else if (!stateOptions.has(payload.state)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["state"],
        message: "Please select a valid Nigerian state.",
      });
    }

    if (!payload.consent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["consent"],
        message: "Consent is required before submitting.",
      });
    }

    const normalizedSecondary = payload.secondarySkills
      .map((value) => value.trim())
      .filter(Boolean);

    for (const skill of normalizedSecondary) {
      if (!roleIds.has(skill)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["secondarySkills"],
          message: "One or more secondary skills are invalid.",
        });
        break;
      }
    }

    if (new Set(normalizedSecondary).size !== normalizedSecondary.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["secondarySkills"],
        message: "Duplicate secondary skills are not allowed.",
      });
    }

    if (payload.portfolioUrl && !isValidHttpUrl(payload.portfolioUrl)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["portfolioUrl"],
        message: "Portfolio URL must start with http:// or https://",
      });
    }

    if (payload.linkedinUrl && !isValidHttpUrl(payload.linkedinUrl)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["linkedinUrl"],
        message: "LinkedIn/GitHub URL must start with http:// or https://",
      });
    }
  });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = techVolunteerSchema.parse(body);

    const email = payload.email.trim().toLowerCase();
    const fullName = payload.fullName.trim();
    const phone = payload.phone.trim();
    const state = payload.isDiaspora ? undefined : payload.state?.trim() || undefined;
    const country = payload.isDiaspora ? payload.country?.trim() || undefined : undefined;
    const secondarySkills = payload.secondarySkills
      .map((value) => value.trim())
      .filter(Boolean);
    const primaryRoleLabel = roleLabelById.get(payload.primaryRole) ?? payload.primaryRole;
    const secondarySkillLabels = secondarySkills.map(
      (skill) => roleLabelById.get(skill) ?? skill,
    );
    const availability = payload.availability?.trim() || undefined;
    const portfolioUrl = payload.portfolioUrl?.trim() || undefined;
    const linkedinUrl = payload.linkedinUrl?.trim() || undefined;
    const motivation = payload.motivation?.trim() || undefined;

    await connectToDatabase();

    const existingVolunteer = await TechVolunteerModel.exists({ email });
    if (existingVolunteer) {
      return NextResponse.json(
        { error: "This email has already been used for a tech volunteer application." },
        { status: 409 },
      );
    }

    await TechVolunteerModel.create({
      fullName,
      email,
      phone,
      state,
      isDiaspora: payload.isDiaspora,
      country,
      primaryRole: payload.primaryRole,
      secondarySkills,
      experience: payload.experience,
      availability,
      portfolioUrl,
      linkedinUrl,
      motivation,
      consent: payload.consent,
    });

    try {
      await sendTechVolunteerSubmissionEmail({
        fullName,
        email,
        primaryRole: primaryRoleLabel,
        isDiaspora: payload.isDiaspora,
        state,
        country,
      });
    } catch (emailError) {
      console.error("Failed to send tech volunteer confirmation email:", emailError);
    }

    try {
      const admins = await AdminUserModel.find({})
        .select("email")
        .lean();

      const adminEmails = admins
        .map((admin) => String(admin.email ?? "").trim().toLowerCase())
        .filter(Boolean);

      await sendTechVolunteerAdminNotificationEmail({
        adminEmails,
        fullName,
        email,
        phone,
        primaryRole: primaryRoleLabel,
        secondarySkills: secondarySkillLabels,
        experience: payload.experience,
        availability,
        isDiaspora: payload.isDiaspora,
        state,
        country,
        portfolioUrl,
        linkedinUrl,
        motivation,
      });
    } catch (adminEmailError) {
      console.error("Failed to send tech volunteer admin notification:", adminEmailError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return NextResponse.json({ error: firstIssue?.message ?? "Invalid submission data." }, { status: 400 });
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      Number((error as { code?: unknown }).code) === 11000
    ) {
      return NextResponse.json(
        { error: "This email has already been used for a tech volunteer application." },
        { status: 409 },
      );
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

    console.error("Failed to create tech volunteer application:", error);
    return NextResponse.json({ error: "Unable to submit application right now." }, { status: 500 });
  }
}
