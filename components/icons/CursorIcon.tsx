import Image from "next/image";

export function CursorIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/cursor-logo.svg"
      alt=""
      width={16}
      height={16}
      aria-hidden
      className={className}
    />
  );
}
