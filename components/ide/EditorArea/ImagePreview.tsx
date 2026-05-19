"use client";

type Props = {
  src: string;
  alt: string;
};

export function ImagePreview({ src, alt }: Props) {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-auto bg-bg-base p-6">
      <div className="max-w-full rounded-md border border-border-subtle bg-black/30 p-3 shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="block h-auto max-h-[70vh] w-auto max-w-full rounded-sm"
        />
      </div>
    </div>
  );
}
