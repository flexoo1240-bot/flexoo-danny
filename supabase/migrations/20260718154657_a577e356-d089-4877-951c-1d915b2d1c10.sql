
ALTER TABLE public.withdrawal_requests ADD COLUMN IF NOT EXISTS rejection_reason text;

-- Ensure realtime is enabled
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.withdrawal_requests;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- Seed default withdrawal code price
INSERT INTO public.app_settings (key, value)
VALUES ('withdrawal_code_price', '7500')
ON CONFLICT (key) DO NOTHING;

-- Update admin RPC to accept rejection reason
CREATE OR REPLACE FUNCTION public.admin_update_withdrawal(
  withdrawal_id uuid,
  new_status text,
  admin_user_id uuid,
  reason text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE req RECORD; v_code text; v_is_admin boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = admin_user_id AND role::text IN ('admin','super_admin')
  ) INTO v_is_admin;
  IF NOT v_is_admin THEN RAISE EXCEPTION 'Unauthorized: admin role required'; END IF;

  SELECT * INTO req FROM public.withdrawal_requests WHERE id = withdrawal_id;
  IF req IS NULL THEN RAISE EXCEPTION 'Withdrawal request not found'; END IF;
  IF req.status <> 'pending' THEN RAISE EXCEPTION 'Request already processed'; END IF;

  IF new_status = 'approved' THEN
    v_code := public.generate_withdrawal_code();
    UPDATE public.withdrawal_requests
    SET status = 'approved', withdrawal_code = v_code,
        approved_at = now(), reviewed_at = now()
    WHERE id = withdrawal_id;
  ELSIF new_status = 'rejected' THEN
    UPDATE public.withdrawal_requests
    SET status = 'rejected', reviewed_at = now(),
        rejection_reason = NULLIF(trim(coalesce(reason,'')), '')
    WHERE id = withdrawal_id;
    UPDATE public.profiles SET bonus_balance = bonus_balance + req.amount WHERE user_id = req.user_id;
  ELSE
    RAISE EXCEPTION 'Invalid status';
  END IF;
END; $function$;

REVOKE EXECUTE ON FUNCTION public.admin_update_withdrawal(uuid, text, uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.admin_update_withdrawal(uuid, text, uuid, text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.admin_update_withdrawal(uuid, text, uuid, text) TO authenticated;
