"use client";

import { trackResumeDownload } from "@/lib/api";
import { toAttachmentUrl } from "@/lib/cloudinary";
import { RESUME_DOWNLOADED_EVENT } from "./ResumeDownloadToast";

export function triggerResumeDownload(fileUrl: string) {
  const link = document.createElement("a");
  link.href = toAttachmentUrl(fileUrl);
  link.download = "Karan-Patel-Resume.pdf";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();

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
