import type { GitCommit } from "@/lib/types";

export default function CommitTimeline({ commits, repo }: { commits: GitCommit[]; repo: string }) {
  if (commits.length === 0) return null;

  return (
    <div className="my-10">
      <p className="text-xs text-text-secondary uppercase font-mono mb-4">
        Commit timeline — <span className="text-text-mono">{repo}</span>
      </p>
      <ol className="relative border-l border-border pl-5 space-y-5">
        {commits.map((c) => (
          <li key={c.sha} className="relative">
            <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-accent border-2 border-bg" />
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-text-mono hover:text-accent transition-colors"
            >
              {c.sha}
            </a>
            <p className="text-sm text-text-primary mt-0.5">{c.message}</p>
            <p className="text-xs text-text-secondary mt-0.5">
              {c.author} ·{" "}
              {new Date(c.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
