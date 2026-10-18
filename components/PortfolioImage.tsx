"use client";

import Image, { type ImageProps } from "next/image";
import { useState, type Ref } from "react";

function canOptimize(src: ImageProps["src"]) {
  if (typeof src !== "string") return true;
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const url = new URL(src);
    const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    return Boolean(bucket && url.protocol === "https:" &&
      url.hostname === "firebasestorage.googleapis.com" &&
      url.pathname.startsWith(`/v0/b/${bucket}/o/`));
  } catch {
    return false;
  }
}

// Keep arbitrary CMS URLs working, but resize local files and our Storage images.
export function PortfolioImage({ src, onError, ...props }: ImageProps & { ref?: Ref<HTMLImageElement> }) {
  const [failedSrc, setFailedSrc] = useState<ImageProps["src"] | null>(null);
  return <Image {...props} src={src} unoptimized={!canOptimize(src) || failedSrc === src}
    onError={(event) => { setFailedSrc(src); onError?.(event); }} />;
}
