"use client";

import { useEffect, useState } from "react";
import { adminListResumeDownloads, adminUploadResume, getResume } from "@/lib/api";
import type { Resume, ResumeDownloadEvent } from "@/lib/types";
import { Card } from "@/components/ui";

export default function AdminResumePage() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [downloads, setDownloads] = useState<ResumeDownloadEvent[]>([]);
  const [uploading, setUploading] = useState(false);

  function reload() {
    getResume().then(setResume).catch(() => setResume(null));
    adminListResumeDownloads().then(setDownloads).catch(() => setDownloads([]));
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
      <Card className="max-w-md mb-6">
        <p className="text-text-secondary text-sm mb-3">
          Total downloads tracked: {resume?.download_count ?? 0}
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

      <h2 className="font-heading text-lg mb-3">Who's downloaded it</h2>
      <Card className="max-w-2xl">
        {downloads.length === 0 ? (
          <p className="text-text-secondary text-sm">No downloads yet.</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {downloads.map((d) => (
              <div key={d.id} className="text-sm border-b border-border pb-2 last:border-0">
                <p className="text-text-primary">{new Date(d.created_at).toLocaleString()}</p>
                <p className="text-text-secondary text-xs">
                  From: {d.referrer || "unknown page"} · {d.user_agent || "unknown device"}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
