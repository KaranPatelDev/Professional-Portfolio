"use client";

import { useEffect, useState } from "react";
import { getBackendStatus } from "@/lib/api";
import { Card, StatusDot } from "@/components/ui";

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function StatusWidget() {
  const [uptime, setUptime] = useState<string | null>(null);
  const [operational, setOperational] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    function poll() {
      getBackendStatus()
        .then((s) => {
          if (cancelled) return;
          setOperational(s.status === "operational");
          setUptime(formatUptime(s.uptime_seconds));
        })
        .catch(() => {
          if (!cancelled) setOperational(false);
        });
    }

    poll();
    const interval = setInterval(poll, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div id="status-widget" className="h-full">
      <Card className="h-full min-h-[104px] flex flex-col justify-center">
        <p className="text-xs text-text-secondary uppercase font-mono mb-1">Live backend status</p>
        {operational === null ? (
          <p className="text-sm text-text-secondary">Checking…</p>
        ) : (
          <div className="flex items-center gap-2">
            <StatusDot live={operational} />
            <p className="text-sm">
              {operational ? "API Operational" : "API unreachable"}
              {uptime && operational && <span className="text-text-secondary"> · up {uptime}</span>}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
