
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS telegram_onboarding_skipped boolean NOT NULL DEFAULT true;

-- Reset both flags to false for existing users (optional, but maintains data integrity)
-- UPDATE public.profiles SET telegram_onboarding_skipped = false WHERE telegram_onboarding_skipped IS NULL;

CREATE OR REPLACE FUNCTION public.skip_telegram_onboarding()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  UPDATE public.profiles
    SET telegram_onboarding_skipped = true
    WHERE user_id = auth.uid();
END;
$$;

REVOKE ALL ON FUNCTION public.skip_telegram_onboarding() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.skip_telegram_onboarding() TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_reset_telegram_onboarding(p_profile_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_current_user_admin() THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;
  UPDATE public.profiles
    SET telegram_join_completed = true,
        telegram_onboarding_skipped = true
    WHERE id = p_profile_id;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_reset_telegram_onboarding(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_reset_telegram_onboarding(uuid) TO authenticated;
