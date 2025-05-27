
-- Function to completely delete a user and all their data
CREATE OR REPLACE FUNCTION public.delete_user_and_data(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
declare
  target_id uuid;
begin
  -- Find the user's UID
  select id into target_id
  from auth.users
  where email = user_email;

  if target_id is null then
    raise notice 'No user found with that email';
    return;
  end if;

  -- Delete from custom app tables
  delete from bios where user_id = target_id;
  delete from user_subscriptions where user_id = target_id;
  delete from cover_letters where user_id = target_id;
  delete from tool_usage where user_id = target_id;
  delete from profiles where id = target_id;

  -- Finally, delete from Supabase Auth
  delete from auth.users where id = target_id;

  raise notice 'User and all associated data removed successfully';
end;
$$;
