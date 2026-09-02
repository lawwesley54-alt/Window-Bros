import { useState, type ImgHTMLAttributes } from "react";

/**
 * Image with a graceful fallback. If the source fails to load (e.g. a
 * stale placeholder URL), it renders a neutral panel with the alt text
 * instead of a broken-image icon, so a bad URL never wrecks the layout.
 */
export function Img({
  src,
  alt,
  className = "",
  loading = "lazy",
  ...rest
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-bg-muted p-4 text-center text-small text-ink-faint ${className}`}
      >
        {alt}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      className={className}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
