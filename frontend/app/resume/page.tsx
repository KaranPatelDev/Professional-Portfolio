import { getResume } from "@/lib/api";
import ResumeDownload from "./ResumeDownload";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume | Karan Patel",
};

export default async function ResumePage() {
  const resume = await getResume().catch(() => null);

  return (
    <div className="max-w-lg mx-auto px-6 py-16 text-center">
      <h1 className="font-heading text-3xl mb-6">Resume</h1>
      {resume?.file_url ? (
        <ResumeDownload fileUrl={resume.file_url} />
      ) : (
        <p className="text-text-secondary">Resume not uploaded yet — check back soon.</p>
      )}
    </div>
  );
}
