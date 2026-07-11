"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { adminListAllProjects } from "@/lib/api";
import type { Project } from "@/lib/types";
import ProjectForm from "../ProjectForm";

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminListAllProjects()
      .then((all) => setProject(all.find((p) => p.id === Number(params.id)) ?? null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <p className="text-text-secondary">Loading…</p>;
  if (!project) return <p className="text-text-secondary">Project not found.</p>;

  return (
    <div>
      <h1 className="font-heading text-2xl mb-6">Edit Project</h1>
      <ProjectForm project={project} />
    </div>
  );
}
