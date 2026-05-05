import Link from "next/link";
import { redirect } from "next/navigation";
import BulkNotificationsManager from "@/components/admin/bulk-notifications-manager";
import { getCurrentAdminUser } from "@/lib/server/admin-guard";

export default async function AdminBulkNotificationsPage() {
  const admin = await getCurrentAdminUser();

  if (!admin) {
    redirect("/admin/sign-in");
  }

  return (
    <>
      <header className="rounded-[8px] border border-black/10 bg-white px-6 py-6 shadow-[0_22px_38px_-24px_rgb(0_0_0/0.34)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red">Notifications</p>
            <h2 className="mt-3 text-3xl font-semibold text-brand-black">Email Notifications</h2>
            <p className="mt-2 text-sm text-black/65">
              Send campaign updates by email. Super admins can send to segmented audiences.
            </p>
          </div>
          <Link
            href="/admin/dashboard/notifications/history"
            className="inline-flex min-h-10 items-center justify-center rounded-[8px] bg-brand-black px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-brand-green"
          >
            View Past Notifications
          </Link>
        </div>
      </header>
      <BulkNotificationsManager />
    </>
  );
}
