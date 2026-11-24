-- [0010 v6] Chatbot leads: enquiries captured by the SUNKOOL Assistant chatbot are stored in the same
-- blog_leads table as the blog-post form enquiries, so the team works them from one inbox
-- (Admin > Blog Data, /admin/blog-data). A new `lead_source` column tells them apart: 'blog' or
-- 'chatbot'.
--
-- The live project's blog_leads already has an older `source` column (no migration here creates it)
-- and a constraint built on it:
--     blog_leads_blog_required = CHECK (source <> 'blog' OR (city, blog_slug, blog_title and blog_url
--                                                            are all NOT NULL))
-- This script leaves both exactly as they are: the existing constraint is never dropped, replaced or
-- weakened (STEP 9 proves its definition is unchanged). It adds a second rule of the same shape for
-- the new column, named blog_leads_lead_source_blog_required, so a blog enquiry is checked by both.
-- Chatbot enquiries are exempt from both: they carry source = 'chatbot' (the new function keeps
-- filling it in, as the earlier chatbot did) and lead_source = 'chatbot'.
--
-- Depends on 0006 and 0007. Independent of 0008 (the Message box) - a chatbot lead has no message.
-- Safe to run more than once, and additive: nothing is deleted from blog_leads and no existing
-- constraint, policy or grant is dropped or weakened. Run it in one go (Supabase SQL editor); if any
-- statement fails, the whole script is rolled back. Apply it BEFORE deploying the chatbot: its
-- call-back form files leads through submit_chatbot_lead() below. Until it runs, Admin > Blog Data
-- lists every enquiry as before and shows no source dropdown.
--
-- What this script assumes about the live table (STEP 0 checks the columns and stops if one is
-- missing): blog_leads has id, submission_key, name, mobile, city, product_id, product_name,
-- blog_slug, blog_title, blog_url, status and created_at. Everything else is optional: the
-- `source` column and its constraint may or may not exist, and city / blog_slug / blog_title /
-- blog_url may already allow NULL.
--
-- Steps: 0 preflight | 1 add lead_source | 2 file old chatbot rows | 3 lead_source check |
--        4 allow empty city/blog | 5 check no blog row is incomplete | 6 lead_source blog rule |
--        7 index | 8 submit_chatbot_lead() | 9 verify the finished state.
-- Every message this script prints starts with [0010 v6].

-- STEP 0 --------------------------------------------------------------------------------------
do $$
declare
  missing text;
begin
  if to_regclass('public.blog_leads') is null then
    raise exception '[0010 v6] step 0: table public.blog_leads does not exist (run 0006 and 0007 first)';
  end if;
  select string_agg(c, ', ') into missing
  from unnest(array['id', 'submission_key', 'name', 'mobile', 'city', 'product_id', 'product_name',
                    'blog_slug', 'blog_title', 'blog_url', 'status', 'created_at']) c
  where not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'blog_leads' and column_name = c
  );
  if missing is not null then
    raise exception '[0010 v6] step 0: blog_leads is missing column(s): %. Nothing was changed.', missing;
  end if;
  -- Every constraint on the table, with its exact definition, so STEP 9 can prove that none was
  -- changed or removed. (Newer Postgres also lists NOT NULL as a constraint, contype 'n'; STEP 4
  -- drops four of those on purpose, so they are left out.)
  perform set_config(
    'sunkool.constraints_before',
    coalesce((select string_agg(conname || ' = ' || pg_get_constraintdef(oid), E'\n' order by conname)
              from pg_constraint
              where conrelid = 'public.blog_leads'::regclass and contype <> 'n'), ''),
    true
  );
end
$$;

-- STEP 1 --------------------------------------------------------------------------------------
-- Adding the column with a default writes no row: every existing enquiry starts as 'blog'.
alter table blog_leads add column if not exists lead_source text not null default 'blog';

-- STEP 2 --------------------------------------------------------------------------------------
-- Existing rows that were NOT sent from the blog form. The blog form always saves a city and the
-- post it came from, so a row without them can only have come from an earlier version of the
-- chatbot (the live table already allowed empty values there); and a row whose older `source` column
-- says 'chatbot' is a chatbot enquiry by definition. File those as chatbot leads BEFORE the rule in
-- STEP 6 is added; otherwise that rule rejects them.
-- This is the only statement that writes to existing rows. It changes nothing but their lead_source
-- (and, through the table's own trigger, their updated_at). Every other value, and every other row,
-- is left as it is.
do $$
declare
  moved bigint;
  has_source boolean;
begin
  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'blog_leads' and column_name = 'source'
  ) into has_source;
  -- Dynamic SQL, because `source` does not exist on a project that never had it. (source::text so it
  -- works whether the column is text or an enum.)
  execute 'update blog_leads set lead_source = ''chatbot''
           where lead_source = ''blog''
             and (city is null or blog_slug is null or blog_title is null or blog_url is null'
          || case when has_source then ' or source::text = ''chatbot''' else '' end
          || ')';
  get diagnostics moved = row_count;
  perform set_config('sunkool.relabelled', moved::text, true);
  raise notice '[0010 v6] step 2: % existing enquiry(ies) filed as chatbot leads', moved;
end
$$;

-- STEP 3 --------------------------------------------------------------------------------------
-- (lead_source is a brand-new column, so no constraint of this name can have existed before.)
alter table blog_leads drop constraint if exists blog_leads_lead_source_check;
alter table blog_leads add constraint blog_leads_lead_source_check check (lead_source in ('blog', 'chatbot'));

-- STEP 4 --------------------------------------------------------------------------------------
-- A chatbot visitor is never asked for a city and has not read a post, so these can be empty.
-- (No-ops where the live table already allows it, as production does.) Their length checks (0006,
-- blog_leads_blog_length and friends) already pass for NULL and are not touched.
alter table blog_leads alter column city drop not null;
alter table blog_leads alter column blog_slug drop not null;
alter table blog_leads alter column blog_title drop not null;
alter table blog_leads alter column blog_url drop not null;

-- STEP 5 --------------------------------------------------------------------------------------
-- No 'blog' row may be incomplete before the rule in STEP 6 is added. STEP 2 makes sure of that. If
-- it ever is not so, stop here with a message that names the rows and what on the table could have
-- blocked STEP 2. Everything is rolled back.
do $$
declare
  bad bigint;
  bad_ids text;
  tbl text;
  who text;
  trg text;
  rl text;
  kids text;
  cons text;
begin
  select count(*) into bad from blog_leads
    where lead_source = 'blog' and (city is null or blog_slug is null or blog_title is null or blog_url is null);
  if bad > 0 then
    select string_agg(id::text, ', ') into bad_ids from (
      select id from blog_leads
      where lead_source = 'blog' and (city is null or blog_slug is null or blog_title is null or blog_url is null)
      order by created_at limit 10
    ) s;
    select relkind::text || ', row security ' || relrowsecurity::text || ', forced ' || relforcerowsecurity::text
      into tbl from pg_class where oid = 'public.blog_leads'::regclass;
    select 'role ' || current_user || ', bypassrls ' || rolbypassrls::text || ', superuser ' || rolsuper::text
      into who from pg_roles where rolname = current_user;
    select string_agg(tgname || case when tgenabled = 'D' then ' (disabled)' else '' end, ', ')
      into trg from pg_trigger where tgrelid = 'public.blog_leads'::regclass and not tgisinternal;
    select string_agg(rulename, ', ') into rl from pg_rules where schemaname = 'public' and tablename = 'blog_leads';
    select string_agg(c.relname, ', ') into kids
      from pg_inherits i join pg_class c on c.oid = i.inhrelid where i.inhparent = 'public.blog_leads'::regclass;
    select string_agg(conname || ' = ' || pg_get_constraintdef(oid), ' ; ') into cons
      from pg_constraint where conrelid = 'public.blog_leads'::regclass;
    raise exception '[0010 v6] step 5: % row(s) still have lead_source = blog but an empty city/blog field, so blog_leads_lead_source_blog_required cannot be added (ids: %). Step 2 reported % row(s) filed as chatbot. table: %; %; triggers: %; rules: %; child tables: %; constraints: %',
      bad, coalesce(bad_ids, 'none'), coalesce(current_setting('sunkool.relabelled', true), '?'),
      tbl, who, coalesce(trg, 'none'), coalesce(rl, 'none'), coalesce(kids, 'none'), coalesce(cons, 'none')
      using errcode = 'check_violation';
  end if;
end
$$;

-- STEP 6 --------------------------------------------------------------------------------------
-- Keeps BLOG enquiries exactly as strict as before, for the new column: a row whose lead_source is
-- 'blog' must carry its city and the post it came from. Chatbot rows are exempt; that is what
-- lead_source is for. The existing blog_leads_blog_required (built on `source`) is NOT touched.
-- If a constraint with THIS script's name already exists with some other definition, it is not
-- replaced: the script stops and shows it. One with this exact definition is simply re-created.
do $$
declare
  existing text;
  ours text;
begin
  select pg_get_constraintdef(oid) into existing from pg_constraint
  where conrelid = 'public.blog_leads'::regclass and conname = 'blog_leads_blog_required';
  if existing is not null then
    raise notice '[0010 v6] step 6: the existing blog_leads_blog_required is left exactly as it is: %', existing;
  end if;

  select pg_get_constraintdef(oid) into ours from pg_constraint
  where conrelid = 'public.blog_leads'::regclass and conname = 'blog_leads_lead_source_blog_required';
  if ours is not null
     and not (ours ~ 'lead_source' and ours ~ 'city IS NOT NULL' and ours ~ 'blog_slug IS NOT NULL'
              and ours ~ 'blog_title IS NOT NULL' and ours ~ 'blog_url IS NOT NULL') then
    raise exception '[0010 v6] step 6: constraint blog_leads_lead_source_blog_required already exists with a different definition and was left untouched: %. Nothing was changed.', ours;
  end if;
end
$$;

alter table blog_leads drop constraint if exists blog_leads_lead_source_blog_required;
alter table blog_leads add constraint blog_leads_lead_source_blog_required check (
  lead_source <> 'blog'
  or (city is not null and blog_slug is not null and blog_title is not null and blog_url is not null)
);

-- STEP 7 --------------------------------------------------------------------------------------
-- The dashboard's source dropdown lists one source at a time, newest first.
create index if not exists blog_leads_lead_source_created_at_idx on blog_leads (lead_source, created_at desc);

-- STEP 8 --------------------------------------------------------------------------------------
-- Public submission from the chatbot.
-- Same shape as submit_blog_lead() (0007): SECURITY DEFINER, so the caller needs no table
-- privileges; it validates everything itself, de-duplicates, rate-limits, and returns only
-- true (stored) / false (already stored) - never row data. Callable by anon/authenticated only, as
-- before; nothing is granted to PUBLIC.
--
-- p_submission_key makes a retried delivery of the same chat a no-op: the app derives it from the
-- chat's conversation id.
--
-- Errors: 'invalid_lead:<field>' (name | mobile | product), 'lead_rate_limited' (PT429).

-- Replace whatever version of this function is already live, whatever its signature: an older
-- overload left next to the new one would leave PostgREST unable to choose between them, and it
-- would refuse every call as ambiguous.
do $$
declare
  fn regprocedure;
begin
  for fn in
    select p.oid::regprocedure
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'submit_chatbot_lead'
  loop
    execute format('drop function %s', fn);
  end loop;
end
$$;

create function submit_chatbot_lead(
  p_name text,
  p_mobile text,
  p_product_id text,
  p_product_name text,
  p_submission_key uuid default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := regexp_replace(btrim(coalesce(p_name, '')), '\s+', ' ', 'g');
  v_mobile text := btrim(coalesce(p_mobile, ''));
  v_product_id text := btrim(coalesce(p_product_id, ''));
  v_product_name text := regexp_replace(btrim(coalesce(p_product_name, '')), '\s+', ' ', 'g');
  v_key uuid := coalesce(p_submission_key, gen_random_uuid());
  v_inserted uuid;
begin
  if char_length(v_name) not between 2 and 80 or v_name ~ '[[:cntrl:]]' then
    raise exception 'invalid_lead:name';
  end if;
  if v_mobile !~ '^\+[1-9][0-9]{7,14}$'
     or (v_mobile ~ '^\+91' and v_mobile !~ '^\+91[6-9][0-9]{9}$') then
    raise exception 'invalid_lead:mobile';
  end if;
  if char_length(v_product_id) not between 1 and 80
     or char_length(v_product_name) not between 1 and 120
     or v_product_id ~ '[[:cntrl:]]'
     or v_product_name ~ '[[:cntrl:]]' then
    raise exception 'invalid_lead:product';
  end if;

  -- Same chat delivered twice (a retry): nothing more to do.
  if exists (select 1 from blog_leads where submission_key = v_key) then
    return false;
  end if;

  -- The same person starting the same chat again straight away.
  if exists (
    select 1 from blog_leads
    where lead_source = 'chatbot'
      and mobile = v_mobile
      and product_id = v_product_id
      and created_at > now() - interval '10 minutes'
  ) then
    return false;
  end if;

  -- One number cannot flood the inbox (counts blog enquiries too, like submit_blog_lead()).
  if (
    select count(*) from blog_leads
    where mobile = v_mobile and created_at > now() - interval '1 hour'
  ) >= 5 then
    raise exception 'lead_rate_limited' using errcode = 'PT429';
  end if;

  -- The live table's older `source` column (and its constraint blog_leads_blog_required) treat any
  -- row whose source is not 'blog' as exempt from the blog fields; the earlier chatbot filled it in
  -- with 'chatbot'. Keep doing so where the column exists, so that constraint stays satisfied, nothing
  -- that reads the column changes, and a NOT NULL on it can never make a chat enquiry fail. Where the
  -- column does not exist (a fresh project) it is simply left out.
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'blog_leads' and column_name = 'source'
  ) then
    execute 'insert into blog_leads (submission_key, name, mobile, product_id, product_name, lead_source, source)
             values ($1, $2, $3, $4, $5, ''chatbot'', ''chatbot'')
             on conflict (submission_key) do nothing
             returning id'
      into v_inserted
      using v_key, v_name, v_mobile, v_product_id, v_product_name;
  else
    insert into blog_leads (submission_key, name, mobile, product_id, product_name, lead_source)
    values (v_key, v_name, v_mobile, v_product_id, v_product_name, 'chatbot')
    on conflict (submission_key) do nothing
    returning id into v_inserted;
  end if;

  return v_inserted is not null;
end;
$$;

revoke all on function submit_chatbot_lead(text, text, text, text, uuid) from public;
grant execute on function submit_chatbot_lead(text, text, text, text, uuid) to anon, authenticated;

-- STEP 9 --------------------------------------------------------------------------------------
-- Prove the finished state before the script is allowed to commit. If anything below is not true,
-- the whole script is rolled back with a message saying which part.
do $$
declare
  changed text;
  n_blog bigint;
  n_chatbot bigint;
  n_fn int;
begin
  -- Every constraint that existed before this script still exists with exactly the same definition
  -- (this covers production's blog_leads_blog_required and blog_leads_blog_length).
  select string_agg(l, ' ; ') into changed
  from unnest(string_to_array(current_setting('sunkool.constraints_before', true), E'\n')) l
  where l <> '' and not exists (
    select 1 from pg_constraint c
    where c.conrelid = 'public.blog_leads'::regclass and c.contype <> 'n'
      and c.conname || ' = ' || pg_get_constraintdef(c.oid) = l
  );
  if changed is not null then
    raise exception '[0010 v6] step 9: constraint(s) that existed before this script were changed or removed: %', changed;
  end if;

  if (select count(*) from pg_constraint
      where conrelid = 'public.blog_leads'::regclass
        and conname in ('blog_leads_lead_source_blog_required', 'blog_leads_lead_source_check')
        and convalidated) <> 2 then
    raise exception '[0010 v6] step 9: blog_leads_lead_source_blog_required and blog_leads_lead_source_check must both exist and be validated';
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'blog_leads' and column_name = 'lead_source'
      and is_nullable = 'NO' and column_default like '%blog%'
  ) then
    raise exception '[0010 v6] step 9: blog_leads.lead_source must be NOT NULL with default blog';
  end if;

  select count(*) into n_fn from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = 'submit_chatbot_lead';
  if n_fn <> 1 then
    raise exception '[0010 v6] step 9: expected exactly one submit_chatbot_lead, found %', n_fn;
  end if;

  select count(*) filter (where lead_source = 'blog'), count(*) filter (where lead_source = 'chatbot')
    into n_blog, n_chatbot from blog_leads;
  raise notice '[0010 v6] verified: every constraint that existed before is unchanged (blog_leads_blog_required %); blog_leads_lead_source_blog_required and the lead_source check are in place and validated; % blog form enquiry(ies), % chatbot enquiry(ies)',
    case when exists (select 1 from pg_constraint where conrelid = 'public.blog_leads'::regclass and conname = 'blog_leads_blog_required')
         then 'kept as it was' else 'not present on this database' end,
    n_blog, n_chatbot;
end
$$;

-- Make PostgREST pick up the new function straight away.
notify pgrst, 'reload schema';
