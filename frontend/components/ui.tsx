import Link from "next/link";
import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`bg-surface border border-border rounded-[var(--radius-card)] p-6 transition-colors hover:border-accent ${className}`}
    >
      {children}
    </div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-xs uppercase tracking-wide text-text-mono bg-surface-elevated border border-border rounded px-2 py-0.5">
      {children}
    </span>
  );
}

export function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
    >
      {children}
    </Link>
  );
}

export function GhostButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-[var(--radius-button)] border border-border px-4 py-2 text-sm font-medium text-text-primary hover:border-accent transition-colors"
    >
      {children}
    </Link>
  );
}

export function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-border rounded-[var(--radius-card)] px-5 py-4 text-center">
      <div className="font-heading text-2xl text-accent">{value}</div>
      <div className="text-xs text-text-secondary mt-1">{label}</div>
    </div>
  );
}

export function StatusDot({ live = true }: { live?: boolean }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${live ? "bg-accent-live" : "bg-text-secondary"}`}
      style={live ? { boxShadow: "0 0 6px var(--color-accent-live)" } : undefined}
    />
  );
}

export function RichText({ html }: { html: string }) {
  return <div className="prose-content" dangerouslySetInnerHTML={{ __html: html }} />;
}
