"use client";

import { trackResumeDownload } from "@/lib/api";

export default function ResumeDownload({ fileUrl }: { fileUrl: string }) {
  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackResumeDownload().catch(() => {});
      }}
      className="inline-flex items-center rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
    >
      Download Resume
    </a>
  );
}
