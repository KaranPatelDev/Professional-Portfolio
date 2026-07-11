import { getProject } from "@/lib/api";
import { Card, GhostButton, PrimaryButton, RichText, Tag } from "@/components/ui";
import { BentoGrid, BentoCell } from "@/components/BentoGrid";
import Reveal from "@/components/Reveal";
import ScrollProgress from "@/components/ScrollProgress";
import { estimateReadingTime } from "@/lib/readingTime";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await getProject(slug);
    return {
      title: `${project.title} | Karan Patel`,
      description: project.summary,
    };
  } catch {
    return { title: "Project not found | Karan Patel" };
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  let project;
  try {
    project = await getProject(slug);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <ScrollProgress />
      <Reveal>
        <div className="flex items-center gap-2 mb-4">
          <Tag>{project.tags.replace("_", " ")}</Tag>
          <Tag>{project.status}</Tag>
          {project.body_html && <span className="text-xs text-text-secondary font-mono">{estimateReadingTime(project.body_html)}</span>}
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight mb-4">{project.title}</h1>
        <p className="text-text-secondary text-lg mb-8 max-w-xl">{project.summary}</p>
      </Reveal>

      <Reveal delay={0.05}>
        <BentoGrid className="mb-10">
          {project.role && (
            <BentoCell span="2x1">
              <Card className="h-full">
                <p className="text-xs text-text-secondary uppercase font-mono mb-1">Role</p>
                <p className="text-sm">{project.role}</p>
              </Card>
            </BentoCell>
          )}
          <BentoCell span="2x1">
            <Card className="h-full">
              <p className="text-xs text-text-secondary uppercase font-mono mb-2">Stack</p>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <span key={s} className="font-mono text-xs text-text-mono bg-surface-elevated border border-border rounded px-2 py-1">
                    {s}
                  </span>
                ))}
              </div>
            </Card>
          </BentoCell>
          <BentoCell span="4x1">
            <Card className="h-full flex flex-wrap items-center gap-3">
              {project.live_url && <PrimaryButton href={project.live_url}>View live site &rarr;</PrimaryButton>}
              {project.github_url && <GhostButton href={project.github_url}>View code</GhostButton>}
              <GhostButton href="/work-with-me">Discuss a similar project</GhostButton>
            </Card>
          </BentoCell>
        </BentoGrid>
      </Reveal>

      {project.body_html && (
        <Reveal delay={0.1}>
          <RichText html={project.body_html} />
        </Reveal>
      )}
    </div>
  );
}
