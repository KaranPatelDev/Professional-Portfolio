import {
  getAvailability,
  getContentBlocks,
  getExperience,
  getProjects,
  getServices,
} from "@/lib/api";
import { Card, PrimaryButton, RichText, StatChip, StatusDot, Tag } from "@/components/ui";
import { BentoGrid, BentoCell } from "@/components/BentoGrid";
import Reveal from "@/components/Reveal";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import OscilloscopeBackground from "@/components/OscilloscopeBackground";
import { stripHtml } from "@/lib/text";
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
  // Core stack is an editable content block (admin > Site Content), not
  // derived from project data — it's Karan's own skill set, independent of
  // which client-project tech happens to be in the DB right now.
  const coreStackRaw = content.find((b) => b.key === "core_stack")?.value_html;
  const coreStack = coreStackRaw
    ? stripHtml(coreStackRaw).split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  // Real, dynamic, non-jargon stats — counted from actual shipped projects
  // rather than technical metrics a non-technical visitor can't parse.
  const projectCount = projects.length;
  const clientProjectCount = projects.filter((p) => p.tags === "client_work").length;
  const liveProjectCount = projects.filter((p) => p.status === "live").length;

  return (
    <div className="w-full">
      {/* Hero — full-bleed background (glow + dot-grid span the entire viewport
          width), content constrained to a readable column inside it. */}
      <section className="relative w-full overflow-hidden">
        <div className="hero-glow" />
        <OscilloscopeBackground />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 xl:py-32 grid gap-8 xl:grid-cols-[1.3fr_1fr] items-center">
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
            </div>
          </Reveal>
          <Reveal delay={0.15} className="relative z-10">
            <Card featured>
              <InteractiveTerminal />
            </Card>
          </Reveal>
        </div>
      </section>

      {/* Bento panel: stats, experience, featured project, stack, freelance CTA */}
      <section className="w-full py-10 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <BentoGrid>
          <BentoCell span="1x1">
            <Reveal className="h-full">
              <StatChip label={`Project${projectCount === 1 ? "" : "s"} shipped`} value={String(projectCount)} />
            </Reveal>
          </BentoCell>
          <BentoCell span="1x1">
            <Reveal delay={0.05} className="h-full">
              <StatChip
                label={`Client project${clientProjectCount === 1 ? "" : "s"} delivered`}
                value={String(clientProjectCount)}
              />
            </Reveal>
          </BentoCell>
          <BentoCell span="1x1">
            <Reveal delay={0.1} className="h-full">
              <StatChip label="Live in production" value={String(liveProjectCount)} />
            </Reveal>
          </BentoCell>
          <BentoCell span="1x1">
            {latestExperience && (
              <Reveal delay={0.15} className="h-full">
                <Card className="h-full min-h-[104px] flex flex-col justify-center">
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
                      <Tag>{featuredProject.category}</Tag>
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

          {coreStack.length > 0 && (
            <BentoCell span="2x1">
              <Reveal delay={0.2} className="h-full">
                <Card className="h-full">
                  <p className="text-xs text-text-secondary uppercase font-mono mb-3">Core stack</p>
                  <div className="flex flex-wrap gap-2">
                    {coreStack.map((s) => (
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
        </div>
      </section>
    </div>
  );
}
