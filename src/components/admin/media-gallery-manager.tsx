"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

type MediaKind = "image" | "news" | "video";

type MediaItem = {
  id: string;
  kind: MediaKind;
  title: string;
  imageUrl: string;
  category: string;
  description: string;
  excerpt: string;
  location: string;
  linkUrl: string;
  duration: string;
  publishedAt: string | null;
  isPublished: boolean;
};

const inputClass =
  "min-h-11 rounded-[10px] border border-black/12 bg-white px-3 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50";
const textareaClass =
  "rounded-[10px] border border-black/12 bg-white px-3 py-2 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50";

const initialForm = {
  id: "",
  kind: "image" as MediaKind,
  title: "",
  imageUrl: "",
  category: "",
  description: "",
  excerpt: "",
  location: "",
  linkUrl: "",
  duration: "",
  publishedAt: "",
  isPublished: true,
};

const kindLabels: Record<MediaKind, string> = {
  image: "Image",
  news: "News / Press",
  video: "Video",
};

export default function MediaGalleryManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [filter, setFilter] = useState<MediaKind | "all">("all");
  const [viewMode, setViewMode] = useState<"list" | "form">("list");

  async function loadItems() {
    setLoading(true);
    const response = await fetch("/api/admin/media", { cache: "no-store" });
    const data = (await response.json().catch(() => null)) as {
      media?: MediaItem[];
      error?: string;
    } | null;

    if (!response.ok) {
      setError(data?.error ?? "Unable to fetch media items.");
      setLoading(false);
      return;
    }

    setItems(data?.media ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.kind === filter);
  }, [items, filter]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      kind: form.kind,
      title: form.title,
      imageUrl: form.imageUrl,
      category: form.category,
      description: form.description,
      excerpt: form.excerpt,
      location: form.location,
      linkUrl: form.linkUrl,
      duration: form.duration,
      publishedAt: form.publishedAt,
      isPublished: form.isPublished,
    };

    const response = await fetch(form.id ? `/api/admin/media/${form.id}` : "/api/admin/media", {
      method: form.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setError(data?.error ?? "Unable to save media item.");
      setSaving(false);
      return;
    }

    setForm(initialForm);
    setViewMode("list");
    setSaving(false);
    await loadItems();
  }

  function handleEdit(item: MediaItem) {
    setForm({
      id: item.id,
      kind: item.kind,
      title: item.title,
      imageUrl: item.imageUrl,
      category: item.category,
      description: item.description,
      excerpt: item.excerpt,
      location: item.location,
      linkUrl: item.linkUrl,
      duration: item.duration,
      publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 10) : "",
      isPublished: item.isPublished,
    });
    setViewMode("form");
  }

  function handleCreateNew() {
    setForm(initialForm);
    setViewMode("form");
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this media item?");
    if (!confirmed) return;

    const response = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Unable to delete media item.");
      return;
    }

    await loadItems();
  }

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[18px] border border-black/10 bg-white shadow-[0_20px_34px_-24px_rgb(0_0_0/0.3)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/8 px-6 py-4">
          <h3 className="text-lg font-semibold text-brand-black">All media items</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                filter === "all" ? "bg-brand-black text-white" : "bg-black/8 text-black/65"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("image")}
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                filter === "image" ? "bg-brand-black text-white" : "bg-black/8 text-black/65"
              }`}
            >
              Images
            </button>
            <button
              type="button"
              onClick={() => setFilter("news")}
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                filter === "news" ? "bg-brand-black text-white" : "bg-black/8 text-black/65"
              }`}
            >
              News
            </button>
            <button
              type="button"
              onClick={() => setFilter("video")}
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                filter === "video" ? "bg-brand-black text-white" : "bg-black/8 text-black/65"
              }`}
            >
              Videos
            </button>
            <button
              type="button"
              onClick={handleCreateNew}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] bg-brand-black px-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-brand-green"
            >
              <Plus className="h-4 w-4" />
              Create new
            </button>
          </div>
        </div>

        {error && viewMode === "list" ? <p className="px-6 pt-4 text-sm text-brand-red">{error}</p> : null}

        {loading ? (
          <div className="px-6 py-8 text-sm text-black/60">Loading media items...</div>
        ) : filteredItems.length === 0 ? (
          <div className="px-6 py-8 text-sm text-black/60">No media items yet.</div>
        ) : (
          <div className="divide-y divide-black/8">
            {filteredItems.map((item) => (
              <article key={item.id} className="px-6 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/55">
                      {kindLabels[item.kind]}
                    </p>
                    <h4 className="mt-1 text-base font-semibold text-brand-black">{item.title}</h4>
                    <p className="mt-1 text-xs text-black/60">{item.imageUrl}</p>
                    {item.excerpt ? <p className="mt-2 text-sm text-black/70">{item.excerpt}</p> : null}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      item.isPublished ? "bg-brand-green/10 text-brand-green" : "bg-black/8 text-black/65"
                    }`}
                  >
                    {item.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
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
        <section className="rounded-[18px] border border-black/10 bg-white px-6 py-6 shadow-[0_20px_34px_-24px_rgb(0_0_0/0.3)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red">Media Gallery</p>
          <h2 className="mt-3 text-3xl font-semibold text-brand-black">
            {form.id ? "Edit media item" : "Create media item"}
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Type</span>
              <select
                value={form.kind}
                onChange={(event) => setForm((prev) => ({ ...prev, kind: event.target.value as MediaKind }))}
                className={inputClass}
              >
                <option value="image">Image</option>
                <option value="news">News / Press</option>
                <option value="video">Video</option>
              </select>
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Category</span>
              <input
                value={form.category}
                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                className={inputClass}
                placeholder="Press Release, Highlights, Field Update"
              />
            </label>

            <label className="grid gap-1.5 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Title</span>
              <input
                required
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                className={inputClass}
              />
            </label>

            <label className="grid gap-1.5 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Image / Thumbnail URL</span>
              <input
                required
                value={form.imageUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                className={inputClass}
                placeholder="https://..."
              />
            </label>

            <label className="grid gap-1.5 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Description</span>
              <textarea
                rows={3}
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                className={textareaClass}
                placeholder="Long description"
              />
            </label>

            <label className="grid gap-1.5 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Excerpt</span>
              <textarea
                rows={3}
                value={form.excerpt}
                onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
                className={textareaClass}
                placeholder="Short summary (for news/press)"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Location</span>
              <input
                value={form.location}
                onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
                className={inputClass}
                placeholder="Rally crowd, Abuja"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Duration</span>
              <input
                value={form.duration}
                onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))}
                className={inputClass}
                placeholder="2:48"
              />
            </label>

            <label className="grid gap-1.5 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">External Link URL</span>
              <input
                value={form.linkUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, linkUrl: event.target.value }))}
                className={inputClass}
                placeholder="https://..."
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Published Date</span>
              <input
                type="date"
                value={form.publishedAt}
                onChange={(event) => setForm((prev) => ({ ...prev, publishedAt: event.target.value }))}
                className={inputClass}
              />
            </label>

            <label className="inline-flex items-center gap-2 text-sm text-brand-black">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) => setForm((prev) => ({ ...prev, isPublished: event.target.checked }))}
                className="h-4 w-4 rounded border-black/20 text-brand-green"
              />
              Published
            </label>

            {error ? <p className="text-sm text-brand-red md:col-span-2">{error}</p> : null}

            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-brand-black px-5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-brand-green disabled:cursor-not-allowed disabled:opacity-70"
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
                className="inline-flex min-h-11 items-center justify-center rounded-[10px] border border-black/15 px-5 text-sm font-semibold uppercase tracking-[0.16em] text-black/70 transition hover:border-brand-red hover:text-brand-red"
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
