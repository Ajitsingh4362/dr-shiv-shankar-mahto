-- ============================================================
-- PHASE 1 — Neon Postgres schema
-- Content tables: gallery, blog, faqs, testimonials, popup settings
-- Run this in the Neon Console -> SQL Editor (or via psql)
-- ============================================================

create extension if not exists pgcrypto; -- for gen_random_uuid()

-- ---------- Gallery ----------
create table if not exists gallery_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  category text,               -- slug reference to gallery_categories
  sort_order int default 0,
  visible boolean default true,
  created_at timestamptz default now()
);

-- ---------- Blog ----------
create table if not exists blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz default now()
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image text,
  category text,
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- FAQs ----------
create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  category text default 'General',
  question text not null,
  answer text not null,
  sort_order int default 0,
  visible boolean default true,
  created_at timestamptz default now()
);

-- ---------- Testimonials ----------
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating int default 5,
  program text,
  location text,
  avatar_color text default '#0d9488',
  photo_url text,
  review text not null,
  sort_order int default 0,
  visible boolean default true,
  featured boolean default false,
  created_at timestamptz default now()
);

-- ---------- Popup settings (home page consultation popup) ----------
create table if not exists popup_settings (
  id uuid primary key default gen_random_uuid(),
  enabled boolean default true,
  title text default 'Book a Free Consultation',
  message text,
  delay_ms int default 3500,
  updated_at timestamptz default now()
);

-- seed one row so the app always finds a settings record
insert into popup_settings (enabled, title, message)
select true, 'Book a Free Consultation', 'Get expert medical advice from Dr. Shiv Shankar Mahto.'
where not exists (select 1 from popup_settings);

-- Helpful indexes
create index if not exists idx_gallery_sort on gallery (sort_order);
create index if not exists idx_blog_posts_published on blog_posts (published, published_at desc);
create index if not exists idx_faqs_sort on faqs (sort_order);
create index if not exists idx_testimonials_sort on testimonials (sort_order);
