"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

export function Card({
  children,
  className = "",
  featured = false,
}: {
  children: ReactNode;
  className?: string;
  featured?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`spotlight-card bg-surface border ${
        featured ? "border-[1.5px] border-accent/40" : "border-border"
      } rounded-[var(--radius-card)] p-6 transition-all duration-200 hover:border-accent hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 ${className}`}
    >
      <div className="relative z-[2]">{children}</div>
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
      className="inline-flex items-center rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-[0_0_20px_-4px_var(--color-accent)]"
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);

  const numericMatch = value.match(/^([~]?)(\d+)(.*)$/);

  useEffect(() => {
    if (!inView || !numericMatch) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const [, prefix, digits, suffix] = numericMatch;
    const target = Number(digits);
    const controls = animate(0, target, {
      duration: 1,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(`${prefix}${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div
      ref={ref}
      className="bg-surface border border-border rounded-[var(--radius-card)] px-5 py-4 text-center transition-colors hover:border-accent"
    >
      <div className="font-heading text-2xl text-accent tabular-nums">{numericMatch ? display : value}</div>
      <div className="text-xs text-text-secondary mt-1">{label}</div>
    </div>
  );
}

export function StatusDot({ live = true }: { live?: boolean }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${live ? "bg-accent-live animate-pulse" : "bg-text-secondary"}`}
      style={live ? { boxShadow: "0 0 6px var(--color-accent-live)" } : undefined}
    />
  );
}

export function RichText({ html }: { html: string }) {
  return <div className="prose-content" dangerouslySetInnerHTML={{ __html: html }} />;
}
