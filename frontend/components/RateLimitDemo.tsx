"use client";

import { useEffect, useRef, useState } from "react";
import { hitRateLimitDemo } from "@/lib/api";
import { Check, X } from "lucide-react";

type Attempt = { ok: boolean };

export default function RateLimitDemo() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limit, setLimit] = useState<number | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState(false);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  function startCooldown(seconds: number) {
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    setCooldown(seconds);
    cooldownRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  async function fireOne() {
    const result = await hitRateLimitDemo();
    setLimit(result.limit);
    setRemaining(result.remaining);
    setAttempts((a) => [...a, { ok: result.ok }].slice(-20));
    if (!result.ok && result.retryAfter) {
      startCooldown(result.retryAfter);
    }
    return result;
  }

  async function handleSend() {
    setBusy(true);
    await fireOne();
    setBusy(false);
  }

  async function handleSpam() {
    setBusy(true);
    for (let i = 0; i < 10; i++) {
      await fireOne();
    }
    setBusy(false);
  }

  function handleReset() {
    setAttempts([]);
    setRemaining(null);
    setLimit(null);
  }

  const disabled = busy || cooldown > 0;

  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface p-6">
      <p className="font-mono text-xs text-text-mono mb-1">break-my-rate-limiter</p>
      <p className="text-text-secondary text-sm mb-4">
        This endpoint allows <strong className="text-text-primary">5 requests per 10 seconds</strong> — real backend
        defense, not a decoration. Spam it and watch the real 429/backoff happen live.
      </p>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          onClick={handleSend}
          disabled={disabled}
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          Send one request
        </button>
        <button
          onClick={handleSpam}
          disabled={disabled}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text-primary hover:border-accent transition-colors disabled:opacity-40"
        >
          Spam 10 requests
        </button>
        {attempts.length > 0 && (
          <button onClick={handleReset} className="text-text-secondary text-xs hover:text-text-primary">
            Reset
          </button>
        )}
        {cooldown > 0 && (
          <span className="font-mono text-xs text-error">🔒 rate-limited — retry in {cooldown}s</span>
        )}
        {cooldown === 0 && limit !== null && (
          <span className="font-mono text-xs text-text-secondary">
            {remaining}/{limit} requests remaining in this window
          </span>
        )}
      </div>

      {attempts.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {attempts.map((a, i) => (
            <span
              key={i}
              className={`w-6 h-6 flex items-center justify-center rounded ${
                a.ok ? "bg-accent-live/15 text-accent-live" : "bg-error/15 text-error"
              }`}
              title={a.ok ? "200 OK" : "429 Too Many Requests"}
            >
              {a.ok ? <Check size={13} /> : <X size={13} />}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
