"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminLogout } from "@/lib/api";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/content", label: "Site Content" },
  { href: "/admin/availability", label: "Availability" },
  { href: "/admin/resume", label: "Resume" },
  { href: "/admin/contact-requests", label: "Contact Requests" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-56 shrink-0 border-r border-border min-h-screen py-8 px-4">
      <p className="font-heading text-sm mb-6 text-text-secondary">Admin Panel</p>
      <nav className="space-y-1">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded px-3 py-2 text-sm ${
              pathname === link.href ? "bg-surface-elevated text-accent" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={async () => {
          await adminLogout().catch(() => {});
          router.push("/admin/login");
        }}
        className="mt-8 text-sm text-text-secondary hover:text-error"
      >
        Log out
      </button>
    </aside>
  );
}
