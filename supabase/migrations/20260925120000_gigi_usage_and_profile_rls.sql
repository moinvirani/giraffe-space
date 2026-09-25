-- Giraffe Space: lock down user_profiles and count Gigi messages server-side.
-- Idempotent: safe to run more than once.

-- 1. user_profiles ----------------------------------------------------------
-- The old policy "Service role has full access" was `to public using (true)`,
-- i.e. any holder of the anon key (shipped in the app) could read or rewrite
-- every row. The service role bypasses RLS, so it never needed a policy.
alter table public.user_profiles enable row level security;
drop policy if exists "Service role has full access" on public.user_profiles;

drop policy if exists "Users read own profile" on public.user_profiles;
create policy "Users read own profile" on public.user_profiles
  for select to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));

drop policy if exists "Users insert own profile" on public.user_profiles;
create policy "Users insert own profile" on public.user_profiles
  for insert to authenticated
  with check (lower(email) = lower(auth.jwt() ->> 'email'));

drop policy if exists "Users update own profile" on public.user_profiles;
create policy "Users update own profile" on public.user_profiles
  for update to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'))
  with check (lower(email) = lower(auth.jwt() ->> 'email'));

-- 2. Gigi daily usage -------------------------------------------------------
-- Written only by the gigi-chat Edge Function (service role); no policies, so
-- the anon/authenticated roles can neither read nor write it.
create table if not exists public.gigi_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  count integer not null default 0,
  primary key (user_id, day)
);
alter table public.gigi_usage enable row level security;

-- Returns the new count for today, or NULL when the user is already at p_limit.
create or replace function public.gigi_consume_message(p_user_id uuid, p_limit integer)
returns integer
language sql
security definer
set search_path = public
as $$
  insert into public.gigi_usage as u (user_id, day, count)
  values (p_user_id, (now() at time zone 'utc')::date, 1)
  on conflict (user_id, day) do update set count = u.count + 1
    where u.count < p_limit
  returning u.count;
$$;

-- Gives a message back when the OpenAI call fails after it was counted.
create or replace function public.gigi_refund_message(p_user_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.gigi_usage
     set count = greatest(count - 1, 0)
   where user_id = p_user_id
     and day = (now() at time zone 'utc')::date;
$$;

revoke all on function public.gigi_consume_message(uuid, integer) from public, anon, authenticated;
revoke all on function public.gigi_refund_message(uuid) from public, anon, authenticated;
grant execute on function public.gigi_consume_message(uuid, integer) to service_role;
grant execute on function public.gigi_refund_message(uuid) to service_role;
