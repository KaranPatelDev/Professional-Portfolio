"use client";

import { trackResumeDownload } from "@/lib/api";
import { RESUME_DOWNLOADED_EVENT } from "./ResumeDownloadToast";

// Opens the resume in a new tab rather than forcing a download — the
// forced-download path (Cloudinary fl_attachment + <a download>) was
// unreliable cross-origin and left users with a broken/unrecognized file.
export function triggerResumeDownload(fileUrl: string) {
  window.open(fileUrl, "_blank", "noopener,noreferrer");

  trackResumeDownload(typeof window !== "undefined" ? window.location.pathname : undefined).catch(() => {});
  window.dispatchEvent(new CustomEvent(RESUME_DOWNLOADED_EVENT));
}

export default function ResumeDownloadButton({
  fileUrl,
  className,
  children,
}: {
  fileUrl: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button onClick={() => triggerResumeDownload(fileUrl)} className={className}>
      {children}
    </button>
  );
}
