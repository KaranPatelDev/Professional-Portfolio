"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getBackendStatus, getContentBlock, getProject, getProjects, getWhoami } from "@/lib/api";
import { stripHtml } from "@/lib/text";

type Line = { text: string; tone?: "prompt" | "output" | "check" | "accent" | "error" };

const BOOT: Line[] = [
  { text: "$ whoami", tone: "prompt" },
  { text: "Karan Patel — Backend Engineer", tone: "output" },
  { text: "$ status --check", tone: "prompt" },
  { text: "Open to full-time & freelance work", tone: "check" },
  { text: "Shipped production backend systems for real clients", tone: "check" },
  { text: "Type `help` to look around, or `projects` to jump straight in.", tone: "output" },
];

const HELP_LINES = [
  "navigate:  projects · experience · resume · contact · blog · hire-me",
  "explore:   curl /api/whoami · curl /api/status · stack · ls · cat secrets.txt · git log",
  "pipes:     projects | grep <term>",
  "for fun:   coffee · matrix · sudo · sl · clear",
];

// Canonical command → egg key. Multiple phrasings can trigger the same egg
// (e.g. "quit" and "exit") without double-counting it.
const EGG_ALIASES: Record<string, string> = {
  sudo: "sudo",
  "sudo su": "sudo",
  coffee: "coffee",
  "make coffee": "coffee",
  "sudo make coffee": "coffee",
  matrix: "matrix",
  sl: "sl",
  "cat secrets.txt": "secrets",
  "git log": "gitlog",
  "rm -rf /": "rm",
  "rm -rf life-balance": "rm",
  exit: "exit",
  quit: "exit",
};
const TOTAL_EGGS = new Set(Object.values(EGG_ALIASES)).size;

const TAB_COMMANDS = [
  "help",
  "clear",
  "whoami",
  "curl /api/whoami",
  "curl /api/status",
  "uptime",
  "stack",
  "ls",
  "cat secrets.txt",
  "git log",
  "sudo",
  "coffee",
  "matrix",
  "sl",
  "rm -rf life-balance",
  "exit",
  "projects",
  "experience",
  "resume",
  "contact",
  "blog",
  "hire-me",
  "status --check",
  "deploy",
  "projects | grep ",
];

const HISTORY_KEY = "terminal-history";
const EGGS_KEY = "terminal-eggs";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function InteractiveTerminal() {
  const router = useRouter();
  const [history, setHistory] = useState<Line[]>(BOOT);
  const [input, setInput] = useState("");
  const [commandLog, setCommandLog] = useState<string[]>([]);
  const [logIndex, setLogIndex] = useState(-1);
  const [foundEggs, setFoundEggs] = useState<Set<string>>(new Set());
  const [bonusSlug, setBonusSlug] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Load persisted history/eggs after mount only (avoids SSR/hydration mismatch).
  useEffect(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
      if (Array.isArray(savedHistory)) setCommandLog(savedHistory);
      const savedEggs = JSON.parse(localStorage.getItem(EGGS_KEY) ?? "[]");
      if (Array.isArray(savedEggs)) setFoundEggs(new Set(savedEggs));
    } catch {
      // ignore malformed localStorage
    }
  }, []);

  function print(lines: Line[]) {
    setHistory((h) => [...h, ...lines]);
    requestAnimationFrame(() => {
      outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
    });
  }

  function go(path: string, label: string) {
    print([{ text: label, tone: "accent" }]);
    setTimeout(() => router.push(path), 350);
  }

  function recordCommand(raw: string) {
    setCommandLog((l) => {
      const next = [...l, raw].slice(-50);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
    setLogIndex(-1);
  }

  function recordEggIfAny(cmd: string) {
    const eggKey = EGG_ALIASES[cmd];
    if (!eggKey || foundEggs.has(eggKey)) return;
    const next = new Set(foundEggs);
    next.add(eggKey);
    setFoundEggs(next);
    localStorage.setItem(EGGS_KEY, JSON.stringify([...next]));
    if (next.size === TOTAL_EGGS) {
      revealHiddenProject();
    }
  }

  async function revealHiddenProject() {
    print([{ text: `🎉 All ${TOTAL_EGGS} easter eggs found!`, tone: "accent" }]);
    try {
      const block = await getContentBlock("easter_egg_project_slug");
      const slug = stripHtml(block.value_html).trim();
      if (!slug) throw new Error("no slug set");
      const project = await getProject(slug);
      setBonusSlug(slug);
      print([
        { text: `Bonus project unlocked → "${project.title}"`, tone: "check" },
        { text: "Type `open bonus` to see it.", tone: "output" },
      ]);
    } catch {
      print([{ text: "(Bonus project coming soon — check back later.)", tone: "output" }]);
    }
  }

  async function runDeploy() {
    const steps = ["Installing dependencies…", "Running tests…", "Building…", "Deploying to production…"];
    for (const step of steps) {
      await delay(420);
      print([{ text: step, tone: "check" }]);
    }
    await delay(420);
    print([{ text: "Live ✓ — confirming with the real backend…", tone: "accent" }]);
    await runStatus();
  }

  async function runWhoami() {
    print([{ text: "Fetching /api/whoami…", tone: "output" }]);
    try {
      const w = await getWhoami();
      print([
        { text: `name: ${w.name}`, tone: "output" },
        { text: `role: ${w.role ?? "—"} @ ${w.company ?? "—"}`, tone: "output" },
        { text: `tenure: ${w.tenure ?? "—"}`, tone: "output" },
        { text: `availability: ${w.availability_status}`, tone: "output" },
        { text: `stack: ${w.core_stack.join(", ")}`, tone: "output" },
        { text: `projects: ${w.project_count} (${w.client_project_count} client, ${w.live_project_count} live)`, tone: "output" },
      ]);
    } catch {
      print([{ text: "curl: could not reach /api/whoami", tone: "error" }]);
    }
  }

  async function runStatus() {
    print([{ text: "Fetching /api/status…", tone: "output" }]);
    try {
      const s = await getBackendStatus();
      const mins = Math.floor(s.uptime_seconds / 60);
      print([
        { text: `status: ${s.status}`, tone: "check" },
        { text: `uptime: ${mins} minute${mins === 1 ? "" : "s"}`, tone: "output" },
      ]);
    } catch {
      print([{ text: "curl: could not reach /api/status", tone: "error" }]);
    }
  }

  async function runProjectsGrep(term: string) {
    try {
      const projects = await getProjects();
      const needle = term.toLowerCase();
      const matches = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(needle) ||
          p.category.toLowerCase().includes(needle) ||
          p.stack.some((s) => s.toLowerCase().includes(needle))
      );
      if (matches.length === 0) {
        print([{ text: `grep: no projects matching "${term}"`, tone: "error" }]);
        return;
      }
      print(matches.map((p) => ({ text: `${p.title} — ${p.stack.join(", ")}`, tone: "output" as const })));
    } catch {
      print([{ text: "grep: could not fetch projects", tone: "error" }]);
    }
  }

  function run(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const cmd = trimmed.toLowerCase();

    print([{ text: `$ ${raw}`, tone: "prompt" }]);
    recordCommand(raw);

    // Pipe support: `projects | grep <term>`
    if (trimmed.includes("|")) {
      const [base, pipePart] = trimmed.split("|").map((s) => s.trim());
      if (base.toLowerCase() === "projects" && pipePart?.toLowerCase().startsWith("grep ")) {
        runProjectsGrep(pipePart.slice(5).trim());
        return;
      }
      print([{ text: `command not found: ${raw}`, tone: "error" }]);
      return;
    }

    recordEggIfAny(cmd);

    switch (cmd) {
      case "help":
        print(HELP_LINES.map((text) => ({ text, tone: "output" as const })));
        return;
      case "clear":
      case "cls":
        setHistory([]);
        return;
      case "whoami":
        print([{ text: "Karan Patel — Backend Engineer (Python / FastAPI)", tone: "output" }]);
        return;
      case "curl /api/whoami":
      case "curl whoami":
      case "whoami --full":
        runWhoami();
        return;
      case "curl /api/status":
      case "curl status":
      case "uptime":
        runStatus();
        return;
      case "stack":
        print([{ text: "Python · FastAPI · MySQL · PostgreSQL · MongoDB · Docker · Git · Postman", tone: "output" }]);
        return;
      case "ls":
        print([{ text: "projects/  experience/  build-log/  resume.pdf  secrets.txt", tone: "output" }]);
        return;
      case "cat secrets.txt":
        print([{ text: "Once fixed a production bug at 2am with a one-line query fix. True story.", tone: "output" }]);
        return;
      case "git log":
        print([
          { text: "a3f9c2e fix: actually read the error message this time", tone: "output" },
          { text: "9d4e1aa feat: ship it, then write the tests", tone: "output" },
          { text: "1c0ffee chore: coffee-driven refactor", tone: "output" },
        ]);
        return;
      case "sudo":
      case "sudo su":
        print([{ text: "Permission denied: you're not root here. Try `hire-me` instead.", tone: "error" }]);
        return;
      case "coffee":
      case "make coffee":
      case "sudo make coffee":
        print([{ text: "☕ Brewing… 418 I'm a teapot. (Real APIs only — see `projects`.)", tone: "output" }]);
        return;
      case "matrix":
        print([
          { text: "Wake up, Karan…", tone: "check" },
          { text: "The backend has you.", tone: "check" },
          { text: "Follow the white rabbit → `projects`", tone: "check" },
        ]);
        return;
      case "sl":
        print([{ text: "🚂 choo choo — you meant `ls`, right?", tone: "output" }]);
        return;
      case "rm -rf /":
      case "rm -rf life-balance":
        print([{ text: "Nice try. That one's protected by production experience.", tone: "error" }]);
        return;
      case "exit":
      case "quit":
        print([{ text: "There's no escape — this is a portfolio, not a shell. Try `projects`.", tone: "error" }]);
        return;
      case "deploy":
        runDeploy();
        return;
      case "open bonus":
        if (bonusSlug) go(`/projects/${bonusSlug}`, `Opening bonus project /projects/${bonusSlug} …`);
        else print([{ text: "No bonus project unlocked yet.", tone: "error" }]);
        return;
      case "projects":
      case "cd projects":
        go("/projects", "Opening /projects …");
        return;
      case "experience":
      case "cd experience":
        go("/experience", "Opening /experience …");
        return;
      case "resume":
      case "cd resume":
        go("/resume", "Opening /resume …");
        return;
      case "contact":
      case "cd contact":
        go("/contact", "Opening /contact …");
        return;
      case "blog":
      case "buildlog":
      case "build-log":
        go("/build-log", "Opening /build-log …");
        return;
      case "hire-me":
      case "hire me":
      case "work":
      case "work-with-me":
        go("/work-with-me", "Opening /work-with-me …");
        return;
      case "status --check":
        print([
          { text: "Open to full-time & freelance work", tone: "check" },
          { text: "Shipped production backend systems for real clients", tone: "check" },
        ]);
        return;
      default:
        print([{ text: `command not found: ${raw} — type \`help\` for options`, tone: "error" }]);
    }
  }

  const suggestion = useMemo(() => {
    if (!input) return "";
    const match = TAB_COMMANDS.find(
      (c) => c.toLowerCase().startsWith(input.toLowerCase()) && c.toLowerCase() !== input.toLowerCase()
    );
    return match ?? "";
  }, [input]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "Tab") {
      if (suggestion) {
        e.preventDefault();
        setInput(suggestion);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandLog.length === 0) return;
      const next = logIndex < 0 ? commandLog.length - 1 : Math.max(0, logIndex - 1);
      setLogIndex(next);
      setInput(commandLog[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (logIndex < 0) return;
      const next = logIndex + 1;
      if (next >= commandLog.length) {
        setLogIndex(-1);
        setInput("");
      } else {
        setLogIndex(next);
        setInput(commandLog[next]);
      }
    }
  }

  function toneClass(tone?: Line["tone"]) {
    switch (tone) {
      case "prompt":
        return "text-text-primary";
      case "check":
        return "text-text-secondary";
      case "accent":
        return "text-accent-live";
      case "error":
        return "text-error";
      default:
        return "text-text-secondary";
    }
  }

  return (
    <div onClick={() => inputRef.current?.focus()} className="cursor-text">
      <div className="flex items-center gap-1.5 mb-4">
        <span className="w-2.5 h-2.5 rounded-full bg-error/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-warning/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-accent-live/70" />
        <span className="font-mono text-xs text-text-mono ml-2">karan@portfolio</span>
        <span className="font-mono text-xs text-text-secondary ml-auto" title="Easter eggs found">
          🥚 {foundEggs.size}/{TOTAL_EGGS}
        </span>
      </div>
      <div ref={outputRef} className="font-mono text-sm space-y-1.5 max-h-56 overflow-y-auto overscroll-contain pr-1">
        {history.map((line, i) => (
          <div key={i} className={`terminal-line ${toneClass(line.tone)}`} style={{ animationDelay: `${Math.min(i * 0.15, 1.5)}s` }}>
            {line.tone === "check" ? (
              <>
                <span className="text-accent-live">✓</span> {line.text}
              </>
            ) : (
              line.text
            )}
          </div>
        ))}
      </div>
      <div className="relative flex items-center gap-2 font-mono text-sm mt-2">
        <span className="text-accent-live">$</span>
        <div className="relative flex-1">
          <div className="absolute inset-0 whitespace-pre pointer-events-none select-none">
            <span className="invisible">{input}</span>
            <span className="text-text-secondary/40">{suggestion.slice(input.length)}</span>
          </div>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            placeholder="type a command… (Tab to autocomplete)"
            aria-label="Portfolio terminal command input"
            className="relative w-full bg-transparent outline-none text-text-primary placeholder:text-text-secondary/50"
          />
        </div>
      </div>
    </div>
  );
}
