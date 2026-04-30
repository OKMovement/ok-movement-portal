"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { ChangeEvent } from "react";
import { Eye, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";

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
  "min-h-11 rounded-[8px] border border-black/12 bg-white px-3 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50";
const textareaClass =
  "rounded-[8px] border border-black/12 bg-white px-3 py-2 text-sm text-brand-black placeholder:text-black/35 focus-visible:border-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green/50";

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

const PAGE_SIZE = 10;

export default function MediaGalleryManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingPublish, setTogglingPublish] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [filter, setFilter] = useState<MediaKind | "all">("all");
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE)),
    [filteredItems.length],
  );

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

  async function handleDelete(item: MediaItem) {
    const confirmed = window.confirm(
      `Delete "${item.title}"? This action cannot be undone.`,
    );
    if (!confirmed) return;

    const response = await fetch(`/api/admin/media/${item.id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Unable to delete media item.");
      return;
    }

    await loadItems();
  }

  function getUploadContext(
    kind: MediaKind,
    target: "imageUrl" | "linkUrl",
  ): "media-image" | "media-video" | "media-file" {
    if (target === "imageUrl") return "media-image";
    if (kind === "video") return "media-video";
    if (kind === "news") return "media-file";
    return "media-image";
  }

  async function uploadAndSetUrl(event: ChangeEvent<HTMLInputElement>, target: "imageUrl" | "linkUrl") {
    const file = event.target.files?.[0];
    if (!file) return;

    const setUploading = target === "imageUrl" ? setUploadingThumbnail : setUploadingMedia;
    setUploading(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("file", file);
      payload.append("context", getUploadContext(form.kind, target));

      const response = await fetch("/api/admin/uploads/image", {
        method: "POST",
        body: payload,
      });

      const data = (await response.json().catch(() => null)) as { asset?: { url?: string }; error?: string } | null;
      const uploadedUrl = data?.asset?.url;

      if (!response.ok || !uploadedUrl) {
        setError(data?.error ?? "Unable to upload file.");
        return;
      }

      setForm((prev) => ({ ...prev, [target]: uploadedUrl }));
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function handlePreview(item: MediaItem) {
    if (item.kind === "news") return;
    setPreviewItem(item);
  }

  async function handleTogglePublishedFromModal() {
    if (!form.id) return;

    setTogglingPublish(true);
    const response = await fetch(`/api/admin/media/${form.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !form.isPublished }),
    });

    if (!response.ok) {
      setError("Unable to update publish status.");
      setTogglingPublish(false);
      return;
    }

    setForm((prev) => ({ ...prev, isPublished: !prev.isPublished }));
    await loadItems();
    setTogglingPublish(false);
  }

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-[0_20px_34px_-24px_rgb(0_0_0/0.3)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/8 px-6 py-4">
          <h3 className="text-lg font-semibold text-brand-black">All media items</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-[8px] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                filter === "all" ? "bg-brand-black text-white" : "bg-black/8 text-black/65"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("image")}
              className={`rounded-[8px] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                filter === "image" ? "bg-brand-black text-white" : "bg-black/8 text-black/65"
              }`}
            >
              Images
            </button>
            <button
              type="button"
              onClick={() => setFilter("news")}
              className={`rounded-[8px] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                filter === "news" ? "bg-brand-black text-white" : "bg-black/8 text-black/65"
              }`}
            >
              News
            </button>
            <button
              type="button"
              onClick={() => setFilter("video")}
              className={`rounded-[8px] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                filter === "video" ? "bg-brand-black text-white" : "bg-black/8 text-black/65"
              }`}
            >
              Videos
            </button>
            <button
              type="button"
              onClick={handleCreateNew}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] bg-brand-black px-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-brand-green"
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
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left">
              <thead className="bg-black/[0.03]">
                <tr className="text-[11px] uppercase tracking-[0.12em] text-black/60">
                  <th className="px-6 py-3 font-semibold">Media</th>
                  <th className="px-6 py-3 font-semibold">Type</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/8">
                {paginatedItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-16 w-24 rounded-[8px] border border-black/10 object-cover"
                          loading="lazy"
                        />
                        <div>
                          <p className="text-sm font-semibold text-brand-black">{item.title}</p>
                          {item.excerpt ? (
                            <p className="mt-1 max-w-md truncate text-xs text-black/60">{item.excerpt}</p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/65">
                      {kindLabels[item.kind]}
                    </td>
                    <td className="px-6 py-4 text-sm text-black/70">{item.category || "-"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-[8px] px-2.5 py-1 text-xs font-semibold ${
                          item.isPublished ? "bg-brand-green/10 text-brand-green" : "bg-black/8 text-black/65"
                        }`}
                      >
                        {item.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handlePreview(item)}
                          disabled={item.kind === "news"}
                          className="inline-flex items-center gap-1 rounded-[8px] border border-black/12 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-black/70 transition hover:border-brand-green hover:text-brand-green disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Preview
                        </button>
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
                          onClick={() => handleDelete(item)}
                          className="inline-flex items-center gap-1 rounded-[8px] border border-brand-red/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-red transition hover:bg-brand-red hover:text-white"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/8 px-6 py-4">
              <p className="text-xs text-black/60">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, filteredItems.length)} of{" "}
                {filteredItems.length}
              </p>
              <div className="flex items-center gap-2">
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
          </div>
        )}
      </section>

      {viewMode === "form" ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-5xl overflow-hidden rounded-[8px] border border-black/10 bg-white shadow-[0_30px_60px_-24px_rgb(0_0_0/0.5)]">
            <div className="flex items-center justify-between border-b border-black/8 px-6 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-red">Media Gallery</p>
                <h2 className="mt-2 text-2xl font-semibold text-brand-black">
                  {form.id ? "Edit media item" : "Create media item"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setForm(initialForm);
                  setViewMode("list");
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-black/12 text-black/70 transition hover:border-brand-red hover:text-brand-red"
                aria-label="Close media form"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[78vh] overflow-y-auto px-6 py-6">
              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
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
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-[8px] border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-black/70 transition hover:border-brand-green hover:text-brand-green">
                  {uploadingThumbnail ? "Uploading..." : "Upload thumbnail"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => uploadAndSetUrl(event, "imageUrl")}
                    disabled={uploadingThumbnail}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-black/55">PNG, JPG, WEBP up to 20MB</span>
              </div>
              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt="Media preview"
                  className="mt-1 h-40 w-full rounded-[8px] border border-black/10 object-cover sm:w-64"
                />
              ) : null}
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
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/65">
                {form.kind === "video" ? "Video URL" : form.kind === "news" ? "Article / File URL" : "External Link URL"}
              </span>
              <input
                value={form.linkUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, linkUrl: event.target.value }))}
                className={inputClass}
                placeholder="https://..."
              />
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-[8px] border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-black/70 transition hover:border-brand-green hover:text-brand-green">
                  {uploadingMedia ? "Uploading..." : form.kind === "video" ? "Upload video" : "Upload file"}
                  <input
                    type="file"
                    accept={form.kind === "video" ? "video/*" : ".pdf,.doc,.docx,.txt,.ppt,.pptx"}
                    onChange={(event) => uploadAndSetUrl(event, "linkUrl")}
                    disabled={uploadingMedia}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-black/55">
                  {form.kind === "video" ? "MP4/MOV up to 100MB" : "PDF, DOC, DOCX, TXT, PPT up to 20MB"}
                </span>
              </div>
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
                className="h-4 w-4 rounded-[8px] border-black/20 text-brand-green"
              />
              Published
            </label>

            {error ? <p className="text-sm text-brand-red md:col-span-2">{error}</p> : null}

            <div className="flex flex-wrap gap-3 md:col-span-2">
              {form.id ? (
                <button
                  type="button"
                  onClick={handleTogglePublishedFromModal}
                  disabled={togglingPublish}
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border px-5 text-sm font-semibold uppercase tracking-[0.16em] transition disabled:cursor-not-allowed disabled:opacity-70 ${
                    form.isPublished
                      ? "border-brand-red/25 text-brand-red hover:bg-brand-red hover:text-white"
                      : "border-brand-green/30 text-brand-green hover:bg-brand-green hover:text-white"
                  }`}
                >
                  {togglingPublish ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {form.isPublished ? "Unpublish" : "Publish"}
                </button>
              ) : null}
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
            </div>
          </div>
        </div>
      ) : null}

      {previewItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-4xl rounded-[8px] border border-black/10 bg-white p-4 shadow-[0_30px_60px_-24px_rgb(0_0_0/0.5)]">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/55">
                  {kindLabels[previewItem.kind]}
                </p>
                <h3 className="text-base font-semibold text-brand-black">{previewItem.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-black/12 text-black/70 transition hover:border-brand-red hover:text-brand-red"
                aria-label="Close preview"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {previewItem.kind === "video" ? (
              previewItem.linkUrl ? (
                <video
                  src={previewItem.linkUrl}
                  controls
                  className="h-auto max-h-[70vh] w-full rounded-[8px] border border-black/10 bg-black"
                />
              ) : (
                <p className="rounded-[8px] border border-black/10 bg-black/5 p-4 text-sm text-black/65">
                  No video URL attached for this item.
                </p>
              )
            ) : (
              <img
                src={previewItem.imageUrl}
                alt={previewItem.title}
                className="h-auto max-h-[70vh] w-full rounded-[8px] border border-black/10 object-contain"
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
