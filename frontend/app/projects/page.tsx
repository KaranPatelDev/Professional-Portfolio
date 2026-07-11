import { getProjects } from "@/lib/api";
import { Card, PageTitle, Tag } from "@/components/ui";
import { BentoGrid, BentoCell } from "@/components/BentoGrid";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Karan Patel",
  description: "Client work, production systems, and applied-AI projects.",
};

export default async function ProjectsPage() {
  const projects = (await getProjects().catch(() => [])).sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <Reveal>
        <PageTitle subtitle="Client work, production systems, and applied-AI projects.">Projects</PageTitle>
      </Reveal>
      <BentoGrid>
        {projects.map((project, i) => (
          <BentoCell span={project.featured ? "2x2" : "1x1"} key={project.slug}>
            <Reveal delay={i * 0.05} className="h-full">
              <Link href={`/projects/${project.slug}`} className="block h-full">
                <Card featured={project.featured} className="h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag>{project.tags.replace("_", " ")}</Tag>
                    <Tag>{project.status}</Tag>
                  </div>
                  <h2 className="font-heading text-lg mb-2">{project.title}</h2>
                  <p className="text-text-secondary text-sm mb-3">{project.summary}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.stack.slice(0, 5).map((s) => (
                      <span key={s} className="font-mono text-xs text-text-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </Card>
              </Link>
            </Reveal>
          </BentoCell>
        ))}
      </BentoGrid>
      {projects.length === 0 && <p className="text-text-secondary">No projects published yet.</p>}
    </div>
  );
}
