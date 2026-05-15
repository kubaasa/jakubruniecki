import type { NextConfig } from "next";
import { execSync } from "node:child_process";
import pkg from "./package.json" with { type: "json" };

function getLastCommitDate(): string {
  try {
    return execSync("git log -1 --format=%cI", { encoding: "utf8" }).trim();
  } catch {
    return new Date().toISOString();
  }
}

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_APP_NAME: pkg.name,
    NEXT_PUBLIC_APP_VERSION: pkg.version,
    NEXT_PUBLIC_BUILD_DATE: getLastCommitDate(),
  },
};

export default nextConfig;
