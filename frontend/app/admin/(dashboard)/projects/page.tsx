"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProjects } from "@/lib/api";
import type { Project } from "@/lib/types";
import { Card, Tag } from "@/components/ui";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects().then(setProjects).catch(() => setProjects([]));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl">Projects</h1>
        <Link href="/admin/projects/new" className="text-accent text-sm">
          + New project
        </Link>
      </div>
      <div className="space-y-3">
        {projects.map((p) => (
          <Link key={p.id} href={`/admin/projects/${p.id}`}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Tag>{p.tags}</Tag>
                    <Tag>{p.status}</Tag>
                    {p.featured && <Tag>featured</Tag>}
                  </div>
                  <p className="font-heading">{p.title}</p>
                </div>
                <span className="text-text-secondary text-sm">/{p.slug}</span>
              </div>
            </Card>
          </Link>
        ))}
        {projects.length === 0 && <p className="text-text-secondary">No projects yet.</p>}
      </div>
    </div>
  );
}
