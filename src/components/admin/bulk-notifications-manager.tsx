"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

type Audience = "members" | "admins" | "members_diaspora" | "members_by_state" | "specific_email";
type AdminRole = "admin" | "super";

type NotificationMetadata = {
  currentAdmin: {
    id: string;
    role: AdminRole;
  };
  capabilities: {
    canBulk: boolean;
  };
  counts: {
    members: number;
    admins: number;
    membersDiaspora: number;
  };
  states: Array<{
    state: string;
    count: number;
  }>;
};

type SendResponse = {
  ok?: boolean;
  error?: string;
  delivered?: number;
  failed?: number;
  totalRecipients?: number;
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
  return "Specific Email Address";
}

export default function BulkNotificationsManager() {
  const [metadata, setMetadata] = useState<NotificationMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState("");

  const [audience, setAudience] = useState<Audience>("specific_email");
  const [selectedState, setSelectedState] = useState("");
  const [specificEmail, setSpecificEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  async function loadMetadata() {
    setLoading(true);
    setLoadingError("");
    try {
      const response = await fetch("/api/admin/notifications/bulk", { cache: "no-store" });
      const data = (await response.json().catch(() => null)) as
        | (NotificationMetadata & { error?: string })
        | null;

      if (!response.ok) {
        setLoadingError(data?.error ?? "Unable to load notification audience details.");
        setLoading(false);
        return;
      }

      const nextMetadata = data as NotificationMetadata;
      setMetadata(nextMetadata);
      setAudience(nextMetadata.capabilities.canBulk ? "members" : "specific_email");
      setLoading(false);
    } catch {
      setLoadingError("Unable to load notification audience details.");
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMetadata();
  }, []);

  useEffect(() => {
    if (!metadata || audience !== "members_by_state") return;
    if (!selectedState && metadata.states.length > 0) {
      setSelectedState(metadata.states[0].state);
      return;
    }

    const stillExists = metadata.states.some((item) => item.state === selectedState);
    if (!stillExists) {
      setSelectedState(metadata.states[0]?.state ?? "");
    }
  }, [audience, metadata, selectedState]);

  const estimatedRecipients = useMemo(() => {
    if (!metadata) return 0;

    if (audience === "specific_email") {
      return specificEmail.trim() ? 1 : 0;
    }

    if (audience === "members") return metadata.counts.members;
    if (audience === "admins") return metadata.counts.admins;
    if (audience === "members_diaspora") return metadata.counts.membersDiaspora;

    const match = metadata.states.find((item) => item.state === selectedState);
    return match?.count ?? 0;
  }, [audience, metadata, selectedState, specificEmail]);

  async function handleSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (audience === "members_by_state" && !selectedState) {
      setSubmitError("Please select a state.");
      return;
    }

    if (audience === "specific_email" && !specificEmail.trim()) {
      setSubmitError("Please enter a specific email address.");
      return;
    }

    if (estimatedRecipients <= 0) {
      setSubmitError("No recipients found for this audience.");
      return;
    }

    const confirmText =
      audience === "specific_email"
        ? `Send this notification to ${specificEmail.trim()}?`
        : `Send this notification to ${estimatedRecipients.toLocaleString()} recipients?`;

    const confirmed = window.confirm(confirmText);
    if (!confirmed) {
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/admin/notifications/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience,
          state: audience === "members_by_state" ? selectedState : undefined,
          specificEmail: audience === "specific_email" ? specificEmail.trim() : undefined,
          subject,
          message,
        }),
      });

      const data = (await response.json().catch(() => null)) as SendResponse | null;

      if (!response.ok) {
        setSubmitError(data?.error ?? "Unable to send notification.");
        setSending(false);
        return;
      }

      const delivered = data?.delivered ?? 0;
      const failed = data?.failed ?? 0;

      setSubmitSuccess(`Sent to ${delivered.toLocaleString()} recipient${delivered === 1 ? "" : "s"}${failed ? `, ${failed} failed.` : "."}`);
      setMessage("");
      if (audience !== "specific_email") {
        setSpecificEmail("");
      }
      setSending(false);
    } catch {
      setSubmitError("Unable to send notification.");
      setSending(false);
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] border border-black/10 bg-white p-6 shadow-[0_20px_34px_-24px_rgb(0_0_0/0.3)]">
        {loadingError ? <p className="text-sm text-brand-red">{loadingError}</p> : null}

        {loading ? (
          <div className="inline-flex items-center gap-2 text-sm text-black/60">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading notification options...
          </div>
        ) : metadata ? (
          <>
            {metadata.capabilities.canBulk ? (
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[8px] border border-black/10 bg-[#f7f7f4] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Members</p>
                  <p className="mt-2 text-2xl font-semibold text-brand-black">
                    {metadata.counts.members.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-[8px] border border-black/10 bg-[#f7f7f4] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Admins</p>
                  <p className="mt-2 text-2xl font-semibold text-brand-black">
                    {metadata.counts.admins.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-[8px] border border-black/10 bg-[#f7f7f4] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Diaspora Members</p>
                  <p className="mt-2 text-2xl font-semibold text-brand-black">
                    {metadata.counts.membersDiaspora.toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-[8px] border border-black/10 bg-[#f7f7f4] px-4 py-3 text-sm text-black/70">
                Your role can send email only to a specific address entered below.
              </div>
            )}

            <form onSubmit={handleSend} className="mt-6 grid gap-4">
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-black/60">Audience</span>
                <select
                  value={audience}
                  onChange={(event) => setAudience(event.target.value as Audience)}
                  className="min-h-11 rounded-[8px] border border-black/12 bg-white px-3 text-sm text-brand-black focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
                >
                  {metadata.capabilities.canBulk ? (
                    <>
                      <option value="members">Members only group</option>
                      <option value="admins">Admins only group</option>
                      <option value="members_by_state">Members by state</option>
                      <option value="members_diaspora">Members in diaspora</option>
                      <option value="specific_email">Specific email address</option>
                    </>
                  ) : (
                    <option value="specific_email">Specific email address</option>
                  )}
                </select>
              </label>

              {audience === "members_by_state" ? (
                <label className="grid gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-black/60">State</span>
                  <select
                    value={selectedState}
                    onChange={(event) => setSelectedState(event.target.value)}
                    className="min-h-11 rounded-[8px] border border-black/12 bg-white px-3 text-sm text-brand-black focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
                  >
                    {metadata.states.length === 0 ? <option value="">No states available</option> : null}
                    {metadata.states.map((item) => (
                      <option key={item.state} value={item.state}>
                        {formatStateLabel(item.state)} ({item.count.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              {audience === "specific_email" ? (
                <label className="grid gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-black/60">
                    Recipient Email
                  </span>
                  <input
                    value={specificEmail}
                    onChange={(event) => setSpecificEmail(event.target.value)}
                    type="email"
                    placeholder="name@example.com"
                    className="min-h-11 rounded-[8px] border border-black/12 bg-white px-3 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
                    required
                  />
                </label>
              ) : null}

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-black/60">Subject</span>
                <input
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Email subject"
                  maxLength={160}
                  className="min-h-11 rounded-[8px] border border-black/12 bg-white px-3 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
                  required
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-black/60">Message</span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={8}
                  placeholder="Type your notification message here..."
                  maxLength={10000}
                  className="rounded-[8px] border border-black/12 bg-white px-3 py-2.5 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
                  required
                />
              </label>

              <div className="rounded-[8px] border border-black/10 bg-[#f7f7f4] px-4 py-3 text-sm text-black/70">
                Target: <strong>{audienceLabel(audience)}</strong>
                {audience === "members_by_state" && selectedState
                  ? ` - ${formatStateLabel(selectedState)}`
                  : ""}
                {audience === "specific_email" && specificEmail.trim()
                  ? ` - ${specificEmail.trim()}`
                  : ""}
                {" | "}
                Estimated recipients: <strong>{estimatedRecipients.toLocaleString()}</strong>
              </div>

              {submitError ? <p className="text-sm text-brand-red">{submitError}</p> : null}
              {submitSuccess ? <p className="text-sm text-brand-green">{submitSuccess}</p> : null}

              <button
                type="submit"
                disabled={sending || loading || estimatedRecipients <= 0}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-brand-black px-5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-brand-green disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Send notification
              </button>
            </form>
          </>
        ) : null}
      </section>
    </div>
  );
}
