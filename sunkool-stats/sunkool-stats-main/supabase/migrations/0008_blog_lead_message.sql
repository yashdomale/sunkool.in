-- Optional free-text message on the blog enquiry form.
--
--   * blog_leads.message: nullable, at most 1000 characters (the form allows 500; this is a backstop).
--   * submit_blog_lead() gains a trailing, optional p_message. The old 8-argument version is dropped
--     first: two overloads that both accept an 8-key call would make PostgREST refuse every call as
--     ambiguous.
--
-- Safe to run while the site is live: the app only sends p_message when a visitor typed one, and a
-- deployment that runs before this migration falls back to the old call, so no enquiry is lost.
-- Run the whole file in one go (Supabase SQL editor).

alter table blog_leads add column message text;
alter table blog_leads add constraint blog_leads_message_length
  check (message is null or char_length(message) between 1 and 1000);

drop function submit_blog_lead(uuid, text, text, text, text, text, text, uuid);

create function submit_blog_lead(
  p_post_id uuid,
  p_name text,
  p_mobile text,
  p_city text,
  p_product_id text,
  p_product_name text,
  p_product_category text default null,
  p_submission_key uuid default null,
  p_message text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := regexp_replace(btrim(coalesce(p_name, '')), '\s+', ' ', 'g');
  v_city text := regexp_replace(btrim(coalesce(p_city, '')), '\s+', ' ', 'g');
  v_mobile text := btrim(coalesce(p_mobile, ''));
  v_product_id text := btrim(coalesce(p_product_id, ''));
  v_product_name text := btrim(coalesce(p_product_name, ''));
  v_category text := nullif(btrim(coalesce(p_product_category, '')), '');
  -- Keeps line breaks, drops every other control character, trims, and treats "nothing" as no message.
  v_message text := nullif(btrim(regexp_replace(coalesce(p_message, ''), '[\x00-\x09\x0B-\x1F\x7F]', '', 'g')), '');
  v_key uuid := coalesce(p_submission_key, gen_random_uuid());
  v_slug text;
  v_title text;
  v_inserted uuid;
begin
  if char_length(v_name) not between 2 and 80 or v_name ~ '[[:cntrl:]]' then
    raise exception 'invalid_lead:name';
  end if;
  if char_length(v_city) not between 2 and 60 or v_city ~ '[[:cntrl:]]' then
    raise exception 'invalid_lead:city';
  end if;
  if v_mobile !~ '^\+[1-9][0-9]{7,14}$'
     or (v_mobile ~ '^\+91' and v_mobile !~ '^\+91[6-9][0-9]{9}$') then
    raise exception 'invalid_lead:mobile';
  end if;
  if char_length(v_product_id) not between 1 and 80
     or char_length(v_product_name) not between 1 and 120
     or char_length(coalesce(v_category, '')) > 120 then
    raise exception 'invalid_lead:product';
  end if;
  if char_length(coalesce(v_message, '')) > 1000 then
    raise exception 'invalid_lead:message';
  end if;

  select title, slug into v_title, v_slug
  from posts
  where id = p_post_id and status = 'published';
  if not found then
    raise exception 'post_not_found';
  end if;

  -- Same submission replayed (double click, retry): nothing more to do.
  if exists (select 1 from blog_leads where submission_key = v_key) then
    return false;
  end if;

  -- Same person re-submitting the same enquiry from the same article shortly
  -- after (e.g. refreshed the page and filled it in again).
  if exists (
    select 1 from blog_leads
    where mobile = v_mobile
      and blog_post_id = p_post_id
      and product_id = v_product_id
      and created_at > now() - interval '10 minutes'
  ) then
    return false;
  end if;

  -- One number cannot flood the inbox.
  if (
    select count(*) from blog_leads
    where mobile = v_mobile and created_at > now() - interval '1 hour'
  ) >= 5 then
    raise exception 'lead_rate_limited' using errcode = 'PT429';
  end if;

  insert into blog_leads (
    submission_key, name, mobile, city, product_id, product_name, product_category,
    blog_post_id, blog_slug, blog_title, blog_url, message
  )
  values (
    v_key, v_name, v_mobile, v_city, v_product_id, v_product_name, v_category,
    p_post_id, v_slug, v_title, 'https://www.sunkool.in/blog/' || v_slug, v_message
  )
  on conflict (submission_key) do nothing
  returning id into v_inserted;

  return v_inserted is not null;
end;
$$;

revoke all on function submit_blog_lead(uuid, text, text, text, text, text, text, uuid, text) from public;
grant execute on function submit_blog_lead(uuid, text, text, text, text, text, text, uuid, text)
  to anon, authenticated;

-- Admins already have SELECT on the whole table (0007), so the new column needs no extra grant.
