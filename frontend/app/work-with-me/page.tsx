import { getContentBlocks, getServices } from "@/lib/api";
import { Card, PrimaryButton, RichText } from "@/components/ui";
import { BentoGrid, BentoCell } from "@/components/BentoGrid";
import Reveal from "@/components/Reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hire Karan Patel — Backend & Full-Stack Freelance Developer",
  description: "Freelance backend/API development, SaaS MVPs, and business applications.",
};

export default async function WorkWithMePage() {
  const [services, content] = await Promise.all([
    getServices().catch(() => []),
    getContentBlocks().catch(() => []),
  ]);
  const pitch = content.find((c) => c.key === "freelance_pitch")?.value_html;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <Reveal>
        <h1 className="font-heading text-3xl mb-4">Work With Me</h1>
        {pitch && (
          <div className="text-text-secondary text-lg mb-10 max-w-3xl">
            <RichText html={pitch} />
          </div>
        )}
      </Reveal>

      <Reveal delay={0.05}>
        <h2 className="font-heading text-xl mb-4">Services</h2>
      </Reveal>
      <BentoGrid className="mb-12">
        {services
          .sort((a, b) => a.display_order - b.display_order)
          .map((service, i) => (
            <BentoCell span="2x1" key={service.id}>
              <Reveal delay={0.1 + i * 0.05} className="h-full">
                <Card className="h-full">
                  <h3 className="font-heading text-lg mb-2">{service.name}</h3>
                  <p className="text-text-secondary text-sm mb-2">
                    <span className="text-text-mono font-mono">Client problem:</span> {service.client_problem}
                  </p>
                  <p className="text-text-secondary text-sm mb-3">
                    <span className="text-text-mono font-mono">I deliver:</span> {service.deliverable}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.stack.map((s) => (
                      <span key={s} className="font-mono text-xs text-text-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </Card>
              </Reveal>
            </BentoCell>
          ))}
      </BentoGrid>

      <Reveal delay={0.2}>
        <Card className="text-center py-10 max-w-3xl mx-auto">
          <h2 className="font-heading text-xl mb-3">Start a project</h2>
          <p className="text-text-secondary mb-6">
            I typically reply within 1&ndash;2 business days.
          </p>
          <PrimaryButton href="/contact">Start a project</PrimaryButton>
        </Card>
      </Reveal>
    </div>
  );
}
