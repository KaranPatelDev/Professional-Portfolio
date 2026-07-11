"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { Card, Tag } from "@/components/ui";
import { BentoGrid, BentoCell } from "@/components/BentoGrid";
import Reveal from "@/components/Reveal";

const TAG_LABELS: Record<string, string> = {
  client_work: "Client Work",
  personal: "Personal",
  ai_experiment: "AI Experiment",
};

export default function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeStack, setActiveStack] = useState<string | null>(null);

  const tags = useMemo(() => Array.from(new Set(projects.map((p) => p.tags))), [projects]);
  const stackOptions = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.stack))).sort(),
    [projects]
  );

  const filtered = projects.filter((p) => {
    if (activeTag && p.tags !== activeTag) return false;
    if (activeStack && !p.stack.includes(activeStack)) return false;
    return true;
  });

  function FilterPill({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) {
    return (
      <button
        onClick={onClick}
        className={`text-xs font-mono rounded-full px-3 py-1.5 border transition-colors ${
          active
            ? "bg-accent text-white border-accent"
            : "border-border text-text-secondary hover:border-accent hover:text-text-primary"
        }`}
      >
        {children}
      </button>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-3">
          <FilterPill active={activeTag === null} onClick={() => setActiveTag(null)}>
            All
          </FilterPill>
          {tags.map((tag) => (
            <FilterPill key={tag} active={activeTag === tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)}>
              {TAG_LABELS[tag] ?? tag}
            </FilterPill>
          ))}
        </div>
        {stackOptions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {stackOptions.map((s) => (
              <FilterPill key={s} active={activeStack === s} onClick={() => setActiveStack(activeStack === s ? null : s)}>
                {s}
              </FilterPill>
            ))}
          </div>
        )}
      </div>

      <BentoGrid className="mb-10">
        {filtered.map((project, i) => (
          <BentoCell span={project.featured && !activeTag && !activeStack ? "2x2" : "1x1"} key={project.slug}>
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
      {filtered.length === 0 && <p className="text-text-secondary">No projects match these filters.</p>}
    </div>
  );
}
