-- 1. Lock down EXECUTE on all public functions
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.sig);
  END LOOP;
END $$;

-- Signed-in users: functions that self-authorize internally
GRANT EXECUTE ON FUNCTION public.claim_welcome_bonus() TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_telegram_join() TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_referral(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_current_user_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
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

-- Referral code lookup happens before signup completes
GRANT EXECUTE ON FUNCTION public.lookup_referrer_id(text) TO anon, authenticated;

-- 2. fpc_codes: enforce payment/user linkage and restrict user updates
CREATE OR REPLACE FUNCTION public.validate_fpc_code_link()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_pay_user uuid;
BEGIN
  SELECT user_id INTO v_pay_user FROM public.payments WHERE id = NEW.payment_id;
  IF v_pay_user IS NULL OR v_pay_user <> NEW.user_id THEN
    RAISE EXCEPTION 'FPC code payment does not belong to this user';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.validate_fpc_code_link() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS validate_fpc_code_link_trg ON public.fpc_codes;
CREATE TRIGGER validate_fpc_code_link_trg
BEFORE INSERT OR UPDATE OF user_id, payment_id ON public.fpc_codes
FOR EACH ROW EXECUTE FUNCTION public.validate_fpc_code_link();

DROP POLICY IF EXISTS "Users can mark own fpc codes used" ON public.fpc_codes;
CREATE POLICY "Users can mark own fpc codes used"
ON public.fpc_codes FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.guard_fpc_code_user_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_current_user_admin() OR auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;
  IF NEW.code <> OLD.code
     OR NEW.payment_id <> OLD.payment_id
     OR NEW.user_id <> OLD.user_id
     OR NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'Only the redemption status of your own code may be changed';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.guard_fpc_code_user_update() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS guard_fpc_code_user_update_trg ON public.fpc_codes;
CREATE TRIGGER guard_fpc_code_user_update_trg
BEFORE UPDATE ON public.fpc_codes
FOR EACH ROW EXECUTE FUNCTION public.guard_fpc_code_user_update();

-- 3. Storage: scope QR code reads to active payment accounts only
DROP POLICY IF EXISTS "Authenticated can view payment QR codes" ON storage.objects;
CREATE POLICY "Authenticated can view active payment QR codes"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'receipts'
  AND (storage.foldername(name))[1] = 'qr-codes'
  AND (
    public.is_current_user_admin()
    OR public.is_current_user_super_admin()
    OR EXISTS (
      SELECT 1 FROM public.payment_accounts pa
      WHERE pa.status = true AND pa.qr_code = storage.objects.name
    )
  )
);