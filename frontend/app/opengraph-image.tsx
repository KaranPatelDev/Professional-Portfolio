import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
        <div style={{ fontSize: 28, color: "#9ca8ff", fontFamily: "monospace", marginBottom: 24 }}>
          karanpateldev.indevs.in
        </div>
        <div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.15, maxWidth: 900 }}>
          I build backend systems that businesses actually run on.
        </div>
        <div style={{ fontSize: 30, color: "#8a8d96", marginTop: 32 }}>
          Karan Patel — Backend Engineer · Python / FastAPI
        </div>
      </div>
    ),
    { ...size }
  );
}
