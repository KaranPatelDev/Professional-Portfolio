"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "cmdk";
import { getBuildLogPosts, getExperience, getProjects, getServices } from "@/lib/api";
import type { BuildLogPost, Experience, Project, Service } from "@/lib/types";
import { SOCIAL_LINKS } from "@/lib/social";
import { ExternalLink, FileText, Home, Mail, Moon, Sun, Briefcase, User, Wrench, Newspaper } from "lucide-react";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [posts, setPosts] = useState<BuildLogPost[]>([]);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
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
        getBuildLogPosts().catch(() => []),
      ]).then(([p, e, s, bl]) => {
        setProjects(p);
        setExperience(e);
        setServices(s);
        setPosts(bl);
      });
    }
  }, [open, loaded]);

  function go(path: string) {
    router.push(path);
    setOpen(false);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      label="Command palette"
      overlayClassName="fixed inset-0 z-[100] bg-black/50"
      contentClassName="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-lg mx-4 glass-surface border border-border rounded-[var(--radius-card)] overflow-hidden shadow-2xl"
    >
      <CommandInput
        autoFocus
        placeholder="Search projects, stack, services, or actions…"
        className="w-full px-4 py-3 bg-transparent border-b border-border text-text-primary placeholder:text-text-secondary focus:outline-none"
      />
      <CommandList className="max-h-96 overflow-y-auto p-2">
        <CommandEmpty className="text-text-secondary text-sm px-3 py-4 text-center">
          No results found.
        </CommandEmpty>

        <CommandGroup heading="Navigate" className="text-xs text-text-secondary px-2 py-1.5">
          <PaletteItem icon={<Home size={15} />} onSelect={() => go("/")}>Homepage</PaletteItem>
          <PaletteItem icon={<User size={15} />} onSelect={() => go("/experience")}>Experience</PaletteItem>
          <PaletteItem icon={<Briefcase size={15} />} onSelect={() => go("/projects")}>All Projects</PaletteItem>
          <PaletteItem icon={<Newspaper size={15} />} onSelect={() => go("/build-log")}>Build Log</PaletteItem>
          <PaletteItem icon={<Mail size={15} />} onSelect={() => go("/contact")}>Contact</PaletteItem>
          <PaletteItem icon={<FileText size={15} />} onSelect={() => go("/resume")}>Resume</PaletteItem>
        </CommandGroup>

        {projects.length > 0 && (
          <CommandGroup heading="Projects" className="text-xs text-text-secondary px-2 py-1.5">
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
          </CommandGroup>
        )}

        {experience.length > 0 && (
          <CommandGroup heading="Experience" className="text-xs text-text-secondary px-2 py-1.5">
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
          </CommandGroup>
        )}

        {services.length > 0 && (
          <CommandGroup heading="Services" className="text-xs text-text-secondary px-2 py-1.5">
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
          </CommandGroup>
        )}

        {posts.length > 0 && (
          <CommandGroup heading="Build Log" className="text-xs text-text-secondary px-2 py-1.5">
            {posts.map((p) => (
              <PaletteItem
                key={p.slug}
                icon={<Newspaper size={15} />}
                keywords={p.summary ? [p.summary] : []}
                onSelect={() => go(`/build-log/${p.slug}`)}
              >
                {p.title}
              </PaletteItem>
            ))}
          </CommandGroup>
        )}

        <CommandGroup heading="Actions" className="text-xs text-text-secondary px-2 py-1.5">
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
        </CommandGroup>
      </CommandList>
    </CommandDialog>
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
    <CommandItem
      onSelect={onSelect}
      keywords={keywords}
      className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-text-primary cursor-pointer aria-selected:bg-surface-elevated aria-selected:text-accent"
    >
      {icon}
      {children}
    </CommandItem>
  );
}
