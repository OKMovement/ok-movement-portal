"use client";

import { useEffect, useState } from "react";
import { Copy, Loader2, Trash2, X } from "lucide-react";

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
};

export default function SupportSubmissionsManager() {
  const [submissions, setSubmissions] = useState<SupportSubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<SupportSubmissionItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

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
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-black/60">
                    Loading support submissions...
                  </td>
                </tr>
              ) : submissions.length > 0 ? (
                submissions.map((submission) => (
                  <tr
                    key={submission.id}
                    onClick={() => {
                      setSelected(submission);
                      setCopiedEmail(false);
                    }}
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-black/60">
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
