import Link from "next/link";

const LINKS = [
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/work-with-me", label: "Work With Me" },
  { href: "/contact", label: "Contact" },
];

export default function NavBar() {
  return (
    <header className="border-b border-border sticky top-0 z-40 bg-bg/90 backdrop-blur">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-heading text-lg text-text-primary">
          Karan Patel
        </Link>
        <ul className="flex items-center gap-6 text-sm text-text-secondary">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-accent transition-colors">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
