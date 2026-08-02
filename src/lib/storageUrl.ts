import { supabase } from "@/integrations/supabase/client";

const BUCKET = "receipts";

/**
 * The `receipts` bucket is private: files are only reachable through
 * short-lived signed URLs gated by the storage RLS policies.
 * Accepts either a raw storage path or a legacy public URL and returns
 * a signed URL (or null when it cannot be resolved).
 */
export const toStoragePath = (value: string): string => {
  const marker = `/object/public/${BUCKET}/`;
  const idx = value.indexOf(marker);
  if (idx !== -1) return decodeURIComponent(value.slice(idx + marker.length));
  const signedMarker = `/object/sign/${BUCKET}/`;
  const sIdx = value.indexOf(signedMarker);
  if (sIdx !== -1) {
    return decodeURIComponent(value.slice(sIdx + signedMarker.length).split("?")[0]);
  }
  return value.replace(/^\/+/, "");
};

export const getSignedStorageUrl = async (
  value: string | null | undefined,
  expiresIn = 3600
): Promise<string | null> => {
  if (!value) return null;
  const path = toStoragePath(value);
  if (!path) return null;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresIn);
  if (error) return null;
  return data?.signedUrl ?? null;
};
