"use client";

import { useState } from "react";
import { adminSave } from "@/lib/api";
import type { SiteContent } from "@/lib/types";
import { Field, Input, SaveButton } from "@/components/admin/form-controls";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Card } from "@/components/ui";

export default function ContentBlockForm({
  block,
  onSaved,
}: {
  block: Partial<SiteContent> & { key: string };
  onSaved: () => void;
}) {
  const [label, setLabel] = useState(block.label ?? "");
  const [page, setPage] = useState(block.page ?? "homepage");
  const [valueHtml, setValueHtml] = useState(block.value_html ?? "");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      await adminSave(`/api/content/${block.key}`, "PUT", { key: block.key, label, page, value_html: valueHtml });
      onSaved();
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="mb-4">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Key (identifies this block)">
            <Input value={block.key} disabled className="opacity-60" />
          </Field>
          <Field label="Page">
            <Input value={page} onChange={(e) => setPage(e.target.value)} />
          </Field>
        </div>
        <Field label="Label">
          <Input value={label} onChange={(e) => setLabel(e.target.value)} required />
        </Field>
        <Field label="Content">
          <RichTextEditor value={valueHtml} onChange={setValueHtml} />
        </Field>
        <SaveButton pending={pending} />
      </form>
    </Card>
  );
}
