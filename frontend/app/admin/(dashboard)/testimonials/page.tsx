"use client";

import { useEffect, useState } from "react";
import { adminListAllTestimonials } from "@/lib/api";
import type { Testimonial } from "@/lib/types";
import TestimonialForm from "./TestimonialForm";

export default function AdminTestimonialsPage() {
  const [entries, setEntries] = useState<Testimonial[]>([]);
  const [showNew, setShowNew] = useState(false);

  function reload() {
    adminListAllTestimonials().then(setEntries).catch(() => setEntries([]));
    setShowNew(false);
  }

  useEffect(reload, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl">Testimonials</h1>
        <button onClick={() => setShowNew(true)} className="text-accent text-sm">
          + New testimonial
        </button>
      </div>
      {showNew && <TestimonialForm onSaved={reload} />}
      {entries.map((entry) => (
        <TestimonialForm key={entry.id} entry={entry} onSaved={reload} />
      ))}
    </div>
  );
}
