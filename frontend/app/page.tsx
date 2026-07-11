import {
  getAvailability,
  getContentBlocks,
  getExperience,
  getProjects,
  getServices,
} from "@/lib/api";
import { Card, GhostButton, PrimaryButton, RichText, StatChip, StatusDot, Tag } from "@/components/ui";
import { BentoGrid, BentoCell } from "@/components/BentoGrid";
import Reveal from "@/components/Reveal";
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

  const sortedProjects = [...projects].sort((a, b) => a.display_order - b.display_order);
  const featuredProject = sortedProjects.find((p) => p.featured) ?? sortedProjects[0];
  const otherProjects = sortedProjects.filter((p) => p.slug !== featuredProject?.slug).slice(0, 2);
  const latestExperience = experience[0];
  const allStack = Array.from(new Set(projects.flatMap((p) => p.stack))).slice(0, 16);

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Hero */}
      <section className="relative py-24 md:py-32 grid gap-8 md:grid-cols-2 items-center overflow-hidden">
        <div className="hero-glow" />
        <div className="absolute inset-x-0 top-0 h-full bg-dot-grid pointer-events-none" />
        <Reveal className="relative z-10">
          {availability && (
            <div className="inline-flex items-center gap-2 text-sm text-text-secondary mb-5 bg-surface/80 border border-border rounded-full px-3 py-1">
              <StatusDot live />
              <span>{availability.status_text}</span>
            </div>
          )}
          <div className="hero-headline">
            <RichText html={heroHeadline} />
          </div>
          <div className="hero-supporting mt-3 max-w-md">
            <RichText html={heroSupporting} />
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            <PrimaryButton href="/resume">View Resume</PrimaryButton>
            <GhostButton href="/projects/dnd-purchase">See D&amp;D Purchase &rarr;</GhostButton>
          </div>
        </Reveal>
        <Reveal delay={0.15} className="relative z-10">
          <Card featured>
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
        </Reveal>
      </section>

      {/* Bento panel: stats, experience, featured project, stack, freelance CTA */}
      <section className="py-10 border-t border-border">
        <BentoGrid>
          <BentoCell span="1x1">
            <Reveal>
              <StatChip label="FastAPI endpoints shipped" value="10+" />
            </Reveal>
          </BentoCell>
          <BentoCell span="1x1">
            <Reveal delay={0.05}>
              <StatChip label="DB response time improvement" value="~30%" />
            </Reveal>
          </BentoCell>
          <BentoCell span="1x1">
            <Reveal delay={0.1}>
              <StatChip label="Production issues resolved" value="15+" />
            </Reveal>
          </BentoCell>
          <BentoCell span="1x1">
            {latestExperience && (
              <Reveal delay={0.15} className="h-full">
                <Card className="h-full flex flex-col justify-center">
                  <p className="text-xs text-text-secondary uppercase font-mono mb-1">Currently</p>
                  <p className="font-heading text-sm leading-snug">
                    {latestExperience.role}
                    <br />
                    <span className="text-text-secondary font-sans">{latestExperience.company}</span>
                  </p>
                </Card>
              </Reveal>
            )}
          </BentoCell>

          {featuredProject && (
            <BentoCell span="2x2">
              <Reveal delay={0.1} className="h-full">
                <Link href={`/projects/${featuredProject.slug}`} className="block h-full">
                  <Card featured className="h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag>{featuredProject.tags.replace("_", " ")}</Tag>
                      <Tag>{featuredProject.status}</Tag>
                    </div>
                    <h3 className="font-heading text-xl mb-2">{featuredProject.title}</h3>
                    <p className="text-text-secondary text-sm mb-4">{featuredProject.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {featuredProject.stack.slice(0, 6).map((s) => (
                        <span key={s} className="font-mono text-xs text-text-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  </Card>
                </Link>
              </Reveal>
            </BentoCell>
          )}

          {otherProjects.map((project, i) => (
            <BentoCell span="2x1" key={project.slug}>
              <Reveal delay={0.15 + i * 0.05} className="h-full">
                <Link href={`/projects/${project.slug}`} className="block h-full">
                  <Card className="h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag>{project.status}</Tag>
                    </div>
                    <h3 className="font-heading text-base mb-1">{project.title}</h3>
                    <p className="text-text-secondary text-sm">{project.summary}</p>
                  </Card>
                </Link>
              </Reveal>
            </BentoCell>
          ))}

          {allStack.length > 0 && (
            <BentoCell span="2x1">
              <Reveal delay={0.2} className="h-full">
                <Card className="h-full">
                  <p className="text-xs text-text-secondary uppercase font-mono mb-3">Core stack</p>
                  <div className="flex flex-wrap gap-2">
                    {allStack.map((s) => (
                      <span key={s} className="font-mono text-xs text-text-mono bg-surface-elevated border border-border rounded px-2 py-1">
                        {s}
                      </span>
                    ))}
                  </div>
                </Card>
              </Reveal>
            </BentoCell>
          )}

          {services.length > 0 && (
            <BentoCell span="2x1">
              <Reveal delay={0.25} className="h-full">
                <Card className="h-full flex flex-col justify-center text-center">
                  <h3 className="font-heading text-lg mb-2">Need something built?</h3>
                  <p className="text-text-secondary text-sm mb-4">
                    Freelance backend/full-stack projects for founders and small businesses.
                  </p>
                  <div>
                    <PrimaryButton href="/work-with-me">Work with me</PrimaryButton>
                  </div>
                </Card>
              </Reveal>
            </BentoCell>
          )}
        </BentoGrid>
      </section>
    </div>
  );
}
