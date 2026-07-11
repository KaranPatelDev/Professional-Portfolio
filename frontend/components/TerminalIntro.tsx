"use client";

const LINES: { text: string; type: "prompt" | "output" | "check" }[] = [
  { text: "whoami", type: "prompt" },
  { text: "Karan Patel — Backend Engineer", type: "output" },
  { text: "status --check", type: "prompt" },
  { text: "Open to full-time & freelance work", type: "check" },
  { text: "10+ APIs shipped to production", type: "check" },
  { text: "~30% faster database queries", type: "check" },
  { text: "15+ production issues resolved", type: "check" },
];

export default function TerminalIntro() {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-4">
        <span className="w-2.5 h-2.5 rounded-full bg-error/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-warning/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-accent-live/70" />
        <span className="font-mono text-xs text-text-mono ml-2">karan@portfolio</span>
      </div>
      <div className="font-mono text-sm space-y-2">
        {LINES.map((line, i) => (
          <div
            key={i}
            className="terminal-line"
            style={{ animationDelay: `${0.3 + i * 0.25}s` }}
          >
            {line.type === "prompt" && (
              <span>
                <span className="text-accent-live">$</span> <span className="text-text-primary">{line.text}</span>
              </span>
            )}
            {line.type === "output" && <span className="text-text-secondary pl-4">{line.text}</span>}
            {line.type === "check" && (
              <span className="text-text-secondary pl-4">
                <span className="text-accent-live">✓</span> {line.text}
              </span>
            )}
          </div>
        ))}
        <span className="inline-block w-2 h-4 bg-accent-live align-middle animate-pulse" aria-hidden />
      </div>
    </div>
  );
}
