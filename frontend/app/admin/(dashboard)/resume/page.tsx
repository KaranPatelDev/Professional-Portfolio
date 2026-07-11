"use client";

import { useEffect, useState } from "react";
import { adminUploadResume, getResume } from "@/lib/api";
import type { Resume } from "@/lib/types";
import { Card } from "@/components/ui";

export default function AdminResumePage() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [uploading, setUploading] = useState(false);

  function reload() {
    getResume().then(setResume).catch(() => setResume(null));
  }

  useEffect(reload, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await adminUploadResume(file);
      reload();
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl mb-6">Resume</h1>
      <Card className="max-w-md">
        <p className="text-text-secondary text-sm mb-3">
          Current downloads tracked: {resume?.download_count ?? 0}
        </p>
        {resume?.file_url && (
          <a href={resume.file_url} target="_blank" rel="noopener noreferrer" className="text-accent text-sm block mb-4">
            View current resume &rarr;
          </a>
        )}
        <label className="block text-sm text-text-secondary mb-2">Upload new resume (PDF)</label>
        <input type="file" accept="application/pdf" onChange={handleUpload} disabled={uploading} />
        {uploading && <p className="text-text-secondary text-sm mt-2">Uploading…</p>}
      </Card>
    </div>
  );
}
