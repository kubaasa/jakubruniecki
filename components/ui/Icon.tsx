import type { ReactNode, SVGProps } from "react";
import type { Language } from "@/app/ide/types";
import { PlaywrightIcon } from "@/components/icons/PlaywrightIcon";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function base(props: IconProps) {
  return {
    viewBox: "0 0 16 16",
    width: 16,
    height: 16,
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function ChevronIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 4l4 4-4 4" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

const FOLDER_COLORS: Record<string, { body: string; tab: string }> = {
  portfolio: { body: "#1f6feb", tab: "#388bfd" },
  tests: { body: "#238636", tab: "#2ea043" },
  "case-studies": { body: "#8957e5", tab: "#a371f7" },
  "tests/.auth": { body: "#b78c1f", tab: "#d4a72c" },
  "tests/fixtures": { body: "#bf4b8a", tab: "#db61a2" },
  "tests/pages": { body: "#c9622f", tab: "#e07b3e" },
  "tests/specs": { body: "#1f7a8c", tab: "#3aa3b8" },
  "tests/test-data": { body: "#1a6dc7", tab: "#2f86dd" },
  "tests/utils": { body: "#5a6470", tab: "#7a8593" },
  "tests/visual-snapshots": { body: "#7a4dd1", tab: "#9670e0" },
};

const DEFAULT_FOLDER = { body: "#6e7681", tab: "#8b949e" };

const OVERLAY_GLYPHS: Record<string, ReactNode> = {
  "tests/.auth": (
    <g
      stroke="#fff"
      strokeWidth={1}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="12" r="1.6" />
      <path d="M10.4 11.4l3.4-3.4M12.6 9.2l1 1M13.6 8.2l1 1" />
    </g>
  ),
  "tests/fixtures": (
    <g
      stroke="#fff"
      strokeWidth={1}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 14l5.5-5.5M12 7l2.5 2.5M11 10l1.5 1.5M9.5 11.5L11 13" />
      <path d="M14 6l1.5 1.5" />
    </g>
  ),
  "tests/pages": (
    <g
      stroke="#fff"
      strokeWidth={0.9}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M9 9h3l1.5 1.5v4h-4.5z" />
      <path d="M12 9v1.5h1.5" />
      <path d="M10 12h2.5M10 13.2h2" />
    </g>
  ),
  "tests/specs": (
    <g
      stroke="#fff"
      strokeWidth={1.4}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 11.5l2 2 4-4.5" />
    </g>
  ),
  "tests/test-data": (
    <g fill="#fff">
      <rect x="8.2" y="11.5" width="1.2" height="3" rx="0.2" />
      <rect x="10.2" y="9.5" width="1.2" height="5" rx="0.2" />
      <rect x="12.2" y="10.8" width="1.2" height="3.7" rx="0.2" />
      <rect x="14.2" y="8.2" width="1.2" height="6.3" rx="0.2" />
    </g>
  ),
  "tests/utils": (
    <g
      stroke="#fff"
      strokeWidth={1}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13.5 8.2a2 2 0 0 0-2.5 2.5l-2.7 2.7 1.3 1.3 2.7-2.7a2 2 0 0 0 2.5-2.5l-1.1 1.1-1-1z" />
    </g>
  ),
  "tests/visual-snapshots": (
    <g
      stroke="#fff"
      strokeWidth={0.9}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <rect x="9" y="9.5" width="5" height="4.5" rx="0.5" />
      <circle cx="10.4" cy="10.9" r="0.45" fill="#fff" stroke="none" />
      <path d="M9.2 13.3l1.6-1.4 1.4 1.1 1.6-1.5" />
    </g>
  ),
};

export function FolderIcon({
  path,
  open,
  ...rest
}: IconProps & { path?: string; open?: boolean }) {
  const c = (path && FOLDER_COLORS[path]) || DEFAULT_FOLDER;
  const overlay = path ? OVERLAY_GLYPHS[path] : undefined;
  if (open) {
    return (
      <svg viewBox="0 0 22 18" width={16} height={16} aria-hidden {...rest}>
        <path d="M2 3.5h6l1.6 1.7H20a1 1 0 0 1 1 1V8H2z" fill={c.tab} />
        <path
          d="M2 8h19l-1.6 7.5a1.2 1.2 0 0 1-1.2 1H3.5a1 1 0 0 1-1-1.1z"
          fill={c.body}
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 22 18" width={16} height={16} aria-hidden {...rest}>
      <path d="M2 3.5h6l1.6 1.7H20a1 1 0 0 1 1 1V6.5H2z" fill={c.tab} />
      <rect x="2" y="6" width="19" height="10" rx="1" fill={c.body} />
      <rect x="2" y="6" width="19" height="1.5" fill="white" fillOpacity="0.18" />
      {overlay}
    </svg>
  );
}

export function TSIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden {...props}>
      <rect x="1" y="1" width="14" height="14" rx="2" fill="#3178c6" />
      <text
        x="8"
        y="11.5"
        fontSize="7.5"
        fontFamily="ui-monospace, monospace"
        fontWeight="700"
        textAnchor="middle"
        fill="#fff"
      >
        TS
      </text>
    </svg>
  );
}

export function SpecIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden {...props}>
      <rect x="1" y="1" width="14" height="14" rx="2" fill="#2ea043" />
      <path
        d="M4 8.5l2 2 5-5"
        stroke="#fff"
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MDIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden {...props}>
      <rect x="1" y="2.5" width="14" height="11" rx="1.5" fill="#1f6feb" />
      <path
        d="M4 10.5V5.5l1.7 2.5L7.4 5.5v5M10 5.5v5M10 10.5l1.5-1.5L13 10.5"
        stroke="#fff"
        strokeWidth={1.2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ReadmeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden {...props}>
      <circle cx="8" cy="8" r="6.5" fill="#388bfd" />
      <circle cx="8" cy="4.8" r="0.9" fill="#fff" />
      <rect x="7.1" y="6.6" width="1.8" height="5.6" rx="0.4" fill="#fff" />
    </svg>
  );
}

export function EnvIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden {...props}>
      <circle cx="8" cy="8" r="6.5" fill="#d29922" />
      <path d="M5 7h6M5 9.5h4" stroke="#0d1117" strokeWidth={1.3} />
    </svg>
  );
}

export function JsonIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden {...props}>
      <rect x="1" y="1" width="14" height="14" rx="2" fill="#f1c40f" />
      <text
        x="8"
        y="11"
        fontSize="6"
        fontFamily="ui-monospace, monospace"
        fontWeight="700"
        textAnchor="middle"
        fill="#1f1300"
      >
        {"{ }"}
      </text>
    </svg>
  );
}

export function TxtIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden {...props}>
      <rect x="2" y="1.5" width="12" height="13" rx="1.5" fill="#8b949e" />
      <path
        d="M5 5h6M5 7.5h6M5 10h4"
        stroke="#0d1117"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PngIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden {...props}>
      <rect x="1.5" y="2" width="13" height="12" rx="1.5" fill="#a371f7" />
      <circle cx="6" cy="6.5" r="1.2" fill="#fff" />
      <path
        d="M2.5 12.5l3.5-4 2.5 2.5 2-1.5 3 3"
        stroke="#fff"
        strokeWidth={1.2}
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FileIcon({
  language,
  path,
  ...rest
}: IconProps & { language: Language; path?: string }) {
  if (path === "README.md") return <ReadmeIcon {...rest} />;
  if (path === ".env") return <EnvIcon {...rest} />;
  if (language === "env") return <EnvIcon {...rest} />;
  if (language === "md") return <MDIcon {...rest} />;
  if (language === "json") return <JsonIcon {...rest} />;
  if (language === "txt") return <TxtIcon {...rest} />;
  if (language === "png") return <PngIcon {...rest} />;
  if (path && path.endsWith("playwright.config.ts"))
    return <PlaywrightIcon className={rest.className} />;
  if (path && path.endsWith(".spec.ts")) return <SpecIcon {...rest} />;
  return <TSIcon {...rest} />;
}

export function ExplorerIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2 3h5l1.5 1.5H14V13H2V3z" />
      <path d="M2 7h12" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="7" cy="7" r="4" />
      <path d="M10 10l3.5 3.5" />
    </svg>
  );
}

export function GitIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="4" cy="4" r="1.5" />
      <circle cx="4" cy="12" r="1.5" />
      <circle cx="12" cy="8" r="1.5" />
      <path d="M4 5.5v5M5.5 4h2.5a2 2 0 0 1 2 2v.5" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <path d="M5 4l8 4-8 4V4z" />
    </svg>
  );
}

export function StopIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <rect x="4" y="4" width="8" height="8" rx="1" />
    </svg>
  );
}

export function ExtensionsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9c0-.6.4-1 1-1h2c.6 0 1 .4 1 1v2c0 .6-.4 1-1 1h-2c-.6 0-1-.4-1-1V9z" />
    </svg>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a7 7 0 0 0 0-3l2-1.5-2-3.5-2.4 1a7 7 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.5a7 7 0 0 0-2.6 1.5l-2.4-1-2 3.5 2 1.5a7 7 0 0 0 0 3l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 2.6 1.5l.4 2.5h4l.4-2.5a7 7 0 0 0 2.6-1.5l2.4 1 2-3.5z" />
    </svg>
  );
}

export function RunActivityIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      aria-hidden
      {...props}
    >
      <polygon points="6,4 20,12 6,20" fill="currentColor" />
    </svg>
  );
}

export function NewFileIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 2h5l3 3v9H4V2z" />
      <path d="M8 7v4M6 9h4" />
    </svg>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 8a5 5 0 1 1 1.4 3.5" />
      <path d="M3 13v-3h3" />
    </svg>
  );
}

export function CollapseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2 8h12M4 5l-2 3 2 3M12 5l2 3-2 3" />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 11V8a4 4 0 0 1 8 0v3l1 1H3l1-1zM7 13a1 1 0 0 0 2 0" />
    </svg>
  );
}

export function ErrorDot(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="8" cy="8" r="5" />
      <path d="M8 5v3.5M8 11v.5" />
    </svg>
  );
}

export function WarningDot(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 2l6 11H2L8 2z" />
      <path d="M8 6v3.5M8 11v.5" />
    </svg>
  );
}

export function BranchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="4" cy="3" r="1.5" />
      <circle cx="4" cy="13" r="1.5" />
      <circle cx="12" cy="8" r="1.5" />
      <path d="M4 4.5v7M5.5 13c4 0 5-2 5-3.5" />
    </svg>
  );
}
