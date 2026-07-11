"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

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
  "explore:   whoami · stack · ls · cat secrets.txt · git log",
  "for fun:   coffee · matrix · sudo · sl · clear",
];

export default function InteractiveTerminal() {
  const router = useRouter();
  const [history, setHistory] = useState<Line[]>(BOOT);
  const [input, setInput] = useState("");
  const [commandLog, setCommandLog] = useState<string[]>([]);
  const [logIndex, setLogIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

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

  function run(raw: string) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    print([{ text: `$ ${raw}`, tone: "prompt" }]);
    setCommandLog((l) => [...l, raw]);
    setLogIndex(-1);

    switch (cmd) {
      case "help":
        print(HELP_LINES.map((text) => ({ text, tone: "output" })));
        return;
      case "clear":
      case "cls":
        setHistory([]);
        return;
      case "whoami":
        print([{ text: "Karan Patel — Backend Engineer (Python / FastAPI)", tone: "output" }]);
        return;
      case "stack":
        print([{ text: "Python · FastAPI · PostgreSQL · React · Next.js · Docker · Redis", tone: "output" }]);
        return;
      case "ls":
        print([{ text: "projects/  experience/  build-log/  resume.pdf  secrets.txt", tone: "output" }]);
        return;
      case "cat secrets.txt":
      case "cat  secrets.txt":
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
      default:
        print([{ text: `command not found: ${raw} — type \`help\` for options`, tone: "error" }]);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      run(input);
      setInput("");
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
      <div className="flex items-center gap-2 font-mono text-sm mt-2">
        <span className="text-accent-live">$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          placeholder="type a command…"
          aria-label="Portfolio terminal command input"
          className="flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-secondary/50"
        />
      </div>
    </div>
  );
}
