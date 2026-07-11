import { getBuildLogPosts } from "@/lib/api";
import { Card, PageTitle } from "@/components/ui";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Log | Karan Patel",
  description: "Short dev notes written while building this portfolio and other projects.",
};

export default async function BuildLogPage() {
  const posts = await getBuildLogPosts().catch(() => []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
      <Reveal>
        <PageTitle subtitle="Short notes written while actually building things — not polished tutorials.">
          Build Log
        </PageTitle>
      </Reveal>
      <div className="space-y-4">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.05}>
            <Link href={`/build-log/${post.slug}`}>
              <Card>
                <p className="text-xs text-text-secondary font-mono mb-2">
                  {new Date(post.published_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                </p>
                <h2 className="font-heading text-xl mb-2">{post.title}</h2>
                {post.summary && <p className="text-text-secondary text-sm">{post.summary}</p>}
              </Card>
            </Link>
          </Reveal>
        ))}
        {posts.length === 0 && <p className="text-text-secondary">No entries yet — check back soon.</p>}
      </div>
    </div>
  );
}
