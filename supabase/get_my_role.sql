-- Run this once in the Supabase SQL Editor.
-- It reads the role for the currently authenticated user without exposing
-- other users' profile rows to the mobile client.

create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(role::text, 'user')
  from public.profiles
  where id = auth.uid()
  limit 1;
$$;

grant execute on function public.get_my_role() to authenticated;
