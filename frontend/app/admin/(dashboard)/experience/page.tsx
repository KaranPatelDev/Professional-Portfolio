"use client";

import { useEffect, useState } from "react";
import { getExperience } from "@/lib/api";
import type { Experience } from "@/lib/types";
import ExperienceForm from "./ExperienceForm";

export default function AdminExperiencePage() {
  const [entries, setEntries] = useState<Experience[]>([]);
  const [showNew, setShowNew] = useState(false);

  function reload() {
    getExperience().then(setEntries).catch(() => setEntries([]));
    setShowNew(false);
  }

  useEffect(reload, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl">Experience</h1>
        <button onClick={() => setShowNew(true)} className="text-accent text-sm">
          + New entry
        </button>
      </div>
      {showNew && <ExperienceForm onSaved={reload} />}
      {entries.map((entry) => (
        <ExperienceForm key={entry.id} entry={entry} onSaved={reload} />
      ))}
    </div>
  );
}
