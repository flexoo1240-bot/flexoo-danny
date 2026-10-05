-- Flexoo withdrawal activation workflow
-- Adds a server-verified admin RPC for the new activation_required status.
-- The activation URL itself is stored in the existing app_settings table under
-- the key withdrawal_activation_url, so no new public table is required.

create or replace function public.admin_set_withdrawal_activation_required(
  p_withdrawal_id uuid,
  p_reason text default 'Account activation is required before this withdrawal can be processed.'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.has_role(auth.uid(), 'admin'::public.app_role)
     and not public.has_role(auth.uid(), 'super_admin'::public.app_role) then
    raise exception 'Not authorized';
  end if;

  update public.withdrawal_requests
  set status = 'activation_required',
      rejection_reason = null,
      reviewed_at = now()
  where id = p_withdrawal_id;

  if not found then
    raise exception 'Withdrawal request not found';
  end if;
end;
$$;

grant execute on function public.admin_set_withdrawal_activation_required(uuid, text) to authenticated;
