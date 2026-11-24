-- Blog CMS schema: categories, authors, posts, and the admin allowlist.

create type post_status as enum ('draft', 'published');

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar text,
  bio text,
  created_at timestamptz not null default now()
);

-- Allowlist of Supabase Auth users permitted to manage blog content.
-- Membership is granted manually (see SETUP.md) — there is no self-signup.
create table admins (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content jsonb not null default '{"type":"doc","content":[]}'::jsonb,
  cover_image text,
  author_id uuid references authors (id) on delete set null,
  category_id uuid references categories (id) on delete set null,
  status post_status not null default 'draft',
  featured boolean not null default false,
  meta_title text,
  meta_description text,
  keywords text[] not null default '{}',
  -- Not in the original field list, but required for the GEO "FAQ section
  -- support" requirement: an array of { question, answer } objects.
  faqs jsonb not null default '[]'::jsonb,
  reading_time int not null default 1,
  views int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index posts_status_published_at_idx on posts (status, published_at desc);
create index posts_category_id_idx on posts (category_id);
create index posts_slug_idx on posts (slug);
create index posts_title_excerpt_search_idx on posts using gin (
  to_tsvector('english', title || ' ' || excerpt)
);
