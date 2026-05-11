import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt = "Jakub Bruniecki — Senior QA Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0d1117",
          color: "#e6edf3",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#3fb950",
            fontSize: 24,
            marginBottom: 24,
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              background: "#3fb950",
              borderRadius: 999,
            }}
          />
          AVAILABLE FOR REMOTE ROLES
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05, display: "flex" }}>
          Jakub Bruniecki
        </div>
        <div style={{ fontSize: 36, color: "#7d8590", marginTop: 16, display: "flex" }}>
          Senior QA Engineer · Manual + Playwright automation
        </div>
        <div style={{ fontSize: 24, color: "#7d8590", marginTop: 40, display: "flex" }}>
          jakubruniecki.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
