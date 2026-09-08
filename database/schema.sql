-- R10 Photo Coach · Neon/PostgreSQL schema
-- DATABASE_URL deve essere utilizzata esclusivamente dal server.

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  email_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists profiles (
  user_id uuid primary key references users(id) on delete cascade,
  display_name text,
  avatar_url text,
  photographer_level text not null default 'Esploratore'
    check (photographer_level in ('Principiante', 'Esploratore', 'Fotografo', 'Esperto', 'Master')),
  xp bigint not null default 0 check (xp >= 0),
  streak_days integer not null default 0 check (streak_days >= 0),
  preferred_theme text not null default 'dark' check (preferred_theme in ('dark', 'light', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Stato anonimo del dispositivo. Consente persistenza gratuita senza obbligare
-- l'utente a creare un account; l'identificatore resta in un cookie HttpOnly.
create table if not exists device_states (
  device_id uuid primary key,
  state jsonb not null default '{"academyCompleted":[],"tutorialsCompleted":[],"ownedGear":[],"updatedAt":0}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists lenses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  mount text not null default 'RF',
  focal_length text not null,
  apsc_equivalent text,
  max_aperture text not null,
  stabilization text,
  weight_grams integer check (weight_grams > 0),
  min_focus_m numeric(6, 3) check (min_focus_m > 0),
  max_magnification numeric(5, 2) check (max_magnification > 0),
  price_eur numeric(10, 2) check (price_eur >= 0),
  tier text not null check (tier in ('Budget', 'Medio', 'Premium')),
  advantages jsonb not null default '[]'::jsonb,
  disadvantages jsonb not null default '[]'::jsonb,
  uses jsonb not null default '[]'::jsonb,
  canon_source_url text,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists tutorials (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  difficulty text not null check (difficulty in ('Base', 'Intermedio', 'Avanzato')),
  estimated_minutes integer not null check (estimated_minutes > 0),
  summary text not null,
  outcome text not null,
  content jsonb not null default '{}'::jsonb,
  canon_sources jsonb not null default '[]'::jsonb,
  verified_at timestamptz,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists scenarios (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  conditions jsonb not null default '{}'::jsonb,
  recommended_settings jsonb not null default '{}'::jsonb,
  recommended_lens_id uuid references lenses(id) on delete set null,
  tutorial_id uuid references tutorials(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists missions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  requirements jsonb not null default '{}'::jsonb,
  xp_reward integer not null default 50 check (xp_reward >= 0),
  difficulty text not null check (difficulty in ('Base', 'Intermedio', 'Avanzato')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists badges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  icon_key text not null,
  criteria jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists gear (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  lens_id uuid references lenses(id) on delete set null,
  kind text not null check (kind in ('camera', 'lens', 'accessory')),
  name text not null,
  details jsonb not null default '{}'::jsonb,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  tutorial_id uuid references tutorials(id) on delete cascade,
  mission_id uuid references missions(id) on delete cascade,
  status text not null default 'started' check (status in ('started', 'completed')),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  xp_earned integer not null default 0 check (xp_earned >= 0),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  check (num_nonnulls(tutorial_id, mission_id) = 1)
);

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  storage_provider text not null default 'vercel_blob' check (storage_provider in ('vercel_blob')),
  storage_path text not null unique,
  storage_url text not null,
  original_filename text not null,
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp', 'image/heic')),
  size_bytes bigint check (size_bytes > 0),
  width integer check (width > 0),
  height integer check (height > 0),
  exif jsonb not null default '{}'::jsonb,
  scenario_id uuid references scenarios(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists ai_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  photo_id uuid not null references photos(id) on delete cascade,
  model text not null,
  score integer not null check (score between 0 and 100),
  composition_score integer check (composition_score between 0 and 100),
  exposure_score integer check (exposure_score between 0 and 100),
  focus_score integer check (focus_score between 0 and 100),
  review jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists user_badges (
  user_id uuid not null references users(id) on delete cascade,
  badge_id uuid not null references badges(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

create unique index if not exists progress_user_tutorial_unique
  on progress (user_id, tutorial_id) where tutorial_id is not null;
create unique index if not exists progress_user_mission_unique
  on progress (user_id, mission_id) where mission_id is not null;
create index if not exists gear_user_id_idx on gear (user_id);
create index if not exists gear_lens_id_idx on gear (lens_id);
create index if not exists scenarios_recommended_lens_id_idx on scenarios (recommended_lens_id);
create index if not exists scenarios_tutorial_id_idx on scenarios (tutorial_id);
create index if not exists progress_tutorial_id_idx on progress (tutorial_id);
create index if not exists progress_mission_id_idx on progress (mission_id);
create index if not exists photos_user_created_at_idx on photos (user_id, created_at desc);
create index if not exists photos_scenario_id_idx on photos (scenario_id);
create index if not exists ai_reviews_user_id_idx on ai_reviews (user_id);
create index if not exists ai_reviews_photo_id_idx on ai_reviews (photo_id);
create index if not exists user_badges_badge_id_idx on user_badges (badge_id);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on users;
create trigger users_set_updated_at before update on users
for each row execute function set_updated_at();

drop trigger if exists profiles_set_updated_at on profiles;
create trigger profiles_set_updated_at before update on profiles
for each row execute function set_updated_at();

drop trigger if exists tutorials_set_updated_at on tutorials;
create trigger tutorials_set_updated_at before update on tutorials
for each row execute function set_updated_at();

drop trigger if exists progress_set_updated_at on progress;
create trigger progress_set_updated_at before update on progress
for each row execute function set_updated_at();

drop trigger if exists device_states_set_updated_at on device_states;
create trigger device_states_set_updated_at before update on device_states
for each row execute function set_updated_at();
