GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_current_user_super_admin() TO authenticated, anon;