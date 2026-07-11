"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Command } from "cmdk";
import { getExperience, getProjects, getServices } from "@/lib/api";
import type { Experience, Project, Service } from "@/lib/types";
import { SOCIAL_LINKS } from "@/lib/social";
import { ExternalLink, FileText, Home, Mail, Moon, Sun, Briefcase, User, Wrench } from "lucide-react";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open && !loaded) {
      setLoaded(true);
      Promise.all([
        getProjects().catch(() => []),
        getExperience().catch(() => []),
        getServices().catch(() => []),
      ]).then(([p, e, s]) => {
        setProjects(p);
        setExperience(e);
        setServices(s);
      });
    }
  }, [open, loaded]);

  function go(path: string) {
    router.push(path);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-24 bg-black/50"
      onClick={() => setOpen(false)}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg mx-4">
        <Command
          className="glass-surface border border-border rounded-[var(--radius-card)] overflow-hidden shadow-2xl"
          label="Command palette"
        >
          <Command.Input
            autoFocus
            placeholder="Search projects, stack, services, or actions…"
            className="w-full px-4 py-3 bg-transparent border-b border-border text-text-primary placeholder:text-text-secondary focus:outline-none"
          />
          <Command.List className="max-h-96 overflow-y-auto p-2">
            <Command.Empty className="text-text-secondary text-sm px-3 py-4 text-center">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigate" className="text-xs text-text-secondary px-2 py-1.5">
              <PaletteItem icon={<Home size={15} />} onSelect={() => go("/")}>Homepage</PaletteItem>
              <PaletteItem icon={<User size={15} />} onSelect={() => go("/experience")}>Experience</PaletteItem>
              <PaletteItem icon={<Briefcase size={15} />} onSelect={() => go("/projects")}>All Projects</PaletteItem>
              <PaletteItem icon={<Mail size={15} />} onSelect={() => go("/contact")}>Contact</PaletteItem>
              <PaletteItem icon={<FileText size={15} />} onSelect={() => go("/resume")}>Resume</PaletteItem>
            </Command.Group>

            {projects.length > 0 && (
              <Command.Group heading="Projects" className="text-xs text-text-secondary px-2 py-1.5">
                {projects.map((p) => (
                  <PaletteItem
                    key={p.slug}
                    icon={<Briefcase size={15} />}
                    keywords={[p.summary, ...p.stack, p.category]}
                    onSelect={() => go(`/projects/${p.slug}`)}
                  >
                    <div>
                      <div>{p.title}</div>
                      <div className="text-xs text-text-secondary">{p.stack.slice(0, 4).join(" · ")}</div>
                    </div>
                  </PaletteItem>
                ))}
              </Command.Group>
            )}

            {experience.length > 0 && (
              <Command.Group heading="Experience" className="text-xs text-text-secondary px-2 py-1.5">
                {experience.map((e) => (
                  <PaletteItem
                    key={e.id}
                    icon={<User size={15} />}
                    keywords={[e.summary, ...e.tools]}
                    onSelect={() => go("/experience")}
                  >
                    {e.role} — {e.company}
                  </PaletteItem>
                ))}
              </Command.Group>
            )}

            {services.length > 0 && (
              <Command.Group heading="Services" className="text-xs text-text-secondary px-2 py-1.5">
                {services.map((s) => (
                  <PaletteItem
                    key={s.id}
                    icon={<Wrench size={15} />}
                    keywords={[s.client_problem, s.deliverable, ...s.stack]}
                    onSelect={() => go("/work-with-me")}
                  >
                    {s.name}
                  </PaletteItem>
                ))}
              </Command.Group>
            )}

            <Command.Group heading="Actions" className="text-xs text-text-secondary px-2 py-1.5">
              <PaletteItem
                icon={resolvedTheme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                onSelect={() => {
                  setTheme(resolvedTheme === "dark" ? "light" : "dark");
                  setOpen(false);
                }}
              >
                Toggle theme
              </PaletteItem>
              <PaletteItem
                icon={<Mail size={15} />}
                onSelect={() => {
                  navigator.clipboard.writeText(SOCIAL_LINKS.email).catch(() => {});
                  setOpen(false);
                }}
              >
                Copy email address
              </PaletteItem>
              <PaletteItem icon={<ExternalLink size={15} />} onSelect={() => window.open(SOCIAL_LINKS.github, "_blank")}>
                Open GitHub
              </PaletteItem>
              <PaletteItem icon={<ExternalLink size={15} />} onSelect={() => window.open(SOCIAL_LINKS.linkedin, "_blank")}>
                Open LinkedIn
              </PaletteItem>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}

function PaletteItem({
  icon,
  children,
  onSelect,
  keywords,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onSelect: () => void;
  keywords?: string[];
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      keywords={keywords}
      className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-text-primary cursor-pointer aria-selected:bg-surface-elevated aria-selected:text-accent"
    >
      {icon}
      {children}
    </Command.Item>
  );
}
