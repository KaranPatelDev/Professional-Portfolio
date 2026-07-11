"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Command } from "cmdk";
import { getProjects } from "@/lib/api";
import type { Project } from "@/lib/types";
import { ExternalLink, FileText, Home, Mail, Moon, Sun, Briefcase, User } from "lucide-react";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
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
    if (open && projects.length === 0) {
      getProjects().then(setProjects).catch(() => {});
    }
  }, [open, projects.length]);

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
            placeholder="Search pages, projects, or actions…"
            className="w-full px-4 py-3 bg-transparent border-b border-border text-text-primary placeholder:text-text-secondary focus:outline-none"
          />
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="text-text-secondary text-sm px-3 py-4 text-center">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigate" className="text-xs text-text-secondary px-2 py-1.5 [&_[cmdk-group-heading]]:px-1 [&_[cmdk-group-heading]]:pb-1">
              <PaletteItem icon={<Home size={15} />} onSelect={() => go("/")}>Homepage</PaletteItem>
              <PaletteItem icon={<User size={15} />} onSelect={() => go("/experience")}>Experience</PaletteItem>
              <PaletteItem icon={<Briefcase size={15} />} onSelect={() => go("/projects")}>Projects</PaletteItem>
              <PaletteItem icon={<Mail size={15} />} onSelect={() => go("/contact")}>Contact</PaletteItem>
              <PaletteItem icon={<FileText size={15} />} onSelect={() => go("/resume")}>Resume</PaletteItem>
            </Command.Group>

            {projects.length > 0 && (
              <Command.Group heading="Projects" className="text-xs text-text-secondary px-2 py-1.5">
                {projects.map((p) => (
                  <PaletteItem key={p.slug} icon={<Briefcase size={15} />} onSelect={() => go(`/projects/${p.slug}`)}>
                    {p.title}
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
                  navigator.clipboard.writeText("mpkaranpatel001018@gmail.com").catch(() => {});
                  setOpen(false);
                }}
              >
                Copy email address
              </PaletteItem>
              <PaletteItem icon={<ExternalLink size={15} />} onSelect={() => window.open("https://github.com", "_blank")}>
                Open GitHub
              </PaletteItem>
              <PaletteItem icon={<ExternalLink size={15} />} onSelect={() => window.open("https://linkedin.com", "_blank")}>
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
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-text-primary cursor-pointer aria-selected:bg-surface-elevated aria-selected:text-accent"
    >
      {icon}
      {children}
    </Command.Item>
  );
}
