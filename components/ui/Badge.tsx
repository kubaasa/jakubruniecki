import type { SkillLevel } from "@/types";

type BadgeVariant = "level" | "tag" | "muted";

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
  level?: SkillLevel;
};

const levelStyles: Record<SkillLevel, string> = {
  advanced: "border-accent-green/40 text-accent-green",
  intermediate: "border-border text-fg",
  beginner: "border-border-subtle text-fg-muted",
};

const variantStyles: Record<BadgeVariant, string> = {
  level: "",
  tag: "border-border text-fg",
  muted: "border-border-subtle text-fg-muted",
};

export function Badge({ label, variant = "tag", level }: BadgeProps) {
  const style =
    variant === "level" && level ? levelStyles[level] : variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center rounded-md border bg-bg-surface px-2.5 py-1 font-mono text-xs ${style}`}
    >
      {label}
      {variant === "level" && level ? (
        <span className="ml-2 text-fg-muted">· {level}</span>
      ) : null}
    </span>
  );
}
