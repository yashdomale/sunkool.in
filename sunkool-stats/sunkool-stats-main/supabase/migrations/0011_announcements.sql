-- Announcements: short notices the admin posts under the intro text on the public Updates page.
--
-- They are deliberately separate from blog posts: no foreign key to `posts`, never linked to one.
-- published_at is set by the app when an announcement goes live (and cleared when it is hidden); the
-- site's "New" highlight on the Updates nav item reads the newest published_at.
--
-- Rollback: drop table announcements;

create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  body text not null default '' check (char_length(body) <= 1000),
  published boolean not null default true,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  constraint announcements_published_at_check check (not published or published_at is not null)
);

create index announcements_published_at_idx on announcements (published, published_at desc);

alter table announcements enable row level security;

-- public can read published announcements; admins can read/write everything.
create policy announcements_public_select on announcements for select
  using (published);
create policy announcements_admin_select on announcements for select
  using (is_admin());
create policy announcements_admin_insert on announcements for insert
  with check (is_admin());
create policy announcements_admin_update on announcements for update
  using (is_admin()) with check (is_admin());
create policy announcements_admin_delete on announcements for delete
  using (is_admin());
