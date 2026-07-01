"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Loader2, Pencil, Plus, Trash2, Users } from "lucide-react";
import { countryOptions, getStatesByCountry } from "@/lib/world-locations";

type EventItem = {
  id: string;
  title: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  country: string;
  city: string;
  state: string;
  lga: string;
  venue: string;
  address: string;
  flierImageUrl: string;
  why: string;
  capacity: number;
  registrationOpen: boolean;
  registrationsCount: number;
};

const inputClass =
  "min-h-11 rounded-[8px] border border-black/12 bg-white px-3 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50";
const textareaClass =
  "rounded-[8px] border border-black/12 bg-white px-3 py-2 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50";

const initialForm = {
  id: "",
  title: "",
  type: "",
  date: "",
  startTime: "",
  endTime: "",
  country: "",
  city: "",
  state: "",
  lga: "",
  venue: "",
  address: "",
  flierImageUrl: "",
  why: "",
  capacity: 100,
  registrationOpen: true,
};

export default function EventsManager() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFlier, setUploadingFlier] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const stateOptions = useMemo(() => getStatesByCountry(form.country), [form.country]);

  async function loadEvents() {
    setLoading(true);
    const response = await fetch("/api/admin/events", { cache: "no-store" });
    const data = (await response.json()) as { events?: EventItem[]; error?: string };
    if (!response.ok) {
      setError(data.error ?? "Unable to fetch events.");
      setLoading(false);
      return;
    }
    setItems(data.events ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      capacity: Number(form.capacity),
    };

    const response = await fetch(form.id ? `/api/admin/events/${form.id}` : "/api/admin/events", {
      method: form.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setError(data?.error ?? "Unable to save event.");
      setSaving(false);
      return;
    }

    setForm(initialForm);
    setViewMode("list");
    setSaving(false);
    await loadEvents();
  }

  async function handleFlierUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFlier(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("file", file);
      payload.append("context", "event-flier");

      const response = await fetch("/api/admin/uploads/image", {
        method: "POST",
        body: payload,
      });

      const data = (await response.json().catch(() => null)) as
        | { image?: { url?: string }; error?: string }
        | null;
      const uploadedUrl = data?.image?.url;

      if (!response.ok || !uploadedUrl) {
        setError(data?.error ?? "Unable to upload flier image.");
        return;
      }

      setForm((prev) => ({ ...prev, flierImageUrl: uploadedUrl }));
    } finally {
      setUploadingFlier(false);
      event.target.value = "";
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this event and all its registrations?");
    if (!confirmed) return;

    const response = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Unable to delete event.");
      return;
    }

    await loadEvents();
  }

  function handleEdit(item: EventItem) {
    setForm({
      id: item.id,
      title: item.title,
      type: item.type,
      date: item.date,
      startTime: item.startTime,
      endTime: item.endTime,
      country: item.country ?? "",
      city: item.city,
      state: item.state,
      lga: item.lga ?? "",
      venue: item.venue,
      address: item.address,
      flierImageUrl: item.flierImageUrl ?? "",
      why: item.why,
      capacity: item.capacity,
      registrationOpen: item.registrationOpen,
    });
    setViewMode("form");
  }

  function handleCreateNew() {
    setForm(initialForm);
    setViewMode("form");
  }

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-[0_20px_34px_-24px_rgb(0_0_0/0.3)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/8 px-6 py-4">
          <h3 className="text-lg font-semibold text-brand-black">All events</h3>
          <button
            type="button"
            onClick={handleCreateNew}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] bg-brand-black px-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-brand-green"
          >
            <Plus className="h-4 w-4" />
            Create new
          </button>
        </div>

        {error && viewMode === "list" ? <p className="px-6 pt-4 text-sm text-brand-red">{error}</p> : null}

        {loading ? (
          <div className="px-6 py-8 text-sm text-black/60">Loading events...</div>
        ) : items.length === 0 ? (
          <div className="px-6 py-8 text-sm text-black/60">No events yet.</div>
        ) : (
          <div className="divide-y divide-black/8">
            {items.map((item) => (
              <article key={item.id} className="px-6 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-semibold text-brand-black">{item.title}</h4>
                    <p className="mt-1 text-sm text-black/65">
                      {item.date} • {item.startTime} - {item.endTime} • {item.city}, {item.state}, {item.country}
                    </p>
                    <p className="mt-2 text-sm text-black/70">{item.venue}</p>
                    {item.flierImageUrl ? (
                      <p className="mt-1 text-xs text-black/50">Flier attached</p>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <span
                      className={`rounded-[8px] px-2.5 py-1 text-xs font-semibold ${
                        item.registrationOpen
                          ? "bg-brand-green/10 text-brand-green"
                          : "bg-brand-red/10 text-brand-red"
                      }`}
                    >
                      {item.registrationOpen ? "Open" : "Closed"}
                    </span>
                    <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-black/60">
                      <Users className="h-3.5 w-3.5" />
                      {item.registrationsCount} / {item.capacity}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`/admin/dashboard/events/${item.id}`}
                    className="inline-flex items-center rounded-[8px] border border-brand-green/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-green transition hover:bg-brand-green hover:text-white"
                  >
                    View registrations
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="inline-flex items-center gap-1 rounded-[8px] border border-black/12 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-black/70 transition hover:border-brand-green hover:text-brand-green"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex items-center gap-1 rounded-[8px] border border-brand-red/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-red transition hover:bg-brand-red hover:text-white"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {viewMode === "form" ? (
        <section className="rounded-[8px] border border-black/10 bg-white px-6 py-6 shadow-[0_20px_34px_-24px_rgb(0_0_0/0.3)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red">Events</p>
          <h2 className="mt-3 text-3xl font-semibold text-brand-black">{form.id ? "Edit event" : "Create event"}</h2>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="grid gap-1.5 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Title</span>
              <input
                required
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                className={inputClass}
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Type</span>
              <input
                required
                value={form.type}
                onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
                className={inputClass}
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Date</span>
              <input
                required
                type="date"
                value={form.date}
                onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                className={inputClass}
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Start time</span>
              <input
                required
                placeholder="10:00 AM"
                value={form.startTime}
                onChange={(event) => setForm((prev) => ({ ...prev, startTime: event.target.value }))}
                className={inputClass}
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">End time</span>
              <input
                required
                placeholder="1:00 PM"
                value={form.endTime}
                onChange={(event) => setForm((prev) => ({ ...prev, endTime: event.target.value }))}
                className={inputClass}
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Country</span>
              <select
                required
                value={form.country}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, country: event.target.value, state: "" }))
                }
                className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2020%2020%22%20fill=%22%2300a651%22><path%20d=%22M5.5%208l4.5%204.5L14.5%208z%22/></svg>')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
              >
                <option value="" disabled>
                  Select a country
                </option>
                {countryOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">State / Region</span>
              {stateOptions.length > 0 ? (
                <select
                  required
                  value={form.state}
                  onChange={(event) => setForm((prev) => ({ ...prev, state: event.target.value }))}
                  disabled={!form.country}
                  className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2020%2020%22%20fill=%22%2300a651%22><path%20d=%22M5.5%208l4.5%204.5L14.5%208z%22/></svg>')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10 disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <option value="" disabled>
                    {form.country ? "Select a state / region" : "Select country first"}
                  </option>
                  {stateOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  required
                  value={form.state}
                  onChange={(event) => setForm((prev) => ({ ...prev, state: event.target.value }))}
                  placeholder={form.country ? "Enter state or region" : "Select country first"}
                  disabled={!form.country}
                  className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
                />
              )}
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">City</span>
              <input
                required
                value={form.city}
                onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
                className={inputClass}
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Capacity</span>
              <input
                required
                type="number"
                min={1}
                value={form.capacity}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, capacity: Number(event.target.value || 0) }))
                }
                className={inputClass}
              />
            </label>

            <label className="grid gap-1.5 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Venue</span>
              <input
                required
                value={form.venue}
                onChange={(event) => setForm((prev) => ({ ...prev, venue: event.target.value }))}
                className={inputClass}
              />
            </label>

            <label className="grid gap-1.5 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Address</span>
              <input
                required
                value={form.address}
                onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                className={inputClass}
              />
            </label>

            <label className="grid gap-1.5 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">
                Event Flier Image
              </span>
              <input
                required
                value={form.flierImageUrl}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, flierImageUrl: event.target.value }))
                }
                className={inputClass}
                placeholder="https://..."
              />
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-[8px] border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-black/70 transition hover:border-brand-green hover:text-brand-green">
                  {uploadingFlier ? "Uploading..." : "Upload from device"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFlierUpload}
                    disabled={uploadingFlier}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-black/55">PNG, JPG, WEBP up to 10MB</span>
              </div>
              {form.flierImageUrl ? (
                <img
                  src={form.flierImageUrl}
                  alt="Event flier preview"
                  className="mt-1 h-40 w-full rounded-[8px] border border-black/10 object-cover sm:w-64"
                />
              ) : null}
            </label>

            <label className="grid gap-1.5 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Description</span>
              <textarea
                required
                rows={4}
                value={form.why}
                onChange={(event) => setForm((prev) => ({ ...prev, why: event.target.value }))}
                className={textareaClass}
              />
            </label>

            <label className="inline-flex items-center gap-2 text-sm text-brand-black md:col-span-2">
              <input
                type="checkbox"
                checked={form.registrationOpen}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, registrationOpen: event.target.checked }))
                }
                className="h-4 w-4 rounded-[8px] border-black/20 text-brand-green"
              />
              Keep registration open
            </label>

            {error ? <p className="text-sm text-brand-red md:col-span-2">{error}</p> : null}

            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-brand-black px-5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-brand-green disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {form.id ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm(initialForm);
                  setViewMode("list");
                }}
                className="inline-flex min-h-11 items-center justify-center rounded-[8px] border border-black/15 px-5 text-sm font-semibold uppercase tracking-[0.16em] text-black/70 transition hover:border-brand-red hover:text-brand-red"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  );
}
