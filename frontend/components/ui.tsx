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
        featured ? "border-[1.5px] border-accent/50 shadow-lg shadow-accent/5" : "border-border"
      } rounded-[var(--radius-card)] p-6 transition-all duration-300 ease-out hover:border-accent hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl hover:shadow-black/30 ${className}`}
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
      className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-accent to-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-accent/20 transition-all duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-accent/40 active:scale-[0.98]"
    >
      <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
      <span className="relative">{children}</span>
    </Link>
  );
}

export function GhostButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium text-text-primary transition-all duration-300 hover:border-accent hover:bg-surface-elevated hover:scale-[1.03] active:scale-[0.98]"
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
      className="bg-surface border border-border rounded-[var(--radius-card)] px-5 py-4 text-center transition-all duration-300 hover:border-accent hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20"
    >
      <div className="font-heading text-3xl font-semibold text-accent tabular-nums">{numericMatch ? display : value}</div>
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

export function PageTitle({ children, subtitle }: { children: ReactNode; subtitle?: string }) {
  return (
    <div className="mb-10">
      <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-3">{children}</h1>
      {subtitle && <p className="text-text-secondary text-lg max-w-xl">{subtitle}</p>}
    </div>
  );
}
