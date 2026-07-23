import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface TelegramGateState {
  loading: boolean;
  required: boolean;
  completed: boolean;
  channelUrl: string;
  refresh: () => void;
}

const DEFAULT_URL = "https://t.me/+Mg7JaPJoFNVhMTc0";

export const useTelegramGate = (): TelegramGateState => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [required, setRequired] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [channelUrl, setChannelUrl] = useState(DEFAULT_URL);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      setCompleted(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [{ data: settings }, { data: profile }] = await Promise.all([
        supabase
          .from("app_settings")
          .select("key, value")
          .in("key", ["telegram_channel_url", "telegram_join_required"]),
        supabase
          .from("profiles")
          .select("telegram_join_completed, telegram_onboarding_skipped")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);
      if (cancelled) return;
      const map: Record<string, string> = {};
      (settings || []).forEach((r: any) => (map[r.key] = r.value ?? ""));
      setChannelUrl(map.telegram_channel_url || DEFAULT_URL);
      setRequired((map.telegram_join_required ?? "true").toLowerCase() !== "false");
      
      // Onboarding is complete if user either:
      // 1. Joined the channel (telegram_join_completed = true), OR
      // 2. Skipped the onboarding (telegram_onboarding_skipped = true)
      const isCompleted = 
        Boolean((profile as any)?.telegram_join_completed) || 
        Boolean((profile as any)?.telegram_onboarding_skipped);
      
      setCompleted(isCompleted);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, nonce]);

  return {
    loading,
    required,
    completed,
    channelUrl,
    refresh: () => setNonce((n) => n + 1),
  };
};
