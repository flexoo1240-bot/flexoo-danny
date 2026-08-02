import { useEffect, useState } from "react";
import { getSignedStorageUrl } from "@/lib/storageUrl";

interface SignedImageProps {
  value: string | null | undefined;
  alt: string;
  className?: string;
}

/**
 * Renders an image stored in the private `receipts` bucket by resolving a
 * short-lived signed URL. Falls back to nothing when access is denied.
 */
const SignedImage = ({ value, alt, className }: SignedImageProps) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setUrl(null);
    getSignedStorageUrl(value).then((u) => {
      if (!cancelled) setUrl(u);
    });
    return () => {
      cancelled = true;
    };
  }, [value]);

  if (!url) {
    return <div className={`${className ?? ""} bg-secondary animate-pulse`} aria-label={alt} />;
  }

  return <img src={url} alt={alt} className={className} />;
};

export default SignedImage;
