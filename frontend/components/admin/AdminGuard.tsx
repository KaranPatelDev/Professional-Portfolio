"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminMe } from "@/lib/api";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    adminMe()
      .then(() => setChecked(true))
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  if (!checked) {
    return <div className="max-w-5xl mx-auto px-6 py-16 text-text-secondary">Checking session…</div>;
  }

  return <>{children}</>;
}
