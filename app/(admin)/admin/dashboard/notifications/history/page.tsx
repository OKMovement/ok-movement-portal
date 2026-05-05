import Link from "next/link";
import NotificationsHistoryManager from "@/components/admin/notifications-history-manager";

export default function AdminNotificationsHistoryPage() {
  return (
    <>
      <header className="rounded-[8px] border border-black/10 bg-white px-6 py-6 shadow-[0_22px_38px_-24px_rgb(0_0_0/0.34)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red">Notifications</p>
            <h2 className="mt-3 text-3xl font-semibold text-brand-black">Past Notifications</h2>
            <p className="mt-2 text-sm text-black/65">All email notifications you have sent.</p>
          </div>
          <Link
            href="/admin/dashboard/notifications"
            className="inline-flex min-h-10 items-center justify-center rounded-[8px] border border-black/15 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/70 transition hover:border-brand-green hover:text-brand-green"
          >
            Back to Send
          </Link>
        </div>
      </header>
      <NotificationsHistoryManager />
    </>
  );
}
