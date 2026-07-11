"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProjects } from "@/lib/api";
import type { Project } from "@/lib/types";
import { Card, Tag } from "@/components/ui";
import { BentoGrid, BentoCell } from "@/components/BentoGrid";
import Reveal from "@/components/Reveal";

const FREELANCE_STATUS_LABEL: Record<string, string> = {
  shipped: "Shipped",
  in_progress: "In progress",
  potential_customer: "Potential customer",
};

const FREELANCE_STATUS_CLASS: Record<string, string> = {
  shipped: "text-accent-live border-accent-live/40",
  in_progress: "text-accent border-accent/40",
  potential_customer: "text-warning border-warning/40",
};

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
      <BentoGrid>
        {projects.map((p, i) => (
          <BentoCell span={p.featured ? "2x1" : "1x1"} key={p.id}>
            <Reveal delay={i * 0.05} className="h-full">
              <Link href={`/admin/projects/${p.id}`} className="block h-full">
                <Card className="h-full">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Tag>{p.category}</Tag>
                    <Tag>{p.status}</Tag>
                    {p.featured && <Tag>featured</Tag>}
                    {p.freelance_status && (
                      <span
                        className={`font-mono text-xs uppercase tracking-wide bg-surface-elevated border rounded px-2 py-0.5 ${FREELANCE_STATUS_CLASS[p.freelance_status]}`}
                      >
                        {FREELANCE_STATUS_LABEL[p.freelance_status]}
                      </span>
                    )}
                  </div>
                  <p className="font-heading">{p.title}</p>
                  <span className="text-text-secondary text-sm">/{p.slug}</span>
                </Card>
              </Link>
            </Reveal>
          </BentoCell>
        ))}
      </BentoGrid>
      {projects.length === 0 && <p className="text-text-secondary">No projects yet.</p>}
    </div>
  );
}
