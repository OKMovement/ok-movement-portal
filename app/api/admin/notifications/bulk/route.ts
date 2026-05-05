import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { AdminNotificationModel } from "@/lib/models/admin-notification";
import { AdminUserModel } from "@/lib/models/admin-user";
import { MemberModel } from "@/lib/models/member";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";
import { sendBulkNotificationEmail } from "@/lib/server/mailer";

const audienceValues = ["members", "admins", "members_diaspora", "members_by_state", "specific_email"] as const;

const payloadSchema = z.object({
  audience: z.enum(audienceValues),
  state: z.string().trim().min(1).max(120).optional(),
  specificEmail: z.string().trim().email("Enter a valid email address.").optional(),
  subject: z.string().trim().min(3, "Subject must be at least 3 characters.").max(160),
  message: z.string().trim().min(10, "Message must be at least 10 characters.").max(10000),
});

type Recipient = {
  email: string;
  name?: string;
};

function normalizeEmail(input: string) {
  return input.trim().toLowerCase();
}

function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function uniqueRecipients(items: Recipient[]) {
  const seen = new Set<string>();
  const result: Recipient[] = [];

  for (const item of items) {
    const email = normalizeEmail(item.email);
    if (!email || seen.has(email)) continue;
    seen.add(email);
    result.push({
      email,
      name: item.name?.trim() || undefined,
    });
  }

  return result;
}

export async function GET(request: NextRequest) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (admin.role !== "super") {
    return NextResponse.json({
      currentAdmin: {
        id: admin.id,
        role: admin.role,
      },
      capabilities: {
        canBulk: false,
      },
      counts: {
        members: 0,
        admins: 0,
        membersDiaspora: 0,
      },
      states: [],
    });
  }

  await connectToDatabase();

  const [membersCount, adminsCount, membersDiasporaCount, membersByState] = await Promise.all([
    MemberModel.countDocuments({}),
    AdminUserModel.countDocuments({}),
    MemberModel.countDocuments({ isDiaspora: true }),
    MemberModel.aggregate<{ _id: string; count: number }>([
      { $match: { isDiaspora: false } },
      { $project: { state: { $toLower: { $trim: { input: { $ifNull: ["$votingState", ""] } } } } } },
      { $match: { state: { $ne: "" } } },
      { $group: { _id: "$state", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  ]);

  return NextResponse.json({
    currentAdmin: {
      id: admin.id,
      role: admin.role,
    },
    capabilities: {
      canBulk: true,
    },
    counts: {
      members: membersCount,
      admins: adminsCount,
      membersDiaspora: membersDiasporaCount,
    },
    states: membersByState.map((item) => ({
      state: item._id,
      count: item.count,
    })),
  });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const payload = payloadSchema.parse(body);

    if (payload.audience === "members_by_state" && !payload.state) {
      return NextResponse.json({ error: "State is required when audience is members by state." }, { status: 400 });
    }

    if (payload.audience === "specific_email" && !payload.specificEmail) {
      return NextResponse.json({ error: "A specific email address is required." }, { status: 400 });
    }

    if (admin.role !== "super" && payload.audience !== "specific_email") {
      return NextResponse.json(
        { error: "Only super admins can send to groups. Use specific email instead." },
        { status: 403 },
      );
    }

    let recipients: Recipient[] = [];

    if (payload.audience === "specific_email") {
      recipients = [{ email: payload.specificEmail ?? "" }];
    } else {
      await connectToDatabase();

      if (payload.audience === "admins") {
        const admins = await AdminUserModel.find({})
          .select("name email")
          .lean();
        recipients = admins.map((item) => ({
          email: item.email,
          name: item.name,
        }));
      }

      if (payload.audience === "members") {
        const members = await MemberModel.find({})
          .select("name email")
          .lean();
        recipients = members.map((item) => ({
          email: item.email,
          name: item.name,
        }));
      }

      if (payload.audience === "members_diaspora") {
        const members = await MemberModel.find({ isDiaspora: true })
          .select("name email")
          .lean();
        recipients = members.map((item) => ({
          email: item.email,
          name: item.name,
        }));
      }

      if (payload.audience === "members_by_state") {
        const stateRegex = new RegExp(`^${escapeRegex(payload.state ?? "")}$`, "i");
        const members = await MemberModel.find({
          isDiaspora: false,
          votingState: { $regex: stateRegex },
        })
          .select("name email")
          .lean();

        recipients = members.map((item) => ({
          email: item.email,
          name: item.name,
        }));
      }
    }

    const unique = uniqueRecipients(recipients);

    if (unique.length === 0) {
      return NextResponse.json({ error: "No recipients found for this audience." }, { status: 400 });
    }

    const settled = await Promise.allSettled(
      unique.map((recipient) =>
        sendBulkNotificationEmail({
          to: recipient.email,
          recipientName: recipient.name,
          subject: payload.subject,
          message: payload.message,
          senderName: admin.name,
        }),
      ),
    );

    const failed = settled.filter((result) => result.status === "rejected").length;
    const delivered = unique.length - failed;

    await AdminNotificationModel.create({
      sentByAdminId: admin.id,
      sentByAdminName: admin.name,
      sentByAdminEmail: admin.email,
      audience: payload.audience,
      state: payload.state ?? undefined,
      specificEmail: payload.specificEmail ?? undefined,
      subject: payload.subject,
      message: payload.message,
      totalRecipients: unique.length,
      delivered,
      failed,
    });

    return NextResponse.json({
      ok: true,
      audience: payload.audience,
      state: payload.state ?? null,
      specificEmail: payload.specificEmail ?? null,
      totalRecipients: unique.length,
      delivered,
      failed,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return NextResponse.json({ error: firstIssue?.message ?? "Invalid payload." }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Unable to send notifications right now.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
