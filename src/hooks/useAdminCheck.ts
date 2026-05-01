import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

/**
 * Server-verified admin check.
 * Calls the SECURITY DEFINER RPC `is_current_user_admin` which uses
 * `auth.uid()` server-side, so the result cannot be spoofed by the client.
 * The result is for UI gating only — every admin mutation must ALSO
 * be performed via an admin RPC that re-verifies the role server-side.
 */
export const useAdminCheck = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.rpc("is_current_user_admin");
      if (cancelled) return;
      setIsAdmin(!error && data === true);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return { isAdmin, loading };
};
