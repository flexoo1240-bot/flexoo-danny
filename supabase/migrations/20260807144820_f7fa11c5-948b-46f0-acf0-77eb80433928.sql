-- 1. app_settings: authenticated-only reads
DROP POLICY IF EXISTS "Anyone can read settings" ON public.app_settings;
CREATE POLICY "Authenticated can read settings"
ON public.app_settings FOR SELECT TO authenticated USING (true);
REVOKE SELECT ON public.app_settings FROM anon;

-- 2. payment_accounts: admin-only direct table reads
DROP POLICY IF EXISTS "View active payment accounts" ON public.payment_accounts;
CREATE POLICY "Admins can view payment accounts"
ON public.payment_accounts FOR SELECT TO authenticated
USING (public.is_current_user_admin() OR public.is_current_user_super_admin());
REVOKE SELECT ON public.payment_accounts FROM anon;

CREATE OR REPLACE FUNCTION public.get_active_payment_account()
RETURNS TABLE (
  bank_name text,
  account_name text,
  account_number text,
  payment_method text,
  qr_code text,
  is_default boolean,
  status boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT pa.bank_name, pa.account_name, pa.account_number, pa.payment_method,
         pa.qr_code, pa.is_default, pa.status
  FROM public.payment_accounts pa
  WHERE pa.status = true AND auth.uid() IS NOT NULL
  ORDER BY pa.is_default DESC, pa.created_at DESC
  LIMIT 1;
$$;

-- 3. Lock down function execution: default deny, then re-grant only what the app needs
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon, authenticated;

-- Anonymous: referral code lookup on the signup page only
GRANT EXECUTE ON FUNCTION public.lookup_referrer_id(text) TO anon, authenticated;

-- Signed-in users
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_current_user_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_welcome_bonus() TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_telegram_join() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_active_payment_account() TO authenticated;

-- Admin RPCs (each re-verifies the admin role server-side)
GRANT EXECUTE ON FUNCTION public.admin_create_fpc_code(uuid, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_fpc_code(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_regenerate_fpc_code(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_toggle_fpc_used(uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_reset_telegram_join(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_payment(uuid, numeric, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_payment_status(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_setting(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_user_profile(uuid, numeric, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_withdrawal(uuid, text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_withdrawal(uuid, text, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_withdrawal_account(uuid, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_create_payment_account(text, text, text, text, text, boolean, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_payment_account(uuid, text, text, text, text, text, boolean, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_payment_account(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_default_payment_account(uuid) TO authenticated;

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;