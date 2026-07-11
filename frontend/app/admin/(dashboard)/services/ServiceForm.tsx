"use client";

import { useState } from "react";
import { adminDelete, adminSave } from "@/lib/api";
import type { Service } from "@/lib/types";
import { Field, Input, SaveButton, Textarea, Toggle } from "@/components/admin/form-controls";
import { Card } from "@/components/ui";

type FormState = Omit<Service, "id">;

export default function ServiceForm({ entry, onSaved }: { entry?: Service; onSaved: () => void }) {
  const [form, setForm] = useState<FormState>(
    entry ?? {
      name: "",
      client_problem: "",
      deliverable: "",
      stack: [],
      proof: "",
      public: true,
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
      if (entry) await adminSave(`/api/services/${entry.id}`, "PUT", form);
      else await adminSave("/api/services", "POST", form);
      onSaved();
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!entry || !window.confirm("Delete this service?")) return;
    await adminDelete(`/api/services/${entry.id}`);
    onSaved();
  }

  return (
    <Card className="mb-4">
      <form onSubmit={handleSubmit}>
        <Field label="Name">
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </Field>
        <Field label="Client problem">
          <Textarea value={form.client_problem} onChange={(e) => set("client_problem", e.target.value)} rows={2} required />
        </Field>
        <Field label="What you deliver">
          <Textarea value={form.deliverable} onChange={(e) => set("deliverable", e.target.value)} rows={2} required />
        </Field>
        <Field label="Stack (comma-separated)">
          <Input
            value={form.stack.join(", ")}
            onChange={(e) => set("stack", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          />
        </Field>
        <Field label="Proof">
          <Input value={form.proof ?? ""} onChange={(e) => set("proof", e.target.value)} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <Toggle checked={form.public} onChange={(v) => set("public", v)} label="Public (shown on site)" />
          <Field label="Display order">
            <Input type="number" value={form.display_order} onChange={(e) => set("display_order", Number(e.target.value))} />
          </Field>
        </div>
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
