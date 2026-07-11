"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import { Card } from "@/components/ui";

export default function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (testimonials.length < 2 || reduceMotion) return;
    const interval = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 7000);
    return () => clearInterval(interval);
  }, [testimonials.length, reduceMotion]);

  if (testimonials.length === 0) return null;
  const current = testimonials[index];

  function prev() {
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  }
  function next() {
    setIndex((i) => (i + 1) % testimonials.length);
  }

  return (
    <Card className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-lg text-text-primary leading-relaxed mb-4">&ldquo;{current.quote}&rdquo;</p>
          <p className="text-sm text-text-secondary font-mono">&mdash; {current.author}</p>
        </motion.div>
      </AnimatePresence>

      {testimonials.length > 1 && (
        <div className="flex items-center gap-3 mt-6">
          <button onClick={prev} aria-label="Previous testimonial" className="text-text-secondary hover:text-accent">
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-1.5">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setIndex(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? "bg-accent" : "bg-border"}`}
              />
            ))}
          </div>
          <button onClick={next} aria-label="Next testimonial" className="text-text-secondary hover:text-accent">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </Card>
  );
}
