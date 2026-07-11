import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { SOCIAL_LINKS } from "@/lib/social";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24 w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-text-secondary">
        <span className="inline-flex items-center gap-2">
          &copy; {new Date().getFullYear()} Karan Patel
          {/* Deliberately unlabeled/undecorated — admin entry point, not a public nav item. */}
          <Link
            href="/admin/login"
            aria-label="Admin login"
            className="w-1.5 h-1.5 rounded-full bg-text-secondary/20 hover:bg-accent transition-colors"
          />
        </span>
        <div className="flex gap-4">
          <a
            href={`mailto:${SOCIAL_LINKS.email}`}
            aria-label="Email"
            className="hover:text-accent transition-colors"
          >
            <Mail size={18} />
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-accent transition-colors"
          >
            <LinkedinIcon size={18} />
          </a>
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-accent transition-colors"
          >
            <GithubIcon size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
