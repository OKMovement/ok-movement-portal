"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";

type Audience = "members" | "admins" | "members_diaspora" | "members_by_state" | "specific_email";

type NotificationItem = {
  id: string;
  audience: Audience;
  state: string | null;
  specificEmail: string | null;
  subject: string;
  message: string;
  totalRecipients: number;
  delivered: number;
  failed: number;
  createdAt: string | Date;
};

function formatStateLabel(state: string) {
  return state
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function audienceLabel(audience: Audience) {
  if (audience === "members") return "Members Only";
  if (audience === "admins") return "Admins Only";
  if (audience === "members_diaspora") return "Members in Diaspora";
  if (audience === "members_by_state") return "Members by State";
  return "Specific Email";
}

function targetLabel(item: NotificationItem) {
  if (item.audience === "members_by_state" && item.state) {
    return `${audienceLabel(item.audience)} - ${formatStateLabel(item.state)}`;
  }
  if (item.audience === "specific_email" && item.specificEmail) {
    return `${audienceLabel(item.audience)} - ${item.specificEmail}`;
  }
  return audienceLabel(item.audience);
}

export default function NotificationsHistoryManager() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadHistory() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/notifications/history", { cache: "no-store" });
      const data = (await response.json().catch(() => null)) as
        | { error?: string; notifications?: NotificationItem[] }
        | null;

      if (!response.ok) {
        setError(data?.error ?? "Unable to load notification history.");
        setLoading(false);
        return;
      }

      setNotifications(data?.notifications ?? []);
      setLoading(false);
    } catch {
      setError("Unable to load notification history.");
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  const stats = useMemo(() => {
    return notifications.reduce(
      (acc, item) => {
        acc.total += 1;
        acc.recipients += item.totalRecipients;
        return acc;
      },
      { total: 0, recipients: 0 },
    );
  }, [notifications]);

  return (
    <section className="rounded-[8px] border border-black/10 bg-white p-6 shadow-[0_20px_34px_-24px_rgb(0_0_0/0.3)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-brand-black">Sent Notifications</h3>
          <p className="mt-1 text-sm text-black/60">
            {stats.total.toLocaleString()} notification{stats.total === 1 ? "" : "s"} sent | {" "}
            {stats.recipients.toLocaleString()} total recipient{stats.recipients === 1 ? "" : "s"}
          </p>
        </div>
        <button
          type="button"
          onClick={loadHistory}
          disabled={loading}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] border border-black/15 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/70 transition hover:border-brand-green hover:text-brand-green disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </button>
      </div>

      {error ? <p className="text-sm text-brand-red">{error}</p> : null}

      {loading ? (
        <div className="inline-flex items-center gap-2 text-sm text-black/60">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading history...
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-sm text-black/60">No notifications sent yet.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <article key={item.id} className="rounded-[8px] border border-black/10 bg-[#f7f7f4] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-base font-semibold text-brand-black">{item.subject}</h4>
                <p className="text-xs text-black/55">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.13em] text-black/55">{targetLabel(item)}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-black/75">{item.message}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-black/60">
                <span>Total: {item.totalRecipients.toLocaleString()}</span>
                <span>Delivered: {item.delivered.toLocaleString()}</span>
                <span>Failed: {item.failed.toLocaleString()}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
