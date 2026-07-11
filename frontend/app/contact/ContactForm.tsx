"use client";

import { useState } from "react";
import { submitContact } from "@/lib/api";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = new FormData(e.currentTarget);
    try {
      await submitContact({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        message: String(form.get("message") ?? ""),
        budget_range: String(form.get("budget_range") ?? ""),
        timeline: String(form.get("timeline") ?? ""),
        website: String(form.get("website") ?? ""), // honeypot
      });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="text-text-primary">
        Thanks &mdash; I&apos;ll reply within 1&ndash;2 business days.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div>
        <label htmlFor="name" className="block text-sm text-text-secondary mb-1">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full bg-surface border border-border rounded-[var(--radius-button)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm text-text-secondary mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full bg-surface border border-border rounded-[var(--radius-button)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm text-text-secondary mb-1">
          Brief description
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full bg-surface border border-border rounded-[var(--radius-button)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="budget_range" className="block text-sm text-text-secondary mb-1">
            Budget range
          </label>
          <input
            id="budget_range"
            name="budget_range"
            placeholder="e.g. $1k–3k"
            className="w-full bg-surface border border-border rounded-[var(--radius-button)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label htmlFor="timeline" className="block text-sm text-text-secondary mb-1">
            Timeline
          </label>
          <input
            id="timeline"
            name="timeline"
            placeholder="e.g. 1–3 months"
            className="w-full bg-surface border border-border rounded-[var(--radius-button)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <p className="text-xs text-text-secondary">
        I won&apos;t share your project details publicly without permission.
      </p>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-[var(--radius-button)] bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send"}
      </button>

      {status === "error" && (
        <p role="alert" className="text-error text-sm">
          Something went wrong — please try again or email me directly.
        </p>
      )}
    </form>
  );
}
