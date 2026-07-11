import { getResume } from "@/lib/api";
import ResumeDownloadButton from "@/components/ResumeDownloadButton";
import Reveal from "@/components/Reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume | Karan Patel",
};

export default async function ResumePage() {
  const resume = await getResume().catch(() => null);

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-24 text-center">
      <Reveal>
        <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight mb-8">Resume</h1>
        {resume?.file_url ? (
          <ResumeDownloadButton
            fileUrl={resume.file_url}
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-accent to-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-accent/20 transition-all duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-accent/40 active:scale-[0.98]"
          >
            Download Resume (PDF)
          </ResumeDownloadButton>
        ) : (
          <p className="text-text-secondary">Resume not uploaded yet — check back soon.</p>
        )}
      </Reveal>
    </div>
  );
}
