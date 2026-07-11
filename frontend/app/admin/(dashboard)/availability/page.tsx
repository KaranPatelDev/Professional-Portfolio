"use client";

import { useEffect, useState } from "react";
import { adminSave, getAvailability } from "@/lib/api";
import { Field, Input, SaveButton } from "@/components/admin/form-controls";
import { Card } from "@/components/ui";

export default function AdminAvailabilityPage() {
  const [statusText, setStatusText] = useState("");
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAvailability().then((a) => setStatusText(a.status_text));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setSaved(false);
    try {
      await adminSave("/api/availability", "PUT", { status_text: statusText });
      setSaved(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl mb-6">Availability</h1>
      <Card className="max-w-md">
        <form onSubmit={handleSubmit}>
          <Field label="Status text (shown on homepage hero)">
            <Input value={statusText} onChange={(e) => setStatusText(e.target.value)} required />
          </Field>
          <SaveButton pending={pending} />
          {saved && <p className="text-accent-live text-sm mt-2">Saved.</p>}
        </form>
      </Card>
    </div>
  );
}
