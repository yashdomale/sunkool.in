-- SECURITY DEFINER so this can be called from policies on `admins` itself
-- without recursively re-evaluating RLS on that same table.
create function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from admins where id = auth.uid());
$$;

alter table categories enable row level security;
alter table authors enable row level security;
alter table admins enable row level security;
alter table posts enable row level security;

-- categories: public read, admin write
create policy categories_public_select on categories for select using (true);
create policy categories_admin_write on categories for all
  using (is_admin()) with check (is_admin());

-- authors: public read (bylines are shown on public posts), admin write
create policy authors_public_select on authors for select using (true);
create policy authors_admin_write on authors for all
  using (is_admin()) with check (is_admin());

-- admins: only admins can see the allowlist; membership changes happen via
-- the Supabase dashboard / service role, not through the app.
create policy admins_admin_select on admins for select using (is_admin());

-- posts: public can read published posts; admins can read/write everything.
create policy posts_public_select on posts for select
  using (status = 'published');
create policy posts_admin_select on posts for select
  using (is_admin());
create policy posts_admin_write on posts for insert
  with check (is_admin());
create policy posts_admin_update on posts for update
  using (is_admin()) with check (is_admin());
create policy posts_admin_delete on posts for delete
  using (is_admin());
