import { getExperience } from "@/lib/api";
import { Card, RichText } from "@/components/ui";
import Reveal from "@/components/Reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience | Karan Patel",
  description: "Backend Developer Intern experience — Magenta Connects.",
};

export default async function ExperiencePage() {
  const experience = await getExperience().catch(() => []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Reveal>
        <h1 className="font-heading text-3xl mb-8">Experience</h1>
      </Reveal>
      <div className="space-y-6">
        {experience.map((entry, i) => (
          <Reveal key={entry.id} delay={i * 0.05}>
          <Card>
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <h2 className="font-heading text-xl">
                {entry.role} &mdash; {entry.company}
              </h2>
              <span className="text-text-secondary text-sm">
                {entry.start_date} &ndash; {entry.end_date ?? "Present"}
              </span>
            </div>
            <p className="text-text-secondary mb-4">{entry.summary}</p>
            {entry.metrics.length > 0 && (
              <ul className="flex flex-wrap gap-2 mb-4">
                {entry.metrics.map((m) => (
                  <li key={m} className="font-mono text-xs text-text-mono bg-surface-elevated border border-border rounded px-2 py-1">
                    {m}
                  </li>
                ))}
              </ul>
            )}
            {entry.tools.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {entry.tools.map((t) => (
                  <span key={t} className="text-xs text-text-secondary">
                    {t}
                  </span>
                ))}
              </div>
            )}
            {entry.body_html && <RichText html={entry.body_html} />}
          </Card>
          </Reveal>
        ))}
        {experience.length === 0 && <p className="text-text-secondary">No experience entries yet.</p>}
      </div>
    </div>
  );
}
