import type { ReactNode } from "react";

export function BentoGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-auto gap-4 [grid-auto-flow:dense] ${className}`}>
      {children}
    </div>
  );
}

const SPAN_CLASSES: Record<string, string> = {
  "1x1": "lg:col-span-1 lg:row-span-1",
  "2x1": "lg:col-span-2 lg:row-span-1",
  "2x2": "lg:col-span-2 lg:row-span-2",
  "4x1": "lg:col-span-4 lg:row-span-1",
};

export function BentoCell({
  span = "1x1",
  children,
  className = "",
}: {
  span?: keyof typeof SPAN_CLASSES;
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${SPAN_CLASSES[span]} ${className}`}>{children}</div>;
}
