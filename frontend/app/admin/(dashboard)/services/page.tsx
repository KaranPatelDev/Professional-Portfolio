"use client";

import { useEffect, useState } from "react";
import { adminListAllServices } from "@/lib/api";
import type { Service } from "@/lib/types";
import ServiceForm from "./ServiceForm";

export default function AdminServicesPage() {
  const [entries, setEntries] = useState<Service[]>([]);
  const [showNew, setShowNew] = useState(false);

  function reload() {
    adminListAllServices().then(setEntries).catch(() => setEntries([]));
    setShowNew(false);
  }

  useEffect(reload, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl">Services</h1>
        <button onClick={() => setShowNew(true)} className="text-accent text-sm">
          + New service
        </button>
      </div>
      {showNew && <ServiceForm onSaved={reload} />}
      {entries.map((entry) => (
        <ServiceForm key={entry.id} entry={entry} onSaved={reload} />
      ))}
    </div>
  );
}
