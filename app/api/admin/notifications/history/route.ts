import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AdminNotificationModel } from "@/lib/models/admin-notification";
import { getAdminUserFromRequest } from "@/lib/server/api-auth";

export async function GET(request: NextRequest) {
  const admin = await getAdminUserFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const notifications = await AdminNotificationModel.find({ sentByAdminId: admin.id })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  return NextResponse.json({
    notifications: notifications.map((item) => ({
      id: String(item._id),
      sentByAdminId: String(item.sentByAdminId),
      sentByAdminName: item.sentByAdminName,
      sentByAdminEmail: item.sentByAdminEmail,
      audience: item.audience,
      state: item.state ?? null,
      specificEmail: item.specificEmail ?? null,
      subject: item.subject,
      message: item.message,
      totalRecipients: item.totalRecipients,
      delivered: item.delivered,
      failed: item.failed,
      createdAt: item.createdAt,
    })),
  });
}
