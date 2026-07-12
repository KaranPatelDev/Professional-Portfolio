"use client";

import { useEffect, useState } from "react";
import { adminDelete, adminListContactRequests } from "@/lib/api";
import type { ContactRequest } from "@/lib/types";
import { Card } from "@/components/ui";

export default function AdminContactRequestsPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);

  function reload() {
    adminListContactRequests().then(setRequests).catch(() => setRequests([]));
  }

  useEffect(reload, []);

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this contact request?")) return;
    await adminDelete(`/api/admin/contact-requests/${id}`);
    reload();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl mb-6">Contact Requests</h1>
      <div className="space-y-3">
        {requests.map((r) => (
          <Card key={r.id}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-heading flex items-center gap-2">
                  {r.name} &mdash; <a href={`mailto:${r.email}`} className="text-accent">{r.email}</a>
                  {!r.email_sent && (
                    <span className="text-xs font-mono text-error bg-error/10 border border-error/30 rounded px-2 py-0.5">
                      Email notification failed — reply directly
                    </span>
                  )}
                </p>
                <p className="text-text-secondary text-xs mb-2">
                  {new Date(r.created_at).toLocaleString()} · {r.budget_range || "n/a"} · {r.timeline || "n/a"}
                </p>
                <p className="text-sm">{r.message}</p>
              </div>
              <button onClick={() => handleDelete(r.id)} className="text-error text-sm shrink-0 ml-4">
                Delete
              </button>
            </div>
          </Card>
        ))}
        {requests.length === 0 && <p className="text-text-secondary">No contact requests yet.</p>}
      </div>
    </div>
  );
}
