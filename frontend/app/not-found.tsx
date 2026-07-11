import { GhostButton, PrimaryButton } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-32 text-center">
      <p className="font-mono text-sm text-text-mono mb-4">404 — route not found</p>
      <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight mb-4">
        This endpoint doesn&apos;t exist.
      </h1>
      <p className="text-text-secondary mb-8">
        Whatever you were looking for isn&apos;t at this URL. Let&apos;s get you back on route.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <PrimaryButton href="/">Back to homepage</PrimaryButton>
        <GhostButton href="/projects">View projects</GhostButton>
      </div>
    </div>
  );
}
