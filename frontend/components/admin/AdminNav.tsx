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

  async function handleLogout() {
    await adminLogout().catch(() => {});
    router.push("/admin/login");
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-56 shrink-0 border-r border-border min-h-screen py-8 px-4">
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
        <button onClick={handleLogout} className="mt-8 text-sm text-text-secondary hover:text-error">
          Log out
        </button>
      </aside>

      {/* Mobile horizontal nav */}
      <div className="md:hidden border-b border-border sticky top-0 z-30 bg-bg">
        <nav className="flex gap-1 overflow-x-auto px-3 py-2 no-scrollbar">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded px-3 py-1.5 text-sm whitespace-nowrap ${
                pathname === link.href ? "bg-surface-elevated text-accent" : "text-text-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="shrink-0 rounded px-3 py-1.5 text-sm text-text-secondary">
            Log out
          </button>
        </nav>
      </div>
    </>
  );
}
