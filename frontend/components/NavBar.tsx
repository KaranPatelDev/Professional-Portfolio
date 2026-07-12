"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, Menu, Search, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { getResume } from "@/lib/api";
import { triggerResumeDownload } from "./ResumeDownloadButton";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/build-log", label: "Build Log" },
  { href: "/work-with-me", label: "Work With Me" },
  { href: "/contact", label: "Contact" },
];

function isMac() {
  return typeof navigator !== "undefined" && /Mac/.test(navigator.platform);
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    getResume()
      .then((r) => setResumeUrl(r.file_url))
      .catch(() => {});
  }, []);

  function openPalette() {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled || menuOpen ? "glass-surface border-border shadow-sm shadow-black/20" : "border-transparent bg-bg"
      }`}
    >
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        <Link href="/" className="font-heading text-lg text-text-primary">
          Karan Patel
        </Link>

        <ul className="hidden md:flex items-center gap-6 text-sm text-text-secondary">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href} className="relative">
                <Link href={link.href} className={`transition-colors ${active ? "text-accent" : "hover:text-accent"}`}>
                  {link.label}
                </Link>
                {active && <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-accent rounded-full" />}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1">
          <button
            onClick={openPalette}
            className="hidden sm:flex items-center gap-2 text-xs text-text-secondary border border-border rounded-full px-3 py-1.5 hover:border-accent transition-colors"
          >
            <Search size={13} />
            <span className="font-mono">{isMac() ? "⌘K" : "Ctrl K"}</span>
          </button>
          <button onClick={openPalette} className="sm:hidden p-2 text-text-secondary" aria-label="Open search">
            <Search size={18} />
          </button>
          {resumeUrl && (
            <button
              onClick={() => triggerResumeDownload(resumeUrl)}
              aria-label="View resume (PDF)"
              title="View resume (PDF)"
              className="p-2 text-text-secondary hover:text-accent transition-colors"
            >
              <FileText size={18} />
            </button>
          )}
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden p-2 -mr-2 text-text-primary"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <ul className="md:hidden glass-surface border-t border-border px-4 py-3 space-y-1">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block py-2.5 text-base ${active ? "text-accent" : "text-text-secondary"}`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </header>
  );
}
