"use client";

import { useEffect, useState } from "react";
import { getContentBlocks } from "@/lib/api";
import type { SiteContent } from "@/lib/types";
import ContentBlockForm from "./ContentBlockForm";
import { Field, Input } from "@/components/admin/form-controls";

export default function AdminContentPage() {
  const [blocks, setBlocks] = useState<SiteContent[]>([]);
  const [newKey, setNewKey] = useState("");
  const [showNew, setShowNew] = useState(false);

  function reload() {
    getContentBlocks().then(setBlocks).catch(() => setBlocks([]));
  }

  useEffect(reload, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl">Site Content</h1>
        <button onClick={() => setShowNew(true)} className="text-accent text-sm">
          + New content block
        </button>
      </div>

      {showNew && (
        <div className="mb-4 max-w-sm">
          <Field label="New block key (e.g. hero_headline)">
            <Input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value.replace(/\s+/g, "_").toLowerCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newKey) {
                  setBlocks((b) => [...b, { id: -1, key: newKey, label: newKey, value_html: "", page: "homepage" }]);
                  setNewKey("");
                  setShowNew(false);
                }
              }}
            />
          </Field>
        </div>
      )}

      {blocks.map((block) => (
        <ContentBlockForm key={block.key} block={block} onSaved={reload} />
      ))}
    </div>
  );
}
