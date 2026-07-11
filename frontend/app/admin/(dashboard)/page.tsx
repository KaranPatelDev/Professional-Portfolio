"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminListContactRequests } from "@/lib/api";
import { Card } from "@/components/ui";

export default function AdminDashboardPage() {
  const [contactCount, setContactCount] = useState<number | null>(null);

  useEffect(() => {
    adminListContactRequests()
      .then((rows) => setContactCount(rows.length))
      .catch(() => setContactCount(null));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-text-secondary text-sm mb-1">Contact requests</p>
          <p className="font-heading text-2xl">{contactCount ?? "—"}</p>
          <Link href="/admin/contact-requests" className="text-accent text-sm mt-2 inline-block">
            View all &rarr;
          </Link>
        </Card>
        <Card>
          <p className="text-text-secondary text-sm mb-1">Quick links</p>
          <ul className="text-sm space-y-1 mt-2">
            <li>
              <Link href="/admin/projects" className="text-accent">
                Add a new project
              </Link>
            </li>
            <li>
              <Link href="/admin/content" className="text-accent">
                Edit homepage copy
              </Link>
            </li>
            <li>
              <Link href="/admin/availability" className="text-accent">
                Update availability status
              </Link>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
