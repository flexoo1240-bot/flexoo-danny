
CREATE TABLE IF NOT EXISTS public.welcome_bonus_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT welcome_bonus_claims_user_id_key UNIQUE (user_id)
);

GRANT SELECT ON public.welcome_bonus_claims TO authenticated;
GRANT ALL ON public.welcome_bonus_claims TO service_role;

ALTER TABLE public.welcome_bonus_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own welcome bonus claim"
  ON public.welcome_bonus_claims FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_current_user_admin());

INSERT INTO public.app_settings (key, value) VALUES ('welcome_bonus_amount', '170000')
  ON CONFLICT (key) DO NOTHING;
INSERT INTO public.app_settings (key, value) VALUES ('welcome_bonus_enabled', 'true')
  ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.claim_welcome_bonus()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_enabled text;
  v_amount numeric;
  v_profile public.profiles%ROWTYPE;
  v_existing public.welcome_bonus_claims%ROWTYPE;
  v_meta jsonb;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('status', 'unauthenticated', 'message', 'You must be signed in to claim your bonus.');
  END IF;

  SELECT value INTO v_enabled FROM public.app_settings WHERE key = 'welcome_bonus_enabled';
  IF COALESCE(v_enabled, 'true') <> 'true' THEN
    RETURN jsonb_build_object('status', 'disabled', 'message', 'The welcome bonus is currently unavailable.');
  END IF;

  SELECT COALESCE(NULLIF(value, '')::numeric, 170000) INTO v_amount
  FROM public.app_settings WHERE key = 'welcome_bonus_amount';
  v_amount := COALESCE(v_amount, 170000);

  -- Ensure a profile exists (auth.users trigger is not available on this project).
  SELECT * INTO v_profile FROM public.profiles WHERE user_id = v_uid;
  IF NOT FOUND THEN
    SELECT raw_user_meta_data INTO v_meta FROM auth.users WHERE id = v_uid;
    INSERT INTO public.profiles (user_id, full_name, username, phone, referral_code, bonus_balance)
    VALUES (
      v_uid,
      COALESCE(v_meta->>'full_name', ''),
      COALESCE(v_meta->>'username', ''),
      COALESCE(v_meta->>'phone', ''),
      public.generate_referral_code(),
      0
    )
    RETURNING * INTO v_profile;
  END IF;

  -- Atomic, idempotent claim: unique constraint guarantees one claim per user.
  INSERT INTO public.welcome_bonus_claims (user_id, amount)
  VALUES (v_uid, v_amount)
  ON CONFLICT (user_id) DO NOTHING;

  IF NOT FOUND THEN
    SELECT * INTO v_existing FROM public.welcome_bonus_claims WHERE user_id = v_uid;
    SELECT * INTO v_profile FROM public.profiles WHERE user_id = v_uid;
    RETURN jsonb_build_object(
      'status', 'already_claimed',
      'message', 'Your welcome bonus has already been credited.',
      'amount', v_existing.amount,
      'balance', v_profile.bonus_balance
    );
  END IF;

  UPDATE public.profiles
  SET bonus_balance = bonus_balance + v_amount, updated_at = now()
  WHERE user_id = v_uid
  RETURNING * INTO v_profile;

  INSERT INTO public.transactions (user_id, type, amount, description, metadata)
  VALUES (v_uid, 'bonus', v_amount, 'Welcome bonus', jsonb_build_object('source', 'welcome_bonus'));

  RETURN jsonb_build_object(
    'status', 'credited',
    'message', 'Welcome bonus credited.',
    'amount', v_amount,
    'balance', v_profile.bonus_balance
  );
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'claim_welcome_bonus failed for user %: % (%)', v_uid, SQLERRM, SQLSTATE;
  RETURN jsonb_build_object('status', 'error', 'message', 'Could not credit your bonus right now. Please try again.', 'code', SQLSTATE);
END;
$$;

REVOKE ALL ON FUNCTION public.claim_welcome_bonus() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_welcome_bonus() TO authenticated;
