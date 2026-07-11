"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminListContactRequests } from "@/lib/api";
import { Card, StatChip } from "@/components/ui";
import { BentoGrid, BentoCell } from "@/components/BentoGrid";
import Reveal from "@/components/Reveal";

export default function AdminDashboardPage() {
  const [contactCount, setContactCount] = useState<number | null>(null);

  useEffect(() => {
    adminListContactRequests()
      .then((rows) => setContactCount(rows.length))
      .catch(() => setContactCount(null));
  }, []);

  return (
    <div>
      <Reveal>
        <h1 className="font-heading text-2xl mb-6">Dashboard</h1>
      </Reveal>
      <BentoGrid>
        <BentoCell span="1x1">
          <Reveal>
            <StatChip label="Contact requests" value={String(contactCount ?? 0)} />
          </Reveal>
        </BentoCell>
        <BentoCell span="1x1">
          <Reveal delay={0.05} className="h-full">
            <Card className="h-full flex flex-col justify-center">
              <Link href="/admin/contact-requests" className="text-accent text-sm">
                View all requests &rarr;
              </Link>
            </Card>
          </Reveal>
        </BentoCell>
        <BentoCell span="2x1">
          <Reveal delay={0.1} className="h-full">
            <Card className="h-full">
              <p className="text-text-secondary text-sm mb-2">Quick links</p>
              <ul className="text-sm space-y-1">
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
          </Reveal>
        </BentoCell>
      </BentoGrid>
    </div>
  );
}
