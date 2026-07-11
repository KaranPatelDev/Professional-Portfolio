"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/work-with-me", label: "Work With Me" },
  { href: "/contact", label: "Contact" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled ? "glass-surface border-border shadow-sm shadow-black/20" : "border-transparent bg-bg"
      }`}
    >
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-heading text-lg text-text-primary">
          Karan Patel
        </Link>
        <ul className="flex items-center gap-6 text-sm text-text-secondary">
          {LINKS.map((link) => {
            const active = pathname === link.href;
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
      </nav>
    </header>
  );
}
