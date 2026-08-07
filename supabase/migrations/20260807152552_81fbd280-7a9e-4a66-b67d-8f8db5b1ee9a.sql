DROP FUNCTION IF EXISTS public.admin_update_withdrawal(uuid, text, uuid);

CREATE OR REPLACE FUNCTION public.admin_generate_fpc_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.is_current_user_admin() THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;
  RETURN public.generate_fpc_code();
END;
$$;

REVOKE ALL ON FUNCTION public.admin_generate_fpc_code() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_generate_fpc_code() TO authenticated;