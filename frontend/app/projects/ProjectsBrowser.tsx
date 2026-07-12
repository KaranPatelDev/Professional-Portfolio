"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { Card, Tag } from "@/components/ui";
import { BentoGrid, BentoCell } from "@/components/BentoGrid";
import Reveal from "@/components/Reveal";

const CATEGORIES = ["All", "Client Work", "Personal Projects"];

function normalizeCategory(value: string) {
  // Tolerate singular/plural mismatches ("Personal Project" vs "Personal
  // Projects") since the admin form's free-text category field has no
  // enforced vocabulary.
  return value.trim().toLowerCase().replace(/s$/, "");
}

function matchesCategory(project: Project, category: string) {
  if (category === "All") return true;
  return normalizeCategory(project.category) === normalizeCategory(category);
}

export default function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState("All");

  const filtered = projects.filter((p) => matchesCategory(p, active));

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            className={`text-xs font-mono rounded-full px-3 py-1.5 border transition-colors ${
              active === category
                ? "bg-accent text-white border-accent"
                : "border-border text-text-secondary hover:border-accent hover:text-text-primary"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <BentoGrid className="mb-10">
        {filtered.map((project, i) => (
          <BentoCell span={project.featured && active === "All" ? "2x2" : "1x1"} key={project.slug}>
            <Reveal delay={i * 0.05} className="h-full">
              <Link href={`/projects/${project.slug}`} className="block h-full">
                <Card featured={project.featured} className="h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag>{project.category}</Tag>
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
      {filtered.length === 0 && <p className="text-text-secondary">No projects in this category yet.</p>}
    </div>
  );
}
