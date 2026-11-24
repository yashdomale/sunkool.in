-- Access control for blog_leads.
--
--   * Public visitors can create a lead ONLY through submit_blog_lead(). They
--     have no table privileges, so they can neither read nor write the table.
--   * Admins (the `admins` allowlist, via is_admin()) can read every lead and
--     change its status — nothing else. No service-role key is involved.

alter table blog_leads enable row level security;

-- Supabase's default privileges give every new table to anon/authenticated.
-- Take everything back, then grant only what the admin dashboard needs.
revoke all on table blog_leads from public, anon, authenticated;
grant select on table blog_leads to authenticated;
grant update (status) on table blog_leads to authenticated;

create policy blog_leads_admin_select on blog_leads for select to authenticated
  using (is_admin());
create policy blog_leads_admin_update on blog_leads for update to authenticated
  using (is_admin()) with check (is_admin());
-- Deliberately no insert/delete policy: leads are created by the function below
-- and are never deleted from the app.

-- ---------------------------------------------------------------------------
-- Public submission
-- ---------------------------------------------------------------------------
-- SECURITY DEFINER so anonymous visitors can insert without table privileges.
-- The post's title/slug/url are looked up here from the (published) post, never
-- taken from the caller, so attribution cannot be forged. Returns true when a
-- new lead was stored and false when it was an already-stored duplicate; it
-- never returns row data, so it cannot be used to read leads.
--
-- Errors: 'invalid_lead:<field>' (400), 'post_not_found' (400),
-- 'lead_rate_limited' (HTTP 429 through PostgREST's PT429 convention).
create function submit_blog_lead(
  p_post_id uuid,
  p_name text,
  p_mobile text,
  p_city text,
  p_product_id text,
  p_product_name text,
  p_product_category text default null,
  p_submission_key uuid default null
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
    blog_post_id, blog_slug, blog_title, blog_url
  )
  values (
    v_key, v_name, v_mobile, v_city, v_product_id, v_product_name, v_category,
    p_post_id, v_slug, v_title, 'https://www.sunkool.in/blog/' || v_slug
  )
  on conflict (submission_key) do nothing
  returning id into v_inserted;

  return v_inserted is not null;
end;
$$;

revoke all on function submit_blog_lead(uuid, text, text, text, text, text, text, uuid) from public;
grant execute on function submit_blog_lead(uuid, text, text, text, text, text, text, uuid)
  to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Admin dashboard aggregates
-- ---------------------------------------------------------------------------
-- SECURITY INVOKER (the default): they run with the caller's privileges, so RLS
-- applies and a non-admin simply gets empty results. Not callable by anon.

create function blog_lead_stats()
returns table (lead_status blog_lead_status, lead_count bigint)
language sql
stable
set search_path = public
as $$
  select status, count(*) from blog_leads group by status;
$$;

-- Distinct values for the dashboard's city / product / source-blog filters.
create function blog_lead_filter_options()
returns jsonb
language sql
stable
set search_path = public
as $$
  select jsonb_build_object(
    'cities', coalesce((
      select jsonb_agg(jsonb_build_object('value', city_key, 'label', label) order by city_key)
      from (
        select city_key, (array_agg(city order by created_at desc))[1] as label
        from blog_leads
        group by city_key
      ) c
    ), '[]'::jsonb),
    'products', coalesce((
      select jsonb_agg(
        jsonb_build_object('value', product_id, 'label', label, 'category', category)
        order by label
      )
      from (
        select product_id,
               (array_agg(product_name order by created_at desc))[1] as label,
               (array_agg(product_category order by created_at desc))[1] as category
        from blog_leads
        group by product_id
      ) p
    ), '[]'::jsonb),
    'blogs', coalesce((
      select jsonb_agg(jsonb_build_object('value', blog_post_id, 'label', label) order by label)
      from (
        select blog_post_id, (array_agg(blog_title order by created_at desc))[1] as label
        from blog_leads
        where blog_post_id is not null
        group by blog_post_id
      ) b
    ), '[]'::jsonb)
  );
$$;

revoke all on function blog_lead_stats() from public, anon;
revoke all on function blog_lead_filter_options() from public, anon;
grant execute on function blog_lead_stats() to authenticated;
grant execute on function blog_lead_filter_options() to authenticated;
