import { getProject } from "@/lib/api";
import { Card, GhostButton, PrimaryButton, RichText, Tag } from "@/components/ui";
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
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-center gap-2 mb-4">
        <Tag>{project.tags.replace("_", " ")}</Tag>
        <Tag>{project.status}</Tag>
      </div>
      <h1 className="font-heading text-3xl mb-3">{project.title}</h1>
      <p className="text-text-secondary text-lg mb-6">{project.summary}</p>

      {project.role && (
        <Card className="mb-6">
          <p className="text-xs text-text-secondary uppercase font-mono mb-1">Role</p>
          <p>{project.role}</p>
        </Card>
      )}

      <div className="flex flex-wrap gap-2 mb-8">
        {project.stack.map((s) => (
          <span key={s} className="font-mono text-xs text-text-mono bg-surface border border-border rounded px-2 py-1">
            {s}
          </span>
        ))}
      </div>

      <div className="flex gap-3 mb-10">
        {project.live_url && <PrimaryButton href={project.live_url}>View live site &rarr;</PrimaryButton>}
        {project.github_url && <GhostButton href={project.github_url}>View code</GhostButton>}
        <GhostButton href="/work-with-me">Discuss a similar project</GhostButton>
      </div>

      {project.body_html && <RichText html={project.body_html} />}
    </div>
  );
}
