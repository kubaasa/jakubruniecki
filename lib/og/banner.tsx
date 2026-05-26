import { ImageResponse } from "next/og";
import { loadFonts, loadIcons, type OgIcons } from "./assets";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = "Jakub Bruniecki - QA Automation Engineer";
export const OG_CONTENT_TYPE = "image/png";

function Banner({ icons }: { icons: OgIcons }) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0d1117",
        color: "#e6edf3",
        fontFamily: "Inter",
        position: "relative",
      }}
    >
      {/* chrome bar */}
      <div
        style={{
          height: 52,
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          backgroundColor: "#161b22",
          borderBottom: "1px solid #21262d",
        }}
      >
        <div style={{ width: 15, height: 15, borderRadius: 9999, backgroundColor: "#f85149" }} />
        <div style={{ width: 15, height: 15, borderRadius: 9999, backgroundColor: "#d29922", marginLeft: 10 }} />
        <div style={{ width: 15, height: 15, borderRadius: 9999, backgroundColor: "#3fb950", marginLeft: 10 }} />
        <div
          style={{
            display: "flex",
            marginLeft: 18,
            padding: "9px 22px",
            fontFamily: "JetBrains Mono",
            fontSize: 18,
            color: "#e6edf3",
            backgroundColor: "#0d1117",
            borderTop: "3px solid #e3a008",
            borderLeft: "1px solid #21262d",
            borderRight: "1px solid #21262d",
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
          }}
        >
          about.ts
        </div>
      </div>

      {/* body */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          padding: "0 90px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#3fb950",
            fontSize: 21,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          <div
            style={{
              width: 13,
              height: 13,
              borderRadius: 9999,
              backgroundColor: "#3fb950",
              marginRight: 13,
              boxShadow: "0 0 16px 2px rgba(63,185,80,0.7)",
            }}
          />
          Available for remote roles
        </div>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 700, letterSpacing: -2, marginTop: 18, marginBottom: 8 }}>
          Jakub Bruniecki
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#7d8590", marginBottom: 44 }}>QA Automation Engineer</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={icons.playwright} width={72} height={72} alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={icons.typescript} width={72} height={72} style={{ marginLeft: 42 }} alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={icons.postman} width={72} height={72} style={{ marginLeft: 42 }} alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={icons.claude} width={72} height={72} style={{ marginLeft: 42 }} alt="" />
        </div>
      </div>

      {/* status bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 46,
          display: "flex",
          alignItems: "center",
          padding: "0 28px",
          backgroundColor: "#161b22",
          borderTop: "1px solid #21262d",
          fontFamily: "JetBrains Mono",
          fontSize: 18,
          color: "#7d8590",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", color: "#e3a008" }}>
          <div style={{ width: 11, height: 11, backgroundColor: "#e3a008", transform: "rotate(45deg)", marginRight: 10 }} />
          main
        </div>
        <div style={{ display: "flex", alignItems: "center", color: "#3fb950", marginLeft: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={icons.check} width={14} height={14} style={{ marginRight: 9 }} alt="" />
          tests passing
        </div>
        <div style={{ display: "flex", marginLeft: "auto" }}>jakubruniecki.dev</div>
      </div>
    </div>
  );
}

export function renderOgImage(): ImageResponse {
  return new ImageResponse(<Banner icons={loadIcons()} />, {
    ...OG_SIZE,
    fonts: loadFonts(),
  });
}
