import { ImageResponse } from "next/og";
import { getProject } from "@/lib/api";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug).catch(() => null);
  const title = project?.title ?? "Project";
  const tag = project?.tags?.replace("_", " ") ?? "Project";
  const status = project?.status ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0b0d",
          color: "#e6e7ea",
        }}
      >
        <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
          <div
            style={{
              fontSize: 22,
              color: "#9ca8ff",
              fontFamily: "monospace",
              textTransform: "uppercase",
              border: "1px solid #2a2d33",
              borderRadius: 6,
              padding: "6px 14px",
            }}
          >
            {tag}
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#9ca8ff",
              fontFamily: "monospace",
              textTransform: "uppercase",
              border: "1px solid #2a2d33",
              borderRadius: 6,
              padding: "6px 14px",
            }}
          >
            {status}
          </div>
        </div>
        <div style={{ fontSize: 58, fontWeight: 600, lineHeight: 1.15, maxWidth: 1000 }}>{title}</div>
        <div style={{ fontSize: 28, color: "#8a8d96", marginTop: 32 }}>Karan Patel — Case Study</div>
      </div>
    ),
    { ...size }
  );
}
