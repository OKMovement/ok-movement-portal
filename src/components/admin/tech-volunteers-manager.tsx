"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Loader2, Trash2, X } from "lucide-react";
import { VOLUNTEER_ROLES } from "../../../lib/tech-volunteers-data";

type TechVolunteerItem = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isDiaspora: boolean;
  state: string | null;
  country: string | null;
  primaryRole: string;
  secondarySkills: string[];
  experience: string;
  availability: string | null;
  portfolioUrl: string | null;
  linkedinUrl: string | null;
  motivation: string | null;
  consent: boolean;
  createdAt: string | Date;
};

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
const roleTitleMap = new Map(VOLUNTEER_ROLES.map((role) => [role.id, role.title]));

function resolveRoleLabel(roleId: string) {
  return roleTitleMap.get(roleId) ?? roleId;
}

export default function TechVolunteersManager() {
  const [volunteers, setVolunteers] = useState<TechVolunteerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<TechVolunteerItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [audienceFilter, setAudienceFilter] = useState<"all" | "diaspora" | "local">("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(10);

  async function loadVolunteers() {
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/tech-volunteers", { cache: "no-store" });
    const data = (await response.json().catch(() => null)) as
      | { volunteers?: TechVolunteerItem[]; error?: string }
      | null;

    if (!response.ok) {
      setError(data?.error ?? "Unable to fetch tech volunteers.");
      setLoading(false);
      return;
    }

    setVolunteers(data?.volunteers ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadVolunteers();
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

  async function handleDeleteVolunteer() {
    if (!selected) return;

    setDeleting(true);
    setError("");

    const response = await fetch(`/api/admin/tech-volunteers/${selected.id}`, {
      method: "DELETE",
    });
    const data = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setError(data?.error ?? "Unable to delete tech volunteer.");
      setDeleting(false);
      return;
    }

    setVolunteers((prev) => prev.filter((volunteer) => volunteer.id !== selected.id));
    setSelected(null);
    setDeleting(false);
  }

  function csvCell(value: string | number | boolean | null | undefined) {
    const raw = value == null ? "" : String(value);
    const escaped = raw.replace(/"/g, '""');
    return `"${escaped}"`;
  }

  function resolveLocation(volunteer: TechVolunteerItem) {
    if (volunteer.isDiaspora) {
      return volunteer.country ?? "Diaspora";
    }
    return volunteer.state ?? "Nigeria";
  }

  const roleOptions = useMemo(() => {
    const values = Array.from(
      new Set(volunteers.map((volunteer) => volunteer.primaryRole.trim()).filter(Boolean)),
    );
    return values.sort((a, b) =>
      resolveRoleLabel(a).localeCompare(resolveRoleLabel(b)),
    );
  }, [volunteers]);

  const stateOptions = useMemo(() => {
    const values = Array.from(
      new Set(volunteers.map((volunteer) => volunteer.state?.trim()).filter(Boolean) as string[]),
    );
    return values.sort((a, b) => a.localeCompare(b));
  }, [volunteers]);

  useEffect(() => {
    if (roleFilter !== "all" && !roleOptions.includes(roleFilter)) {
      setRoleFilter("all");
    }
  }, [roleFilter, roleOptions]);

  useEffect(() => {
    if (stateFilter !== "all" && !stateOptions.includes(stateFilter)) {
      setStateFilter("all");
    }
  }, [stateFilter, stateOptions]);

  const filteredVolunteers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return volunteers.filter((volunteer) => {
      if (roleFilter !== "all" && volunteer.primaryRole !== roleFilter) {
        return false;
      }

      if (audienceFilter === "diaspora" && !volunteer.isDiaspora) return false;
      if (audienceFilter === "local" && volunteer.isDiaspora) return false;
      if (stateFilter !== "all" && (volunteer.state?.trim() ?? "") !== stateFilter) return false;

      if (!query) return true;

      const searchable = [
        volunteer.fullName,
        volunteer.email,
        volunteer.phone,
        resolveRoleLabel(volunteer.primaryRole),
        volunteer.primaryRole,
        volunteer.experience,
        volunteer.availability ?? "",
        resolveLocation(volunteer),
        ...(volunteer.secondarySkills ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [volunteers, searchQuery, roleFilter, audienceFilter, stateFilter]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredVolunteers.length / pageSize)),
    [filteredVolunteers.length, pageSize],
  );

  const paginatedVolunteers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVolunteers.slice(start, start + pageSize);
  }, [filteredVolunteers, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, audienceFilter, stateFilter, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function handleExportCsv() {
    if (filteredVolunteers.length === 0) {
      setError("No tech volunteers match the current filters.");
      return;
    }

    const headers = [
      "Full Name",
      "Email",
      "Phone",
      "Audience",
      "State",
      "Country",
      "Primary Role",
      "Secondary Skills",
      "Experience",
      "Availability",
      "Portfolio URL",
      "LinkedIn/GitHub URL",
      "Motivation",
      "Consent",
      "Submitted At",
    ];

    const rows = filteredVolunteers.map((volunteer) => [
      volunteer.fullName,
      volunteer.email,
      volunteer.phone,
      volunteer.isDiaspora ? "Diaspora" : "Local",
      volunteer.state ?? "",
      volunteer.country ?? "",
      resolveRoleLabel(volunteer.primaryRole),
      volunteer.secondarySkills.map((item) => resolveRoleLabel(item)).join(", "),
      volunteer.experience,
      volunteer.availability ?? "",
      volunteer.portfolioUrl ?? "",
      volunteer.linkedinUrl ?? "",
      volunteer.motivation ?? "",
      volunteer.consent ? "Yes" : "No",
      volunteer.createdAt ? new Date(volunteer.createdAt).toISOString() : "",
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
    link.download = `ok-movement-tech-volunteers-${dateLabel}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <section className="overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-[0_20px_34px_-24px_rgb(0_0_0/0.3)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/8 px-4 py-4 sm:px-6">
          <h3 className="text-lg font-semibold text-brand-black">Tech Volunteers</h3>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={loading || filteredVolunteers.length === 0}
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
              placeholder="Name, email, role, phone, location"
              className="min-h-10 rounded-[8px] border border-black/12 bg-white px-3 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
            />
          </label>
          <label className="grid min-w-[12rem] gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/60">
              Primary Role
            </span>
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="min-h-10 rounded-[8px] border border-black/12 bg-white px-3 text-sm text-brand-black focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
            >
              <option value="all">All roles</option>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {resolveRoleLabel(role)}
                </option>
              ))}
            </select>
          </label>
          <label className="grid min-w-[10rem] gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/60">Audience</span>
            <select
              value={audienceFilter}
              onChange={(event) => setAudienceFilter(event.target.value as "all" | "diaspora" | "local")}
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
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-black/60">
                    Loading tech volunteers...
                  </td>
                </tr>
              ) : paginatedVolunteers.length > 0 ? (
                paginatedVolunteers.map((volunteer) => (
                  <tr
                    key={volunteer.id}
                    onClick={() => {
                      setSelected(volunteer);
                      setCopiedEmail(false);
                    }}
                    className="cursor-pointer border-t border-black/8 align-top text-sm text-brand-black transition hover:bg-[#f7f7f4]"
                  >
                    <td className="px-4 py-3 font-medium">{volunteer.fullName}</td>
                    <td className="px-4 py-3 text-black/70">{volunteer.email}</td>
                    <td className="px-4 py-3 text-black/70">{volunteer.phone}</td>
                    <td className="px-4 py-3 text-black/70">{resolveRoleLabel(volunteer.primaryRole)}</td>
                    <td className="px-4 py-3 text-black/70">{resolveLocation(volunteer)}</td>
                    <td className="px-4 py-3 text-black/60">
                      {volunteer.createdAt ? new Date(volunteer.createdAt).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-black/60">
                    No tech volunteers match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {!loading && filteredVolunteers.length > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/8 px-4 py-4 sm:px-6">
            <p className="text-xs text-black/60">
              Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredVolunteers.length)} of{" "}
              {filteredVolunteers.length}
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
          <div className="w-full max-w-xl rounded-[8px] border border-black/10 bg-white p-5 shadow-[0_26px_46px_-24px_rgb(0_0_0/0.5)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">
                  Tech Volunteer Details
                </p>
                <h3 className="mt-1 text-xl font-semibold text-brand-black">{selected.fullName}</h3>
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
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Location</p>
                <p className="mt-1 text-brand-black">{resolveLocation(selected)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Primary Role</p>
                <p className="mt-1 text-brand-black">{resolveRoleLabel(selected.primaryRole)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Secondary Skills</p>
                <p className="mt-1 text-brand-black">
                  {selected.secondarySkills.length > 0
                    ? selected.secondarySkills.map((item) => resolveRoleLabel(item)).join(", ")
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Experience</p>
                <p className="mt-1 text-brand-black">{selected.experience}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Availability</p>
                <p className="mt-1 text-brand-black">{selected.availability || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Portfolio</p>
                {selected.portfolioUrl ? (
                  <a
                    href={selected.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex text-brand-green underline decoration-brand-green/40 underline-offset-2 hover:text-brand-black"
                  >
                    {selected.portfolioUrl}
                  </a>
                ) : (
                  <p className="mt-1 text-brand-black">-</p>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">LinkedIn / GitHub</p>
                {selected.linkedinUrl ? (
                  <a
                    href={selected.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex text-brand-green underline decoration-brand-green/40 underline-offset-2 hover:text-brand-black"
                  >
                    {selected.linkedinUrl}
                  </a>
                ) : (
                  <p className="mt-1 text-brand-black">-</p>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/55">Motivation</p>
                <p className="mt-1 whitespace-pre-wrap text-brand-black">{selected.motivation || "-"}</p>
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
                onClick={handleDeleteVolunteer}
                disabled={deleting}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] bg-brand-red px-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-75"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete entry
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
