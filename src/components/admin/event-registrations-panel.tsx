"use client";

import { useEffect, useMemo, useState } from "react";
import { getLgaOptionsByState, nigeriaStateOptions } from "@/lib/nigeria-locations";

type EventRegistration = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  state: string | null;
  lga: string | null;
  notes: string | null;
  createdAt: string;
};

type EventSummary = {
  id: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  state: string;
};

export default function EventRegistrationsPanel({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<EventSummary | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addStatus, setAddStatus] = useState<"idle" | "loading">("idle");
  const [addError, setAddError] = useState("");
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    lga: "",
    notes: "",
  });
  const addLgaOptions = useMemo(() => getLgaOptionsByState(addForm.state), [addForm.state]);

  async function loadData() {
    setLoading(true);
    const response = await fetch(`/api/admin/events/${eventId}/registrations`, { cache: "no-store" });
    const data = (await response.json().catch(() => null)) as {
      error?: string;
      event?: EventSummary;
      registrations?: EventRegistration[];
    } | null;

    if (!response.ok) {
      setError(data?.error ?? "Unable to fetch registrations.");
      setLoading(false);
      return;
    }

    setEvent(data?.event ?? null);
    setRegistrations(data?.registrations ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [eventId]);

  async function handleAddRegistration() {
    setAddStatus("loading");
    setAddError("");
    const payload = { ...addForm };

    const response = await fetch(`/api/events/${eventId}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setAddError(data?.error ?? "Unable to add registrant.");
      setAddStatus("idle");
      return;
    }

    setAddForm({
      name: "",
      email: "",
      phone: "",
      state: "",
      lga: "",
      notes: "",
    });
    setAddStatus("idle");
    await loadData();
  }

  return (
    <div className="space-y-5">
      <header className="rounded-[8px] border border-black/10 bg-white px-6 py-6 shadow-[0_22px_38px_-24px_rgb(0_0_0/0.34)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red">Event Details</p>
        <h2 className="mt-3 text-3xl font-semibold text-brand-black">{event?.title ?? "Event"}</h2>
        <p className="mt-2 text-sm text-black/65">
          {event ? `${event.date} • ${event.venue}, ${event.city}, ${event.state}` : "Loading event details..."}
        </p>
      </header>

      <section className="overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-[0_20px_34px_-24px_rgb(0_0_0/0.3)]">
        <div className="border-b border-black/8 px-6 py-5">
          <h3 className="text-lg font-semibold text-brand-black">Add registrant</h3>
          <form
            className="mt-4 grid gap-3 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              handleAddRegistration();
            }}
          >
            <input
              name="name"
              required
              value={addForm.name}
              onChange={(event) => setAddForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Full name"
              className="min-h-11 rounded-[8px] border border-black/12 bg-white px-3 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
            />
            <input
              name="email"
              type="email"
              required
              value={addForm.email}
              onChange={(event) => setAddForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="Email"
              className="min-h-11 rounded-[8px] border border-black/12 bg-white px-3 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
            />
            <input
              name="phone"
              value={addForm.phone}
              onChange={(event) => setAddForm((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="Phone (optional)"
              className="min-h-11 rounded-[8px] border border-black/12 bg-white px-3 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
            />
            <select
              name="state"
              value={addForm.state}
              onChange={(event) =>
                setAddForm((prev) => ({ ...prev, state: event.target.value, lga: "" }))
              }
              className="min-h-11 rounded-[8px] border border-black/12 bg-white px-3 pr-10 text-sm text-brand-black focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
            >
              <option value="">State (optional)</option>
              {nigeriaStateOptions.map((state) => (
                <option key={state.value} value={state.label}>
                  {state.label}
                </option>
              ))}
            </select>
            <select
              name="lga"
              value={addForm.lga}
              onChange={(event) => setAddForm((prev) => ({ ...prev, lga: event.target.value }))}
              disabled={!addForm.state}
              className="min-h-11 rounded-[8px] border border-black/12 bg-white px-3 pr-10 text-sm text-brand-black focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">{addForm.state ? "LGA (optional)" : "Select state first"}</option>
              {addLgaOptions.map((lga) => (
                <option key={lga.value} value={lga.label}>
                  {lga.label}
                </option>
              ))}
            </select>
            <input
              name="notes"
              value={addForm.notes}
              onChange={(event) => setAddForm((prev) => ({ ...prev, notes: event.target.value }))}
              placeholder="Notes (optional)"
              className="min-h-11 rounded-[8px] border border-black/12 bg-white px-3 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50"
            />
            {addError ? <p className="text-sm text-brand-red md:col-span-2">{addError}</p> : null}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={addStatus === "loading"}
                className="inline-flex min-h-11 items-center justify-center rounded-[8px] bg-brand-black px-5 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-brand-green disabled:cursor-not-allowed disabled:opacity-70"
              >
                {addStatus === "loading" ? "Adding..." : "Add registrant"}
              </button>
            </div>
          </form>
        </div>

        <div className="border-b border-black/8 px-6 py-4">
          <h3 className="text-lg font-semibold text-brand-black">Registered attendees ({registrations.length})</h3>
        </div>

        {loading ? (
          <div className="px-6 py-8 text-sm text-black/60">Loading registrations...</div>
        ) : error ? (
          <div className="px-6 py-8 text-sm text-brand-red">{error}</div>
        ) : registrations.length === 0 ? (
          <div className="px-6 py-8 text-sm text-black/60">No registrations yet for this event.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left">
              <thead className="bg-[#f7f7f4] text-xs uppercase tracking-[0.16em] text-black/60">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Notes</th>
                  <th className="px-4 py-3">Registered</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((registration) => (
                  <tr key={registration.id} className="border-t border-black/8 align-top text-sm text-brand-black">
                    <td className="px-4 py-3 font-medium">{registration.name}</td>
                    <td className="px-4 py-3 text-black/70">{registration.email}</td>
                    <td className="px-4 py-3 text-black/70">{registration.phone || "-"}</td>
                    <td className="px-4 py-3 text-black/70">
                      {[registration.state, registration.lga].filter(Boolean).join(", ") || "-"}
                    </td>
                    <td className="px-4 py-3 text-black/70">{registration.notes || "-"}</td>
                    <td className="px-4 py-3 text-black/60">{new Date(registration.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
