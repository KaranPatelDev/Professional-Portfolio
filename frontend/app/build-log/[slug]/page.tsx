import { getBuildLogPost } from "@/lib/api";
import { RichText } from "@/components/ui";
import Reveal from "@/components/Reveal";
import ScrollProgress from "@/components/ScrollProgress";
import { estimateReadingTime } from "@/lib/readingTime";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getBuildLogPost(slug);
    return { title: `${post.title} | Karan Patel`, description: post.summary ?? undefined };
  } catch {
    return { title: "Post not found | Karan Patel" };
  }
}

export default async function BuildLogPostPage({ params }: Props) {
  const { slug } = await params;
  let post;
  try {
    post = await getBuildLogPost(slug);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <ScrollProgress />
      <Reveal>
        <p className="text-xs text-text-secondary font-mono mb-4">
          {new Date(post.published_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
          {" · "}
          {estimateReadingTime(post.body_html)}
        </p>
        <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight mb-8">{post.title}</h1>
      </Reveal>
      <Reveal delay={0.05}>
        <RichText html={post.body_html} />
      </Reveal>
    </div>
  );
}
