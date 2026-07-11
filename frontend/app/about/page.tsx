import { getContentBlocks } from "@/lib/api";
import { Card, PageTitle, RichText } from "@/components/ui";
import Reveal from "@/components/Reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Karan Patel",
  description: "Backend-focused full-stack engineer specializing in Python and FastAPI.",
};

function contentValue(blocks: { key: string; value_html: string }[], key: string, fallback: string) {
  return blocks.find((b) => b.key === key)?.value_html ?? fallback;
}

export default async function AboutPage() {
  const content = await getContentBlocks().catch(() => []);
  const bioShort = contentValue(content, "bio_short", "");
  const bioLong = contentValue(content, "bio_long", "<p>Bio coming soon.</p>");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
      <Reveal>
        <PageTitle>About</PageTitle>
      </Reveal>
      <Reveal delay={0.05}>
        <Card>
          {bioShort && (
            <div className="text-text-secondary text-lg mb-6 pb-6 border-b border-border">
              <RichText html={bioShort} />
            </div>
          )}
          <RichText html={bioLong} />
        </Card>
      </Reveal>
    </div>
  );
}
