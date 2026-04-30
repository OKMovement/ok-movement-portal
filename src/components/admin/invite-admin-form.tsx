"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";

export default function InviteAdminForm({
  onInvited,
  canAssignSuper = true,
  variant = "card",
}: {
  onInvited?: () => void;
  canAssignSuper?: boolean;
  variant?: "card" | "plain";
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      role: String(formData.get("role") ?? "admin"),
    };

    const response = await fetch("/api/admin/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setError(data?.error ?? "Unable to invite admin.");
      setStatus("idle");
      return;
    }

    setStatus("done");
    setMessage("Admin invited successfully. Credentials were sent by email.");
    form.reset();
    onInvited?.();
    setTimeout(() => setStatus("idle"), 1200);
  }

  const content = (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red">Settings</p>
      <h2 className="mt-3 text-3xl font-semibold text-brand-black">Invite an admin</h2>
      <p className="mt-2 text-sm text-black/65">
        Send dashboard access credentials to a new admin user via email.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">Full name</span>
          <input
            name="name"
            required
            className="min-h-11 rounded-[10px] border border-black/12 bg-white px-3 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
            placeholder="Jane Doe"
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">Email</span>
          <input
            name="email"
            type="email"
            required
            className="min-h-11 rounded-[10px] border border-black/12 bg-white px-3 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
            placeholder="jane@okmovement.ng"
          />
        </label>

        <label className="grid gap-1.5 md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">Role</span>
          <select
            name="role"
            defaultValue="admin"
            className="min-h-11 rounded-[10px] border border-black/12 bg-white px-3 text-sm text-brand-black focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
          >
            <option value="admin">Admin</option>
            {canAssignSuper ? <option value="super">Super Admin</option> : null}
          </select>
        </label>

        {error ? <p className="text-sm text-brand-red md:col-span-2">{error}</p> : null}
        {message ? <p className="text-sm text-brand-green md:col-span-2">{message}</p> : null}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-brand-black px-5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-brand-green disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send Invite
          </button>
        </div>
      </form>
    </>
  );

  if (variant === "plain") {
    return content;
  }

  return (
    <section className="rounded-[18px] border border-black/10 bg-white px-6 py-6 shadow-[0_20px_34px_-24px_rgb(0_0_0/0.3)]">
      {content}
    </section>
  );
}
