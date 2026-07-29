-- First-party analytics for fynboscreative.co.za.
--
-- Run this by hand against the Supabase project (SQL editor, or `supabase db
-- push`). It is deliberately NOT wired into `npm run build`: the build ships a
-- static bundle to Nginx and has no database credentials, and a build that can
-- migrate production is a build that can drop it.
--
-- THE SECURITY MODEL, because it is the whole point of this file.
--
-- Vite inlines VITE_* at build time, so VITE_SUPABASE_ANON_KEY is public the
-- moment the bundle ships. Anyone can read it out of the JS. Everything below
-- assumes the anon key is already in an attacker's hands:
--
--   * anon may INSERT into analytics_events and may do nothing else with it.
--     There is no SELECT policy, so `select * from analytics_events` over
--     PostgREST returns zero rows no matter who asks.
--   * analytics_dashboard_secret has RLS enabled and NO policies at all, which
--     makes it unreachable through PostgREST entirely.
--   * The dashboard reads through analytics_summary(), a SECURITY DEFINER
--     function that checks the passphrase inside Postgres and returns only
--     aggregates. The passphrase never ships in the bundle, and raw event rows
--     never leave the database.
--
-- A passphrase compared in React would have been decoration: the check would
-- run on the attacker's own machine, against data they could already read.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Events
-- ---------------------------------------------------------------------------

create table if not exists public.analytics_events (
  id            bigint generated always as identity primary key,
  occurred_at   timestamptz not null default now(),
  event         text        not null,
  -- Which CTA fired it: hero | pricing | contact | sticky-mobile |
  -- contact-form-fallback. Free text rather than an enum so a new CTA cannot
  -- start dropping events on the floor before someone remembers to migrate.
  source        text,
  path          text,
  -- Hostname only, never the full referring URL. A full referrer can carry a
  -- search query or a session token in its path, and neither is wanted here.
  referrer_host text,
  device        text,
  -- Per-visit only, from sessionStorage. Distinguishes one visitor clicking
  -- twice from two visitors, and is gone when the tab closes. It is still an
  -- identifier, so the privacy policy names it explicitly.
  session_id    uuid        not null
);

-- The dashboard only ever asks "recently, grouped by X", so one descending
-- index on time carries every query the summary function makes.
create index if not exists analytics_events_occurred_at_idx
  on public.analytics_events (occurred_at desc);

alter table public.analytics_events enable row level security;

grant insert on public.analytics_events to anon;

drop policy if exists "anon may append events" on public.analytics_events;
create policy "anon may append events"
  on public.analytics_events
  for insert
  to anon
  with check (true);

-- Note the absence below this line: no SELECT, UPDATE or DELETE policy for
-- anon. That absence IS the read protection. Do not add one "just to check the
-- data" — use analytics_summary(), or the SQL editor, which runs as a superuser
-- and bypasses RLS anyway.

-- ---------------------------------------------------------------------------
-- Dashboard passphrase
-- ---------------------------------------------------------------------------

create table if not exists public.analytics_dashboard_secret (
  id              int  primary key default 1,
  passphrase_hash text not null,
  updated_at      timestamptz not null default now(),
  constraint analytics_dashboard_secret_single_row check (id = 1)
);

-- RLS on with no policies at all: unreachable via PostgREST for any client
-- role. Only SECURITY DEFINER functions and superusers can see it.
alter table public.analytics_dashboard_secret enable row level security;

-- SET THE PASSPHRASE. Change the literal below before running, or run this
-- statement again later to rotate it. bcrypt, cost 12.
insert into public.analytics_dashboard_secret (id, passphrase_hash)
values (1, crypt('CHANGE-ME-BEFORE-RUNNING', gen_salt('bf', 12)))
on conflict (id) do update
  set passphrase_hash = excluded.passphrase_hash,
      updated_at      = now();

-- ---------------------------------------------------------------------------
-- The one read path
-- ---------------------------------------------------------------------------

create or replace function public.analytics_summary(passphrase text, days int default 30)
returns jsonb
language plpgsql
security definer
-- Pinned so a caller cannot shadow `crypt` or the tables with something of
-- their own earlier in the path. Mandatory for SECURITY DEFINER.
set search_path = public, pg_temp
as $$
declare
  ok     boolean;
  since  timestamptz;
  result jsonb;
begin
  -- Clamp before use: `days` arrives from the browser.
  days  := least(greatest(coalesce(days, 30), 1), 365);
  since := now() - make_interval(days => days);

  select (s.passphrase_hash = crypt(passphrase, s.passphrase_hash))
    into ok
    from public.analytics_dashboard_secret s
   where s.id = 1;

  if not coalesce(ok, false) then
    -- Blunts trivial online guessing. bcrypt at cost 12 is already slow, so
    -- this is belt-and-braces rather than the actual defence.
    perform pg_sleep(0.5);
    raise exception 'invalid passphrase' using errcode = '28000';
  end if;

  select jsonb_build_object(
    'since',    since,
    'days',     days,
    'total',    (select count(*) from public.analytics_events e where e.occurred_at >= since),
    'sessions', (select count(distinct e.session_id) from public.analytics_events e where e.occurred_at >= since),
    'by_source', (
      select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb) from (
        select coalesce(e.source, 'unknown') as source, count(*) as n
          from public.analytics_events e
         where e.occurred_at >= since
         group by 1 order by n desc
      ) t
    ),
    'by_day', (
      select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb) from (
        select to_char(date_trunc('day', e.occurred_at), 'YYYY-MM-DD') as day, count(*) as n
          from public.analytics_events e
         where e.occurred_at >= since
         group by 1 order by 1
      ) t
    ),
    'by_path', (
      select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb) from (
        select coalesce(e.path, '/') as path, count(*) as n
          from public.analytics_events e
         where e.occurred_at >= since
         group by 1 order by n desc limit 20
      ) t
    )
  ) into result;

  return result;
end;
$$;

revoke all on function public.analytics_summary(text, int) from public;
grant execute on function public.analytics_summary(text, int) to anon;
