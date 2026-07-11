"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

const BURST_COLORS = ["var(--color-accent)", "var(--color-accent-live)", "var(--color-warning)"];

export const RESUME_DOWNLOADED_EVENT = "resume:downloaded";

export default function ResumeDownloadToast() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    function onDownloaded() {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3200);
      return () => clearTimeout(timer);
    }
    window.addEventListener(RESUME_DOWNLOADED_EVENT, onDownloaded);
    return () => window.removeEventListener(RESUME_DOWNLOADED_EVENT, onDownloaded);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="fixed bottom-6 right-6 z-[200] glass-surface border border-border rounded-[var(--radius-card)] shadow-2xl px-4 py-3 flex items-center gap-3 max-w-xs"
          role="status"
        >
          <span className="relative shrink-0">
            <CheckCircle2 className="text-accent-live" size={22} />
            {!reduceMotion &&
              BURST_COLORS.map((color, i) => (
                <motion.span
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full"
                  style={{ background: color }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos((i / BURST_COLORS.length) * Math.PI * 2) * 18,
                    y: Math.sin((i / BURST_COLORS.length) * Math.PI * 2) * 18,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              ))}
          </span>
          <div className="text-sm">
            <p className="text-text-primary font-medium">Resume downloaded</p>
            <p className="text-text-secondary text-xs">Thanks for checking it out.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
