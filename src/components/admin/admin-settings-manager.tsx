"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import InviteAdminForm from "@/components/admin/invite-admin-form";

type AdminRole = "admin" | "super";

type AdminListItem = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  createdAt: string | null;
  updatedAt: string | null;
  lastLoginAt: string | null;
};

export default function AdminSettingsManager() {
  const [admins, setAdmins] = useState<AdminListItem[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<{ id: string; role: AdminRole } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editingAdmin, setEditingAdmin] = useState<AdminListItem | null>(null);
  const [editingRole, setEditingRole] = useState<AdminRole>("admin");
  const [savingEdit, setSavingEdit] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const isSuperAdmin = currentAdmin?.role === "super";

  async function loadAdmins() {
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/users", { cache: "no-store" });
    const data = (await response.json().catch(() => null)) as
      | {
          error?: string;
          currentAdmin?: { id: string; role: AdminRole };
          admins?: AdminListItem[];
        }
      | null;

    if (!response.ok) {
      setError(data?.error ?? "Unable to fetch admins.");
      setLoading(false);
      return;
    }

    setAdmins(data?.admins ?? []);
    setCurrentAdmin(data?.currentAdmin ?? null);
    setLoading(false);
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  const sortedAdmins = useMemo(
    () =>
      [...admins].sort((a, b) => {
        if (a.role !== b.role) return a.role === "super" ? -1 : 1;
        return a.name.localeCompare(b.name);
      }),
    [admins],
  );

  function openEditModal(admin: AdminListItem) {
    setEditingAdmin(admin);
    setEditingRole(admin.role);
  }

  function closeEditModal() {
    if (savingEdit) return;
    setEditingAdmin(null);
  }

  async function handleEditSave() {
    if (!editingAdmin) return;

    setSavingEdit(true);
    setError("");

    const response = await fetch(`/api/admin/users/${editingAdmin.id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: editingRole }),
    });

    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) {
      setError(data?.error ?? "Unable to update role.");
      setSavingEdit(false);
      return;
    }

    setSavingEdit(false);
    setEditingAdmin(null);
    await loadAdmins();
  }

  async function handleDelete(adminId: string) {
    const confirmed = window.confirm("Delete this admin user?");
    if (!confirmed) return;

    setDeletingId(adminId);
    setError("");

    const response = await fetch(`/api/admin/users/${adminId}`, {
      method: "DELETE",
    });

    const data = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setError(data?.error ?? "Unable to delete admin.");
      setDeletingId(null);
      return;
    }

    setDeletingId(null);
    await loadAdmins();
  }

  const editingSelf = editingAdmin?.id === currentAdmin?.id;
  const canSaveEdit =
    Boolean(isSuperAdmin) && Boolean(editingAdmin) && !editingSelf && editingRole !== editingAdmin?.role;

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] border border-black/10 bg-white px-6 py-5 shadow-[0_20px_34px_-24px_rgb(0_0_0/0.3)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red">Settings</p>
            <h2 className="mt-2 text-2xl font-semibold text-brand-black">Admin management</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] bg-brand-black px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-brand-green"
          >
            <Plus className="h-4 w-4" />
            Invite Admin
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-[0_20px_34px_-24px_rgb(0_0_0/0.3)]">
        <div className="border-b border-black/8 px-6 py-4">
          <h3 className="text-lg font-semibold text-brand-black">Admin users</h3>
          <p className="mt-1 text-sm text-black/60">
            All admins and roles. Only super admins can edit roles or delete users.
          </p>
        </div>

        {error ? <p className="px-6 pt-4 text-sm text-brand-red">{error}</p> : null}

        {loading ? (
          <div className="px-6 py-8 text-sm text-black/60">Loading admins...</div>
        ) : sortedAdmins.length === 0 ? (
          <div className="px-6 py-8 text-sm text-black/60">No admins found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left">
              <thead className="bg-[#f7f7f4] text-xs uppercase tracking-[0.16em] text-black/60">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Last login</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedAdmins.map((admin) => {
                  const isSelf = admin.id === currentAdmin?.id;
                  const actionDisabled = !isSuperAdmin || isSelf;

                  return (
                    <tr key={admin.id} className="border-t border-black/8 align-top text-sm text-brand-black">
                      <td className="px-4 py-3 font-medium">
                        {admin.name}
                        {isSelf ? <span className="ml-2 text-xs text-black/50">(You)</span> : null}
                      </td>
                      <td className="px-4 py-3 text-black/70">{admin.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-[8px] px-2.5 py-1 text-xs font-semibold ${
                            admin.role === "super" ? "bg-brand-green/10 text-brand-green" : "bg-black/8 text-black/65"
                          }`}
                        >
                          {admin.role === "super" ? "Super Admin" : "Admin"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-black/60">
                        {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : "Never"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(admin)}
                            disabled={actionDisabled}
                            className="inline-flex min-h-9 items-center justify-center gap-1 rounded-[8px] border border-black/15 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-black/70 transition hover:border-brand-green hover:text-brand-green disabled:cursor-not-allowed disabled:opacity-60"
                            title={!isSuperAdmin ? "Super admin only" : isSelf ? "You cannot edit your own role" : "Edit admin"}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(admin.id)}
                            disabled={actionDisabled || deletingId === admin.id}
                            className="inline-flex min-h-9 items-center justify-center gap-1 rounded-[8px] border border-brand-red/25 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-brand-red transition hover:bg-brand-red hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                            title={!isSuperAdmin ? "Super admin only" : isSelf ? "You cannot delete your own account" : "Delete admin"}
                          >
                            {deletingId === admin.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {editingAdmin ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-xl rounded-[8px] border border-black/10 bg-white p-6 shadow-[0_30px_60px_-24px_rgb(0_0_0/0.5)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red">Edit Admin</p>
                <h3 className="mt-2 text-2xl font-semibold text-brand-black">Update admin details</h3>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-black/10 text-black/60 transition hover:bg-black/5"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Name</span>
                <input
                  value={editingAdmin.name}
                  disabled
                  className="min-h-11 rounded-[8px] border border-black/12 bg-[#f7f7f4] px-3 text-sm text-brand-black/70"
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Email</span>
                <input
                  value={editingAdmin.email}
                  disabled
                  className="min-h-11 rounded-[8px] border border-black/12 bg-[#f7f7f4] px-3 text-sm text-brand-black/70"
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Role</span>
                <select
                  value={editingRole}
                  onChange={(event) => setEditingRole(event.target.value as AdminRole)}
                  disabled={!isSuperAdmin || editingSelf}
                  className="min-h-11 rounded-[8px] border border-black/12 bg-white px-3 text-sm text-brand-black disabled:cursor-not-allowed disabled:bg-[#f7f7f4] disabled:text-black/60"
                >
                  <option value="admin">Admin</option>
                  <option value="super">Super Admin</option>
                </select>
              </label>

              {!isSuperAdmin ? (
                <p className="text-xs text-black/50">Only super admins can edit roles.</p>
              ) : null}
              {editingSelf ? (
                <p className="text-xs text-black/50">You cannot change your own role.</p>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleEditSave}
                disabled={!canSaveEdit || savingEdit}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-brand-black px-5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-brand-green disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Save changes
              </button>
              <button
                type="button"
                onClick={closeEditModal}
                disabled={savingEdit}
                className="inline-flex min-h-11 items-center justify-center rounded-[8px] border border-black/15 px-5 text-sm font-semibold uppercase tracking-[0.16em] text-black/70 transition hover:border-brand-red hover:text-brand-red"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isInviteModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-2xl rounded-[8px] border border-black/10 bg-white p-6 shadow-[0_30px_60px_-24px_rgb(0_0_0/0.5)]">
            <div className="mb-4 flex items-start justify-end">
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-black/10 text-black/60 transition hover:bg-black/5"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <InviteAdminForm
              onInvited={() => {
                setIsInviteModalOpen(false);
                loadAdmins();
              }}
              canAssignSuper={Boolean(isSuperAdmin)}
              variant="plain"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
