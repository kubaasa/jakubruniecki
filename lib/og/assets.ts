import { readFileSync } from "node:fs";
import { join } from "node:path";

// Satori (next/og) supports ttf, otf and woff - NOT woff2. @fontsource ships
// .woff alongside .woff2, so we read the .woff files directly from node_modules.
const fontsDir = join(process.cwd(), "node_modules", "@fontsource");
const publicDir = join(process.cwd(), "public");

export type OgFont = {
  name: string;
  data: Buffer;
  weight: 400 | 600 | 700;
  style: "normal";
};

export function loadFonts(): OgFont[] {
  return [
    { name: "Inter", data: readFileSync(join(fontsDir, "inter/files/inter-latin-400-normal.woff")), weight: 400, style: "normal" },
    { name: "Inter", data: readFileSync(join(fontsDir, "inter/files/inter-latin-600-normal.woff")), weight: 600, style: "normal" },
    { name: "Inter", data: readFileSync(join(fontsDir, "inter/files/inter-latin-700-normal.woff")), weight: 700, style: "normal" },
    { name: "JetBrains Mono", data: readFileSync(join(fontsDir, "jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff")), weight: 400, style: "normal" },
  ];
}

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function svgFileToDataUri(file: string): string {
  return svgToDataUri(readFileSync(join(publicDir, file), "utf8"));
}

// Small inline check glyph - drawn as SVG so we do not depend on a font glyph.
const CHECK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3fb950" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

export type OgIcons = {
  playwright: string;
  typescript: string;
  postman: string;
  claude: string;
  check: string;
};

export function loadIcons(): OgIcons {
  return {
    playwright: svgFileToDataUri("playwright-logo.svg"),
    typescript: svgFileToDataUri("typescript-logo.svg"),
    postman: svgFileToDataUri("postman-icon.svg"),
    claude: svgFileToDataUri("claude-ai.svg"),
    check: svgToDataUri(CHECK_SVG),
  };
}
