import { getResume } from "@/lib/api";
import ResumeDownload from "./ResumeDownload";
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
          <ResumeDownload fileUrl={resume.file_url} />
        ) : (
          <p className="text-text-secondary">Resume not uploaded yet — check back soon.</p>
        )}
      </Reveal>
    </div>
  );
}
