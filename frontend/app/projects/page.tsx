import { getProjects } from "@/lib/api";
import { Card, Tag } from "@/components/ui";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Karan Patel",
  description: "Client work, production systems, and applied-AI projects.",
};

export default async function ProjectsPage() {
  const projects = (await getProjects().catch(() => [])).sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-heading text-3xl mb-8">Projects</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Link key={project.slug} href={`/projects/${project.slug}`} className={project.featured ? "md:col-span-2" : ""}>
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Tag>{project.tags.replace("_", " ")}</Tag>
                <Tag>{project.status}</Tag>
              </div>
              <h2 className="font-heading text-lg mb-2">{project.title}</h2>
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
        {projects.length === 0 && <p className="text-text-secondary">No projects published yet.</p>}
      </div>
    </div>
  );
}
