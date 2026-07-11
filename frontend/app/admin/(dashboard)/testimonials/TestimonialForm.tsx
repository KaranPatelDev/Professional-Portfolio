"use client";

import { useState } from "react";
import { adminDelete, adminSave } from "@/lib/api";
import type { Testimonial } from "@/lib/types";
import { Field, Input, SaveButton, Textarea, Toggle } from "@/components/admin/form-controls";
import { Card } from "@/components/ui";

type FormState = Omit<Testimonial, "id">;

export default function TestimonialForm({
  entry,
  onSaved,
}: {
  entry?: Testimonial;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<FormState>(
    entry ?? { project_id: null, quote: "", author: "", permission_granted: false }
  );
  const [pending, setPending] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      if (entry) await adminSave(`/api/testimonials/${entry.id}`, "PUT", form);
      else await adminSave("/api/testimonials", "POST", form);
      onSaved();
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!entry || !window.confirm("Delete this testimonial?")) return;
    await adminDelete(`/api/testimonials/${entry.id}`);
    onSaved();
  }

  return (
    <Card className="mb-4">
      <form onSubmit={handleSubmit}>
        <Field label="Quote">
          <Textarea value={form.quote} onChange={(e) => set("quote", e.target.value)} rows={3} required />
        </Field>
        <Field label="Author">
          <Input value={form.author} onChange={(e) => set("author", e.target.value)} required />
        </Field>
        <Toggle
          checked={form.permission_granted}
          onChange={(v) => set("permission_granted", v)}
          label="Permission granted to publish (required before it shows publicly)"
        />
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
