import { getProjects } from "@/lib/api";
import { PageTitle } from "@/components/ui";
import Reveal from "@/components/Reveal";
import ProjectsBrowser from "./ProjectsBrowser";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Karan Patel",
  description: "Client work, production systems, and applied-AI projects.",
};

export default async function ProjectsPage() {
  const projects = (await getProjects().catch(() => [])).sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
      <Reveal>
        <PageTitle subtitle="Client work, production systems, and applied-AI projects.">Projects</PageTitle>
      </Reveal>
      <ProjectsBrowser projects={projects} />
    </div>
  );
}
