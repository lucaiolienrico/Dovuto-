-- ════════════════════════════════════════════════════════════════════════════
-- Dovuto — Schema iniziale
-- Tabelle: profiles, deadlines, subscriptions, activity_logs
-- Sicurezza: Row Level Security su tutte le tabelle utente
-- ════════════════════════════════════════════════════════════════════════════

-- ─── ENUM TYPES ──────────────────────────────────────────────────────────────

create type deadline_status as enum (
  'critico', 'scade_oggi', 'in_scadenza', 'programmato', 'completato'
);

create type plan_id as enum ('free', 'personal', 'famiglia', 'pro');

create type subscription_status as enum (
  'active', 'trialing', 'past_due', 'canceled', 'incomplete'
);

-- ─── PROFILES ────────────────────────────────────────────────────────────────
-- Estende auth.users con dati applicativi.

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  email       text not null,
  avatar_url  text,
  plan        plan_id not null default 'free',
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'Profilo utente, esteso da auth.users';

-- ─── DEADLINES ───────────────────────────────────────────────────────────────

create table public.deadlines (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 120),
  subtitle    text default '',
  category    text not null,
  due_date    date not null,
  amount      numeric(10,2) not null default 0 check (amount >= 0),
  status      deadline_status not null default 'programmato',
  priority    smallint not null default 3 check (priority between 1 and 5),
  notify      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index deadlines_user_id_idx   on public.deadlines(user_id);
create index deadlines_due_date_idx  on public.deadlines(due_date);
create index deadlines_status_idx    on public.deadlines(status);

comment on table public.deadlines is 'Scadenze personali dell utente';

-- ─── SUBSCRIPTIONS (Stripe) ──────────────────────────────────────────────────

create table public.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id     text,
  stripe_subscription_id text unique,
  plan                   plan_id not null default 'free',
  status                 subscription_status not null default 'active',
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index subscriptions_user_id_idx on public.subscriptions(user_id);
create unique index subscriptions_one_per_user on public.subscriptions(user_id);

comment on table public.subscriptions is 'Abbonamento Stripe per utente';

-- ─── ACTIVITY LOGS ───────────────────────────────────────────────────────────

create table public.activity_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete set null,
  action      text not null,
  detail      text,
  created_at  timestamptz not null default now()
);

create index activity_logs_created_idx on public.activity_logs(created_at desc);

-- ════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════════════════════

alter table public.profiles      enable row level security;
alter table public.deadlines     enable row level security;
alter table public.subscriptions enable row level security;
alter table public.activity_logs enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql security definer stable
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ── PROFILES policies ──
create policy "profili: utente legge il proprio"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "profili: utente aggiorna il proprio"
  on public.profiles for update
  using (auth.uid() = id);

-- ── DEADLINES policies ──
create policy "scadenze: utente vede le proprie"
  on public.deadlines for select
  using (auth.uid() = user_id or public.is_admin());

create policy "scadenze: utente crea le proprie"
  on public.deadlines for insert
  with check (auth.uid() = user_id);

create policy "scadenze: utente modifica le proprie"
  on public.deadlines for update
  using (auth.uid() = user_id);

create policy "scadenze: utente elimina le proprie"
  on public.deadlines for delete
  using (auth.uid() = user_id);

-- ── SUBSCRIPTIONS policies ──
-- Lettura sì, scrittura solo via service_role (webhook Stripe).
create policy "abbonamenti: utente legge il proprio"
  on public.subscriptions for select
  using (auth.uid() = user_id or public.is_admin());

-- ── ACTIVITY LOGS policies ──
create policy "log: utente legge i propri"
  on public.activity_logs for select
  using (auth.uid() = user_id or public.is_admin());

create policy "log: utente inserisce i propri"
  on public.activity_logs for insert
  with check (auth.uid() = user_id);

-- ════════════════════════════════════════════════════════════════════════════
-- TRIGGERS
-- ════════════════════════════════════════════════════════════════════════════

-- updated_at automatico
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch      before update on public.profiles      for each row execute function public.touch_updated_at();
create trigger deadlines_touch     before update on public.deadlines     for each row execute function public.touch_updated_at();
create trigger subscriptions_touch before update on public.subscriptions for each row execute function public.touch_updated_at();

-- Crea automaticamente profilo + subscription free alla registrazione
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');

  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'active');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
