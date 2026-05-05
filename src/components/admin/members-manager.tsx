"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Loader2, Trash2, X } from "lucide-react";

type MemberItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  engagement: string;
  donationType: "cash" | "materials" | null;
  donationAmount: number | null;
  donationMaterial: "campaign-flyers" | "campaign-cap" | "campaign-tshirt" | "campaign-wraist-band" | "other" | null;
  donationMaterialOther: string | null;
  isDiaspora: boolean;
  country: string | null;
  votingState: string | null;
  votingLga: string | null;
  votingWard: string | null;
  createdAt: string | Date;
};

type MembersManagerProps = {
  donationsOnly?: boolean;
};

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export default function MembersManager({ donationsOnly = false }: MembersManagerProps) {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<MemberItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [engagementFilter, setEngagementFilter] = useState("all");
  const [diasporaFilter, setDiasporaFilter] = useState<"all" | "diaspora" | "local">("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(10);

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

  function formatDonationAmount(amount: number | null) {
    if (amount == null || !Number.isFinite(amount)) return "-";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function formatDonationMaterial(member: MemberItem) {
    if (!member.donationMaterial) return "-";
    if (member.donationMaterial === "campaign-flyers") return "Campaign Flyers";
    if (member.donationMaterial === "campaign-cap") return "Campaign Cap";
    if (member.donationMaterial === "campaign-tshirt") return "Campaign T-Shirt";
    if (member.donationMaterial === "campaign-wraist-band") return "Campaign Waist Band";
    if (member.donationMaterial === "other") {
      return member.donationMaterialOther?.trim() ? `Other (${member.donationMaterialOther})` : "Other";
    }
    return member.donationMaterial;
  }

  function donationSummary(member: MemberItem) {
    if (member.donationType === "cash") {
      return formatDonationAmount(member.donationAmount);
    }
    if (member.donationType === "materials") {
      return formatDonationMaterial(member);
    }
    return "-";
  }

  const scopedMembers = useMemo(
    () => members.filter((member) => (donationsOnly ? /donate/i.test(member.engagement) : true)),
    [members, donationsOnly],
  );

  const engagementOptions = useMemo(() => {
    const values = Array.from(
      new Set(scopedMembers.map((member) => member.engagement.trim()).filter(Boolean)),
    );
    return values.sort((a, b) => a.localeCompare(b));
  }, [scopedMembers]);

  const stateOptions = useMemo(() => {
    const values = Array.from(
      new Set(scopedMembers.map((member) => member.votingState?.trim()).filter(Boolean) as string[]),
    );
    return values.sort((a, b) => a.localeCompare(b));
  }, [scopedMembers]);

  useEffect(() => {
    if (engagementFilter !== "all" && !engagementOptions.includes(engagementFilter)) {
      setEngagementFilter("all");
    }
  }, [engagementFilter, engagementOptions]);

  useEffect(() => {
    if (stateFilter !== "all" && !stateOptions.includes(stateFilter)) {
      setStateFilter("all");
    }
  }, [stateFilter, stateOptions]);

  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return scopedMembers.filter((member) => {
      if (engagementFilter !== "all" && member.engagement !== engagementFilter) {
        return false;
      }

      if (diasporaFilter === "diaspora" && !member.isDiaspora) return false;
      if (diasporaFilter === "local" && member.isDiaspora) return false;
      if (stateFilter !== "all" && (member.votingState?.trim() ?? "") !== stateFilter) return false;

      if (!query) return true;

      const searchable = [
        member.name,
        member.email,
        member.phone,
        member.engagement,
        resolveLocation(member),
        member.country ?? "",
        member.votingState ?? "",
        member.votingLga ?? "",
        member.votingWard ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [scopedMembers, searchQuery, engagementFilter, diasporaFilter, stateFilter]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredMembers.length / pageSize)),
    [filteredMembers.length, pageSize],
  );

  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMembers.slice(start, start + pageSize);
  }, [filteredMembers, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, engagementFilter, diasporaFilter, stateFilter, pageSize, donationsOnly]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function handleExportCsv() {
    if (filteredMembers.length === 0) {
      setError(
        donationsOnly
          ? "No donation submissions match the current filters."
          : "No members match the current filters.",
      );
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Engagement",
      "Donation Type",
      "Donation Amount",
      "Donation Material",
      "Diaspora",
      "Country",
      "Voting State",
      "Voting LGA",
      "Voting Ward",
      "Location",
      "Submitted At",
    ];

    const rows = filteredMembers.map((member) => [
      member.name,
      member.email,
      member.phone,
      member.engagement,
      member.donationType ?? "",
      member.donationAmount ?? "",
      formatDonationMaterial(member),
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
    link.download = donationsOnly
      ? `ok-movement-donations-${dateLabel}.csv`
      : `ok-movement-members-${dateLabel}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const columnCount = donationsOnly ? 7 : 6;

  return (
    <>
      <section className="overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-[0_20px_34px_-24px_rgb(0_0_0/0.3)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/8 px-4 py-4 sm:px-6">
          <h3 className="text-lg font-semibold text-brand-black">Members</h3>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={loading || filteredMembers.length === 0}
            className="inline-flex min-h-10 items-center justify-center rounded-[8px] bg-brand-black px-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-brand-green disabled:cursor-not-allowed disabled:opacity-70"
          >
            Export CSV
          </button>
        </div>
        {error ? <p className="px-4 pt-4 text-sm text-brand-red">{error}</p> : null}
        <div className="flex flex-wrap items-end gap-3 border-b border-black/8 px-4 py-4 sm:px-6">
          <label className="grid min-w-[14rem] flex-1 gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/60">Search</span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={donationsOnly ? "Name, email, phone, location" : "Search members"}
              className="min-h-10 rounded-[8px] border border-black/12 bg-white px-3 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
            />
          </label>
          <label className="grid min-w-[12rem] gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/60">
              Engagement
            </span>
            <select
              value={engagementFilter}
              onChange={(event) => setEngagementFilter(event.target.value)}
              className="min-h-10 rounded-[8px] border border-black/12 bg-white px-3 text-sm text-brand-black focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
            >
              <option value="all">All engagement</option>
              {engagementOptions.map((engagement) => (
                <option key={engagement} value={engagement}>
                  {engagement}
                </option>
              ))}
            </select>
          </label>
          <label className="grid min-w-[10rem] gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/60">Audience</span>
            <select
              value={diasporaFilter}
              onChange={(event) => setDiasporaFilter(event.target.value as "all" | "diaspora" | "local")}
              className="min-h-10 rounded-[8px] border border-black/12 bg-white px-3 text-sm text-brand-black focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
            >
              <option value="all">All</option>
              <option value="local">Local</option>
              <option value="diaspora">Diaspora</option>
            </select>
          </label>
          <label className="grid min-w-[12rem] gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/60">State</span>
            <select
              value={stateFilter}
              onChange={(event) => setStateFilter(event.target.value)}
              className="min-h-10 rounded-[8px] border border-black/12 bg-white px-3 text-sm text-brand-black focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
            >
              <option value="all">All states</option>
              {stateOptions.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-[#f7f7f4] text-xs uppercase tracking-[0.16em] text-black/60">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Engagement</th>
                {donationsOnly ? <th className="px-4 py-3">Donation</th> : null}
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columnCount} className="px-4 py-8 text-center text-sm text-black/60">
                    Loading members...
                  </td>
                </tr>
              ) : paginatedMembers.length > 0 ? (
                paginatedMembers.map((member) => {
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
                      {donationsOnly ? (
                        <td className="px-4 py-3 text-black/70">{donationSummary(member)}</td>
                      ) : null}
                      <td className="px-4 py-3 text-black/70">{location || "-"}</td>
                      <td className="px-4 py-3 text-black/60">
                        {member.createdAt ? new Date(member.createdAt).toLocaleString() : "-"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columnCount} className="px-4 py-8 text-center text-sm text-black/60">
                    {donationsOnly
                      ? "No donation submissions match your filters."
                      : "No members match your filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {!loading && filteredMembers.length > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/8 px-4 py-4 sm:px-6">
            <p className="text-xs text-black/60">
              Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredMembers.length)} of{" "}
              {filteredMembers.length}
            </p>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-black/65">
                <span className="mr-2">Rows</span>
                <select
                  value={String(pageSize)}
                  onChange={(event) =>
                    setPageSize(Number(event.target.value) as (typeof PAGE_SIZE_OPTIONS)[number])
                  }
                  className="min-h-9 rounded-[8px] border border-black/15 bg-white px-2 text-xs text-brand-black"
                >
                  {PAGE_SIZE_OPTIONS.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="inline-flex min-h-9 items-center justify-center rounded-[8px] border border-black/15 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-black/70 transition hover:border-brand-green hover:text-brand-green disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-black/65">
                Page {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex min-h-9 items-center justify-center rounded-[8px] border border-black/15 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-black/70 transition hover:border-brand-green hover:text-brand-green disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
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

              {selected.donationType ? (
                <>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Donation Type</p>
                    <p className="mt-1 text-brand-black capitalize">{selected.donationType}</p>
                  </div>
                  {selected.donationType === "cash" ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Donation Amount</p>
                      <p className="mt-1 text-brand-black">{formatDonationAmount(selected.donationAmount)}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Donation Material</p>
                      <p className="mt-1 text-brand-black">{formatDonationMaterial(selected)}</p>
                    </div>
                  )}
                </>
              ) : null}
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
