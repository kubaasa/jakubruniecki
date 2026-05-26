import { renderOgImage, OG_SIZE, OG_ALT, OG_CONTENT_TYPE } from "@/lib/og/banner";

// Required for next/og routes when output: "export" is configured.
export const dynamic = "force-static";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage();
}
