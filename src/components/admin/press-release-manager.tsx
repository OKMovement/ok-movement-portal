"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

type PressRelease = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  excerpt: string;
  body: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const inputClass =
  "min-h-11 rounded-[10px] border border-black/12 bg-white px-3 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50";

const textareaClass =
  "rounded-[10px] border border-black/12 bg-white px-3 py-2 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50";

  const initialForm = {
  id: "",
  title: "",
  imageUrl: "",
  excerpt: "",
  body: "",
  published: false,
};

export default function PressReleaseManager() {
  const [items, setItems] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [viewMode, setViewMode] = useState<"list" | "form">("list");

  async function loadPressReleases() {
    setLoading(true);
    const response = await fetch("/api/admin/press-releases", { cache: "no-store" });
    const data = (await response.json()) as { releases?: PressRelease[]; error?: string };
    if (!response.ok) {
      setError(data.error ?? "Unable to fetch press releases.");
      setLoading(false);
      return;
    }
    setItems(data.releases ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadPressReleases();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      imageUrl: form.imageUrl,
      excerpt: form.excerpt,
      body: form.body,
      published: form.published,
    };

    const response = await fetch(
      form.id ? `/api/admin/press-releases/${form.id}` : "/api/admin/press-releases",
      {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const data = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setError(data?.error ?? "Unable to save press release.");
      setSaving(false);
      return;
    }

    setForm(initialForm);
    setViewMode("list");
    setSaving(false);
    await loadPressReleases();
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("file", file);
      payload.append("context", "press-release");

      const response = await fetch("/api/admin/uploads/image", {
        method: "POST",
        body: payload,
      });

      const data = (await response.json().catch(() => null)) as
        | { image?: { url?: string }; error?: string }
        | null;
      const uploadedUrl = data?.image?.url;

      if (!response.ok || !uploadedUrl) {
        setError(data?.error ?? "Unable to upload press release image.");
        return;
      }

      setForm((prev) => ({ ...prev, imageUrl: uploadedUrl }));
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this press release?");
    if (!confirmed) return;

    const response = await fetch(`/api/admin/press-releases/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Unable to delete press release.");
      return;
    }

    await loadPressReleases();
  }

  function handleEdit(item: PressRelease) {
    setForm({
      id: item.id,
      title: item.title,
      imageUrl: item.imageUrl ?? "",
      excerpt: item.excerpt,
      body: item.body,
      published: item.published,
    });
    setViewMode("form");
  }

  function handleCreateNew() {
    setForm(initialForm);
    setViewMode("form");
  }

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[18px] border border-black/10 bg-white shadow-[0_20px_34px_-24px_rgb(0_0_0/0.3)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/8 px-6 py-4">
          <h3 className="text-lg font-semibold text-brand-black">All press releases</h3>
          <button
            type="button"
            onClick={handleCreateNew}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] bg-brand-black px-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-brand-green"
          >
            <Plus className="h-4 w-4" />
            Create new
          </button>
        </div>

        {error && viewMode === "list" ? (
          <p className="px-6 pt-4 text-sm text-brand-red">{error}</p>
        ) : null}

        {loading ? (
          <div className="px-6 py-8 text-sm text-black/60">Loading press releases...</div>
        ) : items.length === 0 ? (
          <div className="px-6 py-8 text-sm text-black/60">No press releases yet.</div>
        ) : (
          <div className="divide-y divide-black/8">
            {items.map((item) => (
              <article key={item.id} className="px-6 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-semibold text-brand-black">{item.title}</h4>
                    <p className="mt-1 text-xs uppercase tracking-[0.15em] text-black/55">/{item.slug}</p>
                    {item.imageUrl ? <p className="mt-1 text-xs text-black/50">Image attached</p> : null}
                    <p className="mt-2 max-w-3xl text-sm text-black/70">{item.excerpt}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      item.published
                        ? "bg-brand-green/10 text-brand-green"
                        : "bg-black/8 text-black/65"
                    }`}
                  >
                    {item.published ? "Published" : "Draft"}
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red">Press Releases</p>
          <h2 className="mt-3 text-3xl font-semibold text-brand-black">
            {form.id ? "Edit press release" : "Create press release"}
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Title</span>
              <input
                required
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                className={inputClass}
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">
                Cover Image
              </span>
              <input
                required
                value={form.imageUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                className={inputClass}
                placeholder="https://..."
              />
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-[10px] border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-black/70 transition hover:border-brand-green hover:text-brand-green">
                  {uploadingImage ? "Uploading..." : "Upload from device"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-black/55">PNG, JPG, WEBP up to 10MB</span>
              </div>
              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt="Press release image preview"
                  className="mt-1 h-40 w-full rounded-[10px] border border-black/10 object-cover sm:w-64"
                />
              ) : null}
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Excerpt</span>
              <textarea
                required
                rows={3}
                value={form.excerpt}
                onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
                className={textareaClass}
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">Body</span>
              <textarea
                required
                rows={8}
                value={form.body}
                onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
                className={textareaClass}
              />
            </label>

            <label className="inline-flex items-center gap-2 text-sm text-brand-black">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(event) => setForm((prev) => ({ ...prev, published: event.target.checked }))}
                className="h-4 w-4 rounded border-black/20 text-brand-green"
              />
              Publish immediately
            </label>

            {error ? <p className="text-sm text-brand-red">{error}</p> : null}

            <div className="flex flex-wrap gap-3">
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
