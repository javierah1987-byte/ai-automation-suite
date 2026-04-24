-- AI Automation Suite — Supabase Schema
-- Ejecutar en: Supabase Dashboard > SQL Editor

-- CLIENTES
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text,
  phone text,
  sector text,
  module text,
  status text default 'lead',
  mrr numeric default 0,
  notes text,
  created_at timestamptz default now()
);
create table if not exists proposals (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_company text,
  client_email text,
  sector text, service text, budget text, content text,
  status text default 'sent',
  created_at timestamptz default now()
);
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null, address text, phone text, website text,
  rating numeric, reviews integer, score integer, sector text, zone text,
  status text default 'new',
  created_at timestamptz default now()
);
create table if not exists meetings (
  id uuid primary key default gen_random_uuid(),
  title text, transcript text, summary text,
  attendees jsonb default '[]', decisions jsonb default '[]', tasks jsonb default '[]',
  mode text default 'online', emails_sent boolean default false,
  created_at timestamptz default now()
);
alter table clients disable row level security;
alter table proposals disable row level security;
alter table leads disable row level security;
alter table meetings disable row level security: