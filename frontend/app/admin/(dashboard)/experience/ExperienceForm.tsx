"use client";

import { useState } from "react";
import { adminDelete, adminSave } from "@/lib/api";
import type { Experience } from "@/lib/types";
import { Field, Input, SaveButton, Textarea } from "@/components/admin/form-controls";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Card } from "@/components/ui";

type FormState = Omit<Experience, "id">;

export default function ExperienceForm({
  entry,
  onSaved,
}: {
  entry?: Experience;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<FormState>(
    entry ?? {
      company: "",
      role: "",
      start_date: "",
      end_date: "",
      summary: "",
      metrics: [],
      tools: [],
      body_html: "",
      display_order: 0,
    }
  );
  const [pending, setPending] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      if (entry) {
        await adminSave(`/api/experience/${entry.id}`, "PUT", form);
      } else {
        await adminSave("/api/experience", "POST", form);
      }
      onSaved();
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!entry || !window.confirm("Delete this entry?")) return;
    await adminDelete(`/api/experience/${entry.id}`);
    onSaved();
  }

  return (
    <Card className="mb-4">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Company">
            <Input value={form.company} onChange={(e) => set("company", e.target.value)} required />
          </Field>
          <Field label="Role">
            <Input value={form.role} onChange={(e) => set("role", e.target.value)} required />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start date">
            <Input value={form.start_date} onChange={(e) => set("start_date", e.target.value)} required />
          </Field>
          <Field label="End date (blank = present)">
            <Input value={form.end_date ?? ""} onChange={(e) => set("end_date", e.target.value)} />
          </Field>
        </div>
        <Field label="Summary">
          <Textarea value={form.summary} onChange={(e) => set("summary", e.target.value)} rows={3} required />
        </Field>
        <Field label="Metrics (comma-separated)">
          <Input
            value={form.metrics.join(", ")}
            onChange={(e) => set("metrics", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          />
        </Field>
        <Field label="Tools (comma-separated)">
          <Input
            value={form.tools.join(", ")}
            onChange={(e) => set("tools", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          />
        </Field>
        <Field label="Narrative (optional)">
          <RichTextEditor value={form.body_html ?? ""} onChange={(html) => set("body_html", html)} />
        </Field>
        <div className="flex items-center gap-3">
          <SaveButton pending={pending} />
          {entry && (
            <button type="button" onClick={handleDelete} className="text-error text-sm">
              Delete
            </button>
          )}
        </div>
      </form>
    </Card>
  );
}
