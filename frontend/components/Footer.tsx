export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-text-secondary">
        <span>&copy; {new Date().getFullYear()} Karan Patel</span>
        <div className="flex gap-5">
          <a href="mailto:mpkaranpatel001018@gmail.com" className="hover:text-accent transition-colors">
            Email
          </a>
          <a href="https://linkedin.com" className="hover:text-accent transition-colors">
            LinkedIn
          </a>
          <a href="https://github.com" className="hover:text-accent transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
