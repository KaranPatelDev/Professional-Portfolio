"use client";

import { useState } from "react";
import { adminDelete, adminSave } from "@/lib/api";
import type { BuildLogPost } from "@/lib/types";
import { Field, Input, SaveButton, Textarea, Toggle } from "@/components/admin/form-controls";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Card } from "@/components/ui";

type FormState = Omit<BuildLogPost, "id" | "published_at">;

export default function BuildLogForm({ post, onSaved }: { post?: BuildLogPost; onSaved: () => void }) {
  const [form, setForm] = useState<FormState>(
    post ?? { slug: "", title: "", summary: "", body_html: "", published: true, github_repo: null }
  );
  const [pending, setPending] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      if (post) await adminSave(`/api/build-log/${post.id}`, "PUT", form);
      else await adminSave("/api/build-log", "POST", form);
      onSaved();
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!post || !window.confirm("Delete this post?")) return;
    await adminDelete(`/api/build-log/${post.id}`);
    onSaved();
  }

  return (
    <Card className="mb-4">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Slug (URL, unique)">
            <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
          </Field>
          <Field label="Title">
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </Field>
        </div>
        <Field label="Summary (one line, shown on the index)">
          <Textarea value={form.summary ?? ""} onChange={(e) => set("summary", e.target.value)} rows={2} />
        </Field>
        <Field label="GitHub repo (owner/repo) — shows a live commit timeline on the post, optional">
          <Input
            value={form.github_repo ?? ""}
            onChange={(e) => set("github_repo", e.target.value || null)}
            placeholder="e.g. KaranPatelDev/portfolio"
          />
        </Field>
        <Field label="Post body">
          <RichTextEditor value={form.body_html} onChange={(html) => set("body_html", html)} />
        </Field>
        <Toggle checked={form.published} onChange={(v) => set("published", v)} label="Published (visible on the public site)" />
        <div className="flex items-center gap-3">
          <SaveButton pending={pending} />
          {post && (
            <button type="button" onClick={handleDelete} className="text-error text-sm">
              Delete
            </button>
          )}
        </div>
      </form>
    </Card>
  );
}
