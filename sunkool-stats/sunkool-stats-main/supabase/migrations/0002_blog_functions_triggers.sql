-- Keeps posts.updated_at current on every row change.
create function set_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger posts_set_updated_at
  before update on posts
  for each row
  execute function set_posts_updated_at();

-- Stamps published_at the first time a post transitions into 'published'.
-- Does not overwrite it on later edits, and clears it if reverted to draft.
create function set_posts_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'published' and (old.status is distinct from 'published') and new.published_at is null then
    new.published_at := now();
  elsif new.status = 'draft' then
    new.published_at := null;
  end if;
  return new;
end;
$$;

create trigger posts_set_published_at
  before insert or update on posts
  for each row
  execute function set_posts_published_at();

-- SECURITY DEFINER so anonymous readers can increment a view count without
-- needing direct UPDATE privileges on posts (which RLS reserves for admins).
create function increment_post_views(post_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update posts set views = views + 1 where id = post_id and status = 'published';
$$;

revoke all on function increment_post_views(uuid) from public;
grant execute on function increment_post_views(uuid) to anon, authenticated;
