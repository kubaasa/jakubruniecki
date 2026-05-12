import type { SVGProps } from "react";

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
};

const DEFAULT_FOLDER = { body: "#6e7681", tab: "#8b949e" };

export function FolderIcon({
  path,
  open,
  ...rest
}: IconProps & { path?: string; open?: boolean }) {
  const c = (path && FOLDER_COLORS[path]) || DEFAULT_FOLDER;
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

export function FileIcon({
  language,
  path,
  ...rest
}: IconProps & { language: "ts" | "md" | "env"; path?: string }) {
  if (path === "README.md") return <ReadmeIcon {...rest} />;
  if (path === ".env") return <EnvIcon {...rest} />;
  if (language === "env") return <EnvIcon {...rest} />;
  if (language === "md") return <MDIcon {...rest} />;
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
    <svg {...base(props)}>
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4" />
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
      <path d="M3 6l3-3 3 3M3 10l3 3 3-3M11 5h2M11 11h2" />
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
