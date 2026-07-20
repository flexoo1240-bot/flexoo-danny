
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS telegram_join_completed boolean NOT NULL DEFAULT false;

INSERT INTO public.app_settings (key, value) VALUES
  ('telegram_channel_url', 'https://t.me/+Mg7JaPJoFNVhMTc0'),
  ('telegram_join_required', 'true'),
  ('telegram_countdown_seconds', '15')
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.complete_telegram_join()
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
    SET telegram_join_completed = true
    WHERE user_id = auth.uid();
END;
$$;

REVOKE ALL ON FUNCTION public.complete_telegram_join() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.complete_telegram_join() TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_reset_telegram_join(p_profile_id uuid)
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
    SET telegram_join_completed = false
    WHERE id = p_profile_id;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_reset_telegram_join(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_reset_telegram_join(uuid) TO authenticated;
