import {
  getAvailability,
  getContentBlocks,
  getExperience,
  getProjects,
  getServices,
} from "@/lib/api";
import { Card, GhostButton, PrimaryButton, RichText, StatChip, StatusDot, Tag } from "@/components/ui";
import Link from "next/link";

function contentValue(blocks: { key: string; value_html: string }[], key: string, fallback: string) {
  return blocks.find((b) => b.key === key)?.value_html ?? fallback;
}

export default async function Home() {
  const [availability, content, experience, projects, services] = await Promise.all([
    getAvailability().catch(() => null),
    getContentBlocks().catch(() => []),
    getExperience().catch(() => []),
    getProjects().catch(() => []),
    getServices().catch(() => []),
  ]);

  const heroHeadline = contentValue(content, "hero_headline", "<p>I build backend systems that businesses actually run on.</p>");
  const heroSupporting = contentValue(
    content,
    "hero_supporting",
    "<p>Backend-focused full-stack engineer specializing in Python and FastAPI.</p>"
  );

  const featuredProjects = [...projects].sort((a, b) => a.display_order - b.display_order).slice(0, 3);
  const latestExperience = experience[0];
  const allStack = Array.from(new Set(projects.flatMap((p) => p.stack))).slice(0, 16);

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Hero */}
      <section className="py-20 grid gap-8 md:grid-cols-2 items-center">
        <div>
          {availability && (
            <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
              <StatusDot live />
              <span>{availability.status_text}</span>
            </div>
          )}
          <RichText html={heroHeadline} />
          <div className="text-text-secondary mt-2">
            <RichText html={heroSupporting} />
          </div>
          <div className="flex gap-3 mt-6">
            <PrimaryButton href="/resume">View Resume</PrimaryButton>
            <GhostButton href="/projects/dnd-purchase">See D&amp;D Purchase &rarr;</GhostButton>
          </div>
        </div>
        <Card>
          <p className="font-mono text-xs text-text-mono mb-2">request-flow.diagram</p>
          <pre className="font-mono text-xs text-text-secondary leading-relaxed overflow-x-auto">
{`client ──▶ FastAPI ──▶ Postgres
              │
              ▼
        validation (Pydantic)
              │
              ▼
        response ──▶ client`}
          </pre>
        </Card>
      </section>

      {/* Proof strip */}
      <section className="py-10 border-t border-border">
        <h2 className="font-heading text-xl mb-6">Production experience, not just projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatChip label="FastAPI endpoints shipped" value="10+" />
          <StatChip label="DB response time improvement" value="~30%" />
          <StatChip label="Production issues resolved" value="15+" />
        </div>
      </section>

      {/* Experience preview */}
      {latestExperience && (
        <section className="py-10 border-t border-border">
          <h2 className="font-heading text-xl mb-6">
            {latestExperience.role} &mdash; {latestExperience.company}
          </h2>
          <Card>
            <p className="text-text-secondary">{latestExperience.summary}</p>
            <div className="mt-4">
              <GhostButton href="/experience">View full experience</GhostButton>
            </div>
          </Card>
        </section>
      )}

      {/* Featured work */}
      {featuredProjects.length > 0 && (
        <section className="py-10 border-t border-border">
          <h2 className="font-heading text-xl mb-6">Selected work</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {featuredProjects.map((project) => (
              <Link key={project.slug} href={`/projects/${project.slug}`}>
                <Card className={project.featured ? "md:col-span-3" : ""}>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag>{project.tags.replace("_", " ")}</Tag>
                    <Tag>{project.status}</Tag>
                  </div>
                  <h3 className="font-heading text-lg mb-2">{project.title}</h3>
                  <p className="text-text-secondary text-sm mb-3">{project.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.slice(0, 5).map((s) => (
                      <span key={s} className="font-mono text-xs text-text-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Stack */}
      {allStack.length > 0 && (
        <section className="py-10 border-t border-border">
          <h2 className="font-heading text-xl mb-6">Core stack</h2>
          <div className="flex flex-wrap gap-3">
            {allStack.map((s) => (
              <span key={s} className="font-mono text-xs text-text-mono bg-surface border border-border rounded px-2 py-1">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Freelance CTA */}
      {services.length > 0 && (
        <section className="py-10 border-t border-border">
          <Card className="text-center py-10">
            <h2 className="font-heading text-xl mb-3">Need something built?</h2>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              I take freelance backend/full-stack projects for founders and small businesses who need
              something built and shipped, not just prototyped.
            </p>
            <PrimaryButton href="/work-with-me">Work with me</PrimaryButton>
          </Card>
        </section>
      )}
    </div>
  );
}
