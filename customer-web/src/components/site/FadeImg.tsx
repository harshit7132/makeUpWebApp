"use client";

import React, { useEffect, useRef, useState } from "react";
import { DEFAULT_SITE_IMAGES } from "../../lib/site-images";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  /** Fallback image URL shown in the else condition if src fails or is not found */
  fallbackSrc?: string;
  /** CSS sizes hint for the responsive srcset (Unsplash URLs only) */
  sizes?: string;
};

const WIDTHS = [480, 800, 1200, 1600];

/** Builds a width-based srcset for Unsplash URLs (they resize on the fly). */
function unsplashSrcSet(src: string): string | undefined {
  if (!src || !src.includes("images.unsplash.com")) return undefined;
  return WIDTHS.map((w) => `${src.replace(/([?&])w=\d+/, `$1w=${w}`)} ${w}w`).join(", ");
}

/** Plain <img> that fades in once decoded, with an else condition fallback when image is missing or broken. */
export default function FadeImg({
  src,
  alt,
  fallbackSrc = DEFAULT_SITE_IMAGES.hero,
  className = "",
  sizes = "100vw",
  loading = "lazy",
  draggable = false,
  ...rest
}: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const effectiveFallback = fallbackSrc || DEFAULT_SITE_IMAGES.hero;
  const initialSrc = src && src.trim() ? src.trim() : effectiveFallback;

  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const next = src && src.trim() ? src.trim() : effectiveFallback;
    setCurrentSrc(next);
    setLoaded(false);
  }, [src, effectiveFallback]);

  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true);
  }, [currentSrc]);

  const handleError = () => {
    // Else condition: If the custom image fails to load or is not found, show default image
    if (currentSrc !== effectiveFallback) {
      setCurrentSrc(effectiveFallback);
      setLoaded(true);
    }
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={currentSrc}
      srcSet={unsplashSrcSet(currentSrc)}
      sizes={sizes}
      alt={alt}
      loading={loading}
      draggable={draggable}
      onDragStart={(e) => e.preventDefault()}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={handleError}
      className={`img-fade select-none pointer-events-none ${loaded ? "is-loaded" : ""} ${className}`}
      style={{ WebkitUserDrag: "none", userSelect: "none", ...((rest as any).style || {}) }}
      {...rest}
    />
  );
}
