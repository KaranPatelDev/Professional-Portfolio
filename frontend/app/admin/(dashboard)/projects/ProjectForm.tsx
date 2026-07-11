"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminDelete, adminSave, adminUploadMedia } from "@/lib/api";
import type { Project } from "@/lib/types";
import { Field, Input, SaveButton, Textarea, Toggle } from "@/components/admin/form-controls";
import RichTextEditor from "@/components/admin/RichTextEditor";

type FormState = Omit<Project, "id" | "created_at" | "updated_at">;

const EMPTY: FormState = {
  slug: "",
  title: "",
  category: "",
  tags: "personal",
  status: "live",
  summary: "",
  role: "",
  stack: [],
  thumbnail_url: null,
  gallery_urls: [],
  live_url: "",
  github_url: "",
  featured: false,
  display_order: 0,
  body_html: "",
  metrics: {},
  freelance_status: null,
  hidden: false,
};

export default function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(project ?? EMPTY);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const { url } = await adminUploadMedia(file);
    set("thumbnail_url", url);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      if (project) {
        await adminSave(`/api/projects/${project.id}`, "PUT", form);
      } else {
        await adminSave("/api/projects", "POST", form);
      }
      router.push("/admin/projects");
      router.refresh();
    } catch {
      setError("Failed to save — check the slug is unique and all required fields are filled.");
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!project || !window.confirm("Delete this project?")) return;
    await adminDelete(`/api/projects/${project.id}`);
    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Slug (URL, unique)">
          <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
        </Field>
        <Field label="Title">
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Category">
          <Input value={form.category} onChange={(e) => set("category", e.target.value)} />
        </Field>
        <Field label="Tag">
          <select
            value={form.tags}
            onChange={(e) => set("tags", e.target.value as FormState["tags"])}
            className="w-full bg-surface border border-border rounded-[var(--radius-button)] px-3 py-2"
          >
            <option value="client_work">Client Work</option>
            <option value="personal">Personal Project</option>
            <option value="ai_experiment">AI Experiment</option>
          </select>
        </Field>
        <Field label="Status">
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value as FormState["status"])}
            className="w-full bg-surface border border-border rounded-[var(--radius-button)] px-3 py-2"
          >
            <option value="live">Live</option>
            <option value="in_development">In Development</option>
            <option value="concept">Concept</option>
          </select>
        </Field>
      </div>

      <Field label="Freelance pipeline status (admin-only, never shown publicly)">
        <select
          value={form.freelance_status ?? ""}
          onChange={(e) => set("freelance_status", (e.target.value || null) as FormState["freelance_status"])}
          className="w-full bg-surface border border-border rounded-[var(--radius-button)] px-3 py-2"
        >
          <option value="">Not applicable</option>
          <option value="potential_customer">Potential customer</option>
          <option value="in_progress">In progress</option>
          <option value="shipped">Done / shipped</option>
        </select>
      </Field>

      <Field label="Summary (one line)">
        <Textarea value={form.summary} onChange={(e) => set("summary", e.target.value)} rows={2} required />
      </Field>

      <Field label="Your role">
        <Textarea value={form.role ?? ""} onChange={(e) => set("role", e.target.value)} rows={2} />
      </Field>

      <Field label="Stack (comma-separated)">
        <Input
          value={form.stack.join(", ")}
          onChange={(e) => set("stack", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Live URL">
          <Input value={form.live_url ?? ""} onChange={(e) => set("live_url", e.target.value)} />
        </Field>
        <Field label="GitHub URL">
          <Input value={form.github_url ?? ""} onChange={(e) => set("github_url", e.target.value)} />
        </Field>
      </div>

      <Field label="Thumbnail image">
        <input type="file" accept="image/*" onChange={handleThumbnailUpload} />
        {form.thumbnail_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.thumbnail_url} alt="" className="mt-2 max-h-32 rounded" />
        )}
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <Toggle checked={form.featured} onChange={(v) => set("featured", v)} label="Featured (larger card, first position)" />
        <Field label="Display order (lower = first)">
          <Input
            type="number"
            value={form.display_order}
            onChange={(e) => set("display_order", Number(e.target.value))}
          />
        </Field>
      </div>

      <Toggle
        checked={form.hidden}
        onChange={(v) => set("hidden", v)}
        label="Hidden (excluded from public listing/sitemap — reachable only by direct link, e.g. as an easter-egg unlock)"
      />

      <Field label="Case study body">
        <RichTextEditor value={form.body_html ?? ""} onChange={(html) => set("body_html", html)} />
      </Field>

      {error && (
        <p role="alert" className="text-error text-sm mb-4">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <SaveButton pending={pending} />
        {project && (
          <button type="button" onClick={handleDelete} className="text-error text-sm">
            Delete project
          </button>
        )}
      </div>
    </form>
  );
}
