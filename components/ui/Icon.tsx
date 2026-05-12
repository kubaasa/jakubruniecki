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

export function FolderIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <path d="M2 4a1 1 0 0 1 1-1h3l1.5 1.5H13a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4z" />
    </svg>
  );
}

export function TSIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <rect width="16" height="16" rx="2" fill="#1f6feb" />
      <text
        x="8"
        y="11"
        fontSize="7"
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

export function MDIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <rect width="16" height="16" rx="2" fill="#30363d" />
      <text
        x="8"
        y="11"
        fontSize="6"
        fontFamily="ui-monospace, monospace"
        fontWeight="700"
        textAnchor="middle"
        fill="#79c0ff"
      >
        MD
      </text>
    </svg>
  );
}

export function EnvIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <rect width="16" height="16" rx="2" fill="#1c2128" />
      <text
        x="8"
        y="11"
        fontSize="5.5"
        fontFamily="ui-monospace, monospace"
        fontWeight="700"
        textAnchor="middle"
        fill="#d29922"
      >
        ENV
      </text>
    </svg>
  );
}

export function FileIcon({ language, ...rest }: IconProps & { language: "ts" | "md" | "env" }) {
  if (language === "ts") return <TSIcon {...rest} />;
  if (language === "md") return <MDIcon {...rest} />;
  return <EnvIcon {...rest} />;
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
