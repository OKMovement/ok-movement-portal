"use client";

import { useEffect, useState } from "react";
import { Copy, Loader2, Trash2, X } from "lucide-react";

type MemberItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  engagement: string;
  isDiaspora: boolean;
  country: string | null;
  votingState: string | null;
  votingLga: string | null;
  votingWard: string | null;
  createdAt: string | Date;
};

export default function MembersManager() {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<MemberItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  async function loadMembers() {
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/members", { cache: "no-store" });
    const data = (await response.json().catch(() => null)) as
      | { members?: MemberItem[]; error?: string }
      | null;

    if (!response.ok) {
      setError(data?.error ?? "Unable to fetch members.");
      setLoading(false);
      return;
    }

    setMembers(data?.members ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadMembers();
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

  async function handleDeleteMember() {
    if (!selected) return;

    setDeleting(true);
    setError("");

    const response = await fetch(`/api/admin/members/${selected.id}`, {
      method: "DELETE",
    });
    const data = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setError(data?.error ?? "Unable to delete member.");
      setDeleting(false);
      return;
    }

    setMembers((prev) => prev.filter((member) => member.id !== selected.id));
    setSelected(null);
    setDeleting(false);
  }

  function csvCell(value: string | number | boolean | null | undefined) {
    const raw = value == null ? "" : String(value);
    const escaped = raw.replace(/"/g, '""');
    return `"${escaped}"`;
  }

  function resolveLocation(member: MemberItem) {
    if (member.isDiaspora) {
      return member.country ?? "Diaspora";
    }
    return [member.votingState, member.votingLga, member.votingWard].filter(Boolean).join(", ");
  }

  function handleExportCsv() {
    if (members.length === 0) {
      setError("No members to export yet.");
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Engagement",
      "Diaspora",
      "Country",
      "Voting State",
      "Voting LGA",
      "Voting Ward",
      "Location",
      "Submitted At",
    ];

    const rows = members.map((member) => [
      member.name,
      member.email,
      member.phone,
      member.engagement,
      member.isDiaspora ? "Yes" : "No",
      member.country ?? "",
      member.votingState ?? "",
      member.votingLga ?? "",
      member.votingWard ?? "",
      resolveLocation(member),
      member.createdAt ? new Date(member.createdAt).toISOString() : "",
    ]);

    const csv = [
      headers.map(csvCell).join(","),
      ...rows.map((row) => row.map(csvCell).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateLabel = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `ok-movement-members-${dateLabel}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <section className="overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-[0_20px_34px_-24px_rgb(0_0_0/0.3)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/8 px-4 py-4 sm:px-6">
          <h3 className="text-lg font-semibold text-brand-black">Members</h3>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={loading || members.length === 0}
            className="inline-flex min-h-10 items-center justify-center rounded-[8px] bg-brand-black px-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-brand-green disabled:cursor-not-allowed disabled:opacity-70"
          >
            Export CSV
          </button>
        </div>
        {error ? <p className="px-4 pt-4 text-sm text-brand-red">{error}</p> : null}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-[#f7f7f4] text-xs uppercase tracking-[0.16em] text-black/60">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Engagement</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-black/60">
                    Loading members...
                  </td>
                </tr>
              ) : members.length > 0 ? (
                members.map((member) => {
                  const location = resolveLocation(member);

                  return (
                    <tr
                      key={member.id}
                      onClick={() => {
                        setSelected(member);
                        setCopiedEmail(false);
                      }}
                      className="cursor-pointer border-t border-black/8 align-top text-sm text-brand-black transition hover:bg-[#f7f7f4]"
                    >
                      <td className="px-4 py-3 font-medium">{member.name}</td>
                      <td className="px-4 py-3 text-black/70">{member.email}</td>
                      <td className="px-4 py-3 text-black/70">{member.phone}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-[8px] bg-brand-green/10 px-2.5 py-1 text-xs font-semibold text-brand-green">
                          {member.engagement}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-black/70">{location || "-"}</td>
                      <td className="px-4 py-3 text-black/60">
                        {member.createdAt ? new Date(member.createdAt).toLocaleString() : "-"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-black/60">
                    No members yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <div className="w-full max-w-lg rounded-[8px] border border-black/10 bg-white p-5 shadow-[0_26px_46px_-24px_rgb(0_0_0/0.5)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">
                  Member Details
                </p>
                <h3 className="mt-1 text-xl font-semibold text-brand-black">{selected.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-[8px] border border-black/10 p-1.5 text-black/65 transition hover:border-brand-red hover:text-brand-red"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
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
                <p className="mt-1 text-brand-black">{selected.phone}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Engagement</p>
                <p className="mt-1 text-brand-black">{selected.engagement}</p>
              </div>
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
                onClick={handleDeleteMember}
                disabled={deleting}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] bg-brand-red px-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-75"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete member
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
