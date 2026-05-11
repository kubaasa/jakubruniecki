type AvatarProps = {
  src: string;
  alt: string;
  status?: "online";
  size?: "sm" | "md" | "lg";
};

const sizeClasses: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-12 w-12",
  md: "h-20 w-20",
  lg: "h-28 w-28",
};

export function Avatar({ src, alt, status, size = "md" }: AvatarProps) {
  return (
    <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full rounded-full border-2 border-border object-cover"
      />
      {status === "online" ? (
        <span
          aria-label="Available for work"
          className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-bg-base bg-accent-green"
        />
      ) : null}
    </div>
  );
}
