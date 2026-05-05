"use client";

import { useEffect, useState } from "react";
import { Copy, Loader2, Send, Trash2, X } from "lucide-react";

type SubmissionReply = {
  message: string;
  sentAt: string | Date;
  sentByAdminId: string;
  sentByAdminName: string;
  sentByAdminEmail: string;
};

type SupportSubmissionItem = {
  id: string;
  requestType: string;
  name: string;
  email: string;
  phone: string | null;
  region: string | null;
  subject: string;
  message: string;
  newsletter: boolean;
  createdAt: string | Date;
  replies?: SubmissionReply[];
  replyCount?: number;
  lastRepliedAt?: string | Date | null;
};

export default function SupportSubmissionsManager() {
  const [submissions, setSubmissions] = useState<SupportSubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<SupportSubmissionItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replyNotice, setReplyNotice] = useState("");

  async function loadSubmissions() {
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/support", { cache: "no-store" });
    const data = (await response.json().catch(() => null)) as
      | { submissions?: SupportSubmissionItem[]; error?: string }
      | null;

    if (!response.ok) {
      setError(data?.error ?? "Unable to fetch support submissions.");
      setLoading(false);
      return;
    }

    setSubmissions(data?.submissions ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadSubmissions();
  }, []);

  function defaultReplyFor(submission: SupportSubmissionItem) {
    const firstName = submission.name.trim().split(/\s+/)[0] || "there";
    return `Hello ${firstName},

Thank you for reaching out to the OK Movement.

`;
  }

  function handleSelectSubmission(submission: SupportSubmissionItem) {
    setSelected(submission);
    setCopiedEmail(false);
    setReplyNotice("");
    setError("");
    setReplyMessage(defaultReplyFor(submission));
  }

  async function handleCopyEmail(email: string) {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 1200);
    } catch {
      setError("Unable to copy email.");
    }
  }

  async function handleDeleteSubmission() {
    if (!selected) return;

    setDeleting(true);
    setError("");

    const response = await fetch(`/api/admin/support/${selected.id}`, { method: "DELETE" });
    const data = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setError(data?.error ?? "Unable to delete submission.");
      setDeleting(false);
      return;
    }

    setSubmissions((prev) => prev.filter((item) => item.id !== selected.id));
    setSelected(null);
    setDeleting(false);
  }

  async function handleSendReply() {
    if (!selected) return;

    const message = replyMessage.trim();
    if (message.length < 10) {
      setError("Reply message must be at least 10 characters.");
      return;
    }

    setSendingReply(true);
    setReplyNotice("");
    setError("");

    const response = await fetch(`/api/admin/support/${selected.id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = (await response.json().catch(() => null)) as
      | {
          error?: string;
          reply?: SubmissionReply;
          submission?: {
            id: string;
            replyCount: number;
            lastRepliedAt: string;
          };
        }
      | null;

    if (!response.ok || !data?.reply || !data.submission) {
      setError(data?.error ?? "Unable to send reply email.");
      setSendingReply(false);
      return;
    }

    const updatedSelected: SupportSubmissionItem = {
      ...selected,
      replies: [...(selected.replies ?? []), data.reply],
      replyCount: data.submission.replyCount,
      lastRepliedAt: data.submission.lastRepliedAt,
    };

    setSelected(updatedSelected);
    setSubmissions((prev) =>
      prev.map((item) => (item.id === selected.id ? { ...item, ...updatedSelected } : item)),
    );
    setReplyNotice("Reply email sent successfully.");
    setReplyMessage("");
    setSendingReply(false);
  }

  return (
    <>
      <section className="overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-[0_20px_34px_-24px_rgb(0_0_0/0.3)]">
        {error ? <p className="px-4 pt-4 text-sm text-brand-red">{error}</p> : null}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-[#f7f7f4] text-xs uppercase tracking-[0.16em] text-black/60">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Reply Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-black/60">
                    Loading support submissions...
                  </td>
                </tr>
              ) : submissions.length > 0 ? (
                submissions.map((submission) => (
                  <tr
                    key={submission.id}
                    onClick={() => handleSelectSubmission(submission)}
                    className="cursor-pointer border-t border-black/8 align-top text-sm text-brand-black transition hover:bg-[#f7f7f4]"
                  >
                    <td className="px-4 py-3 font-medium">{submission.name}</td>
                    <td className="px-4 py-3 text-black/70">{submission.email}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-[8px] bg-brand-green/10 px-2.5 py-1 text-xs font-semibold text-brand-green">
                        {submission.requestType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-black/70">{submission.subject}</td>
                    <td className="px-4 py-3 text-black/60">
                      {submission.createdAt ? new Date(submission.createdAt).toLocaleString() : "-"}
                    </td>
                    <td className="px-4 py-3 text-black/60">
                      {submission.lastRepliedAt ? (
                        <span className="rounded-[8px] bg-brand-green/10 px-2 py-1 text-xs font-semibold text-brand-green">
                          Replied ({submission.replyCount ?? 1})
                        </span>
                      ) : (
                        <span className="rounded-[8px] bg-black/8 px-2 py-1 text-xs font-semibold text-black/60">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-black/60">
                    No support submissions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <div className="w-full max-w-2xl rounded-[8px] border border-black/10 bg-white p-5 shadow-[0_26px_46px_-24px_rgb(0_0_0/0.5)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">
                  Support Submission
                </p>
                <h3 className="mt-1 text-xl font-semibold text-brand-black">{selected.subject}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-[8px] border border-black/10 p-1.5 text-black/65 transition hover:border-brand-red hover:text-brand-red"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Name</p>
                <p className="mt-1 text-brand-black">{selected.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Request Type</p>
                <p className="mt-1 text-brand-black">{selected.requestType}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Email</p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-brand-black">{selected.email}</p>
                  <button
                    type="button"
                    onClick={() => handleCopyEmail(selected.email)}
                    className="inline-flex items-center gap-1 rounded-[8px] border border-black/15 px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-black/70 transition hover:border-brand-green hover:text-brand-green"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copiedEmail ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Phone</p>
                <p className="mt-1 text-brand-black">{selected.phone || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">State / Region</p>
                <p className="mt-1 text-brand-black">{selected.region || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Newsletter</p>
                <p className="mt-1 text-brand-black">{selected.newsletter ? "Opted in" : "Not subscribed"}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Message</p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-brand-black">{selected.message}</p>
            </div>

            <div className="mt-5 rounded-[8px] border border-black/10 bg-[#fafaf8] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Reply and Send Email</p>
              <textarea
                value={replyMessage}
                onChange={(event) => setReplyMessage(event.target.value)}
                rows={6}
                placeholder="Write your response..."
                className="mt-2 w-full rounded-[8px] border border-black/12 bg-white px-3 py-2 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
              />
              {replyNotice ? <p className="mt-2 text-sm text-brand-green">{replyNotice}</p> : null}
              {selected.lastRepliedAt ? (
                <p className="mt-2 text-xs text-black/55">
                  Last reply: {new Date(selected.lastRepliedAt).toLocaleString()} ({selected.replyCount ?? 1} total)
                </p>
              ) : null}
            </div>

            {selected.replies && selected.replies.length > 0 ? (
              <div className="mt-4 rounded-[8px] border border-black/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Reply History</p>
                <div className="mt-3 max-h-44 space-y-3 overflow-y-auto pr-1">
                  {selected.replies.map((reply, index) => (
                    <div key={`${reply.sentAt}-${index}`} className="rounded-[8px] border border-black/8 p-3">
                      <p className="text-xs text-black/55">
                        {new Date(reply.sentAt).toLocaleString()} by {reply.sentByAdminName}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-brand-black">{reply.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="inline-flex min-h-10 items-center justify-center rounded-[8px] border border-black/15 px-4 text-xs font-semibold uppercase tracking-[0.15em] text-black/70 transition hover:border-black/30"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSendReply}
                disabled={sendingReply}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] bg-brand-green px-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-75"
              >
                {sendingReply ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send reply email
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmission}
                disabled={deleting}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] bg-brand-red px-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-75"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete submission
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
