"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";

const ENDPOINTS = [
  { label: "GET /api/projects", path: "/api/projects" },
  { label: "GET /api/experience", path: "/api/experience" },
  { label: "GET /api/services", path: "/api/services" },
];

export default function ApiPlayground() {
  const [active, setActive] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [body, setBody] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function run(path: string) {
    setActive(path);
    setLoading(true);
    setError(false);
    const start = performance.now();
    try {
      const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
      const json = await res.json();
      setLatency(Math.round(performance.now() - start));
      setBody(JSON.stringify(json, null, 2));
    } catch {
      setError(true);
      setBody(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface p-6">
      <p className="font-mono text-xs text-text-mono mb-1">api-playground</p>
      <p className="text-text-secondary text-sm mb-4">
        Fire a real, read-only request at the live backend and see exactly what comes back — response time included.
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {ENDPOINTS.map((e) => (
          <button
            key={e.path}
            onClick={() => run(e.path)}
            disabled={loading}
            className={`font-mono text-xs rounded-full px-3 py-1.5 border transition-colors ${
              active === e.path
                ? "bg-accent text-white border-accent"
                : "border-border text-text-secondary hover:border-accent hover:text-text-primary"
            } disabled:opacity-50`}
          >
            {e.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-text-secondary text-sm font-mono">Firing request…</p>}

      {!loading && error && <p className="text-error text-sm font-mono">Request failed — try again.</p>}

      {!loading && !error && body && (
        <div>
          <p className="text-accent-live text-xs font-mono mb-2">✓ {latency}ms round-trip</p>
          <pre className="text-xs font-mono text-text-secondary bg-surface-elevated border border-border rounded p-3 max-h-72 overflow-auto">
            {body}
          </pre>
        </div>
      )}
    </div>
  );
}
