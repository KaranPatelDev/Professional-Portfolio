"use client";

import { useReducedMotion } from "motion/react";

// Right-angle "PCB trace" paths — deliberately orthogonal (not organic
// curves) to read as circuit-board lines, not a generic gradient blob.
const TRACES = [
  { d: "M0,80 H200 V180 H450 V80 H800", dur: "7s" },
  { d: "M0,250 H150 V350 H400 V250 H650 V150 H800", dur: "9s" },
  { d: "M100,0 V60 H300 V0", dur: "5s" },
  { d: "M500,0 V100 H700 V300 H800", dur: "8s" },
  { d: "M0,400 H250 V450", dur: "6s" },
  { d: "M600,450 V380 H750 V250", dur: "10s" },
];

// A subset carries an animated "signal" pulse traveling along it.
const ANIMATED_INDICES = [0, 1, 3];

// Via-style dots at each trace's corners, for a more authentic PCB look.
const VIAS: [number, number][] = [
  [200, 80], [200, 180], [450, 180], [450, 80],
  [150, 250], [150, 350], [400, 350], [400, 250], [650, 250], [650, 150],
  [100, 60], [300, 60],
  [500, 100], [700, 100], [700, 300],
  [250, 400],
  [600, 380], [750, 380], [750, 250],
];

export default function CircuitTraceBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 pointer-events-none hero-bg-mask overflow-hidden">
      <svg
        className="w-full h-full"
        viewBox="0 0 800 450"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        {TRACES.map((trace, i) => (
          <path
            key={i}
            d={trace.d}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={1.5}
            opacity={0.6}
          />
        ))}
        {VIAS.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={2.5} fill="var(--color-border)" opacity={0.8} />
        ))}
        {!reduceMotion &&
          ANIMATED_INDICES.map((traceIndex, i) => (
            <circle key={`pulse-${i}`} r={3.5} fill="var(--color-accent)">
              <animateMotion
                dur={TRACES[traceIndex].dur}
                repeatCount="indefinite"
                path={TRACES[traceIndex].d}
              />
            </circle>
          ))}
      </svg>
    </div>
  );
}
