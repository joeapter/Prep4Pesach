-- Initial schema, helpers, and RLS policies for the Prep4Pesach cleaning platform
-- Tables follow the data model outlined in the project brief.

-- Enable uuid-ossp for convenience
create extension if not exists "uuid-ossp";

-- Dedicated application schema for helper functions
create schema if not exists app;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'worker', 'client')),
  full_name text not null,
  phone text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists clients (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null unique references profiles(id) on delete cascade,
  email text not null unique,
  address_text text,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists workers (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null unique references profiles(id) on delete cascade,
  pay_rate_cents integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists worker_availability (
  id uuid primary key default uuid_generate_v4(),
  worker_id uuid not null references workers(id) on delete cascade,
  start_at timestamptz not null,
  end_at timestamptz not null,
  recurring_rule text,
  created_at timestamptz not null default timezone('utc', now())
  , check (end_at > start_at)
);

create table if not exists slots (
  id uuid primary key default uuid_generate_v4(),
  start_at timestamptz not null,
  end_at timestamptz not null,
  capacity_workers integer not null default 1,
  status text not null check (status in ('open','held','booked','closed')) default 'open',
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  unique(start_at, end_at)
  , check (end_at > start_at)
);

create table if not exists jobs (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references clients(id) on delete cascade,
  slot_id uuid references slots(id) on delete set null,
  address_text text not null,
  notes text,
  status text not null check (status in ('booked','scheduled','in_progress','completed','invoiced','cancelled')) default 'booked',
  hourly_rate_cents integer not null check (hourly_rate_cents >= 0),
  requested_team_size integer not null default 1 check (requested_team_size >= 1),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists job_assignments (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references jobs(id) on delete cascade,
  worker_id uuid not null references workers(id),
  assigned_at timestamptz not null default timezone('utc', now()),
  unique(job_id, worker_id)
);

create table if not exists time_entries (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references jobs(id) on delete cascade,
  worker_id uuid not null references workers(id),
  punch_in timestamptz not null,
  punch_out timestamptz,
  minutes_worked integer generated always as (
    case
      when punch_out is not null then floor(extract(epoch from (punch_out - punch_in)) / 60.0)::int
      else 0
    end
  ) stored,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  approved_by uuid references profiles(id),
  approved_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
  , check (punch_out is null or punch_out >= punch_in)
);

create table if not exists invoices (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references jobs(id) on delete cascade unique,
  client_id uuid not null references clients(id),
  status text not null default 'draft' check (status in ('draft','sent','paid','void')),
  subtotal_cents integer not null default 0,
  total_cents integer not null default 0,
  pdf_path text,
  sent_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists invoice_lines (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  description text not null,
  quantity numeric not null,
  unit_price_cents integer not null,
  line_total_cents integer not null
);

create table if not exists worker_payments (
  id uuid primary key default uuid_generate_v4(),
  worker_id uuid not null references workers(id) on delete cascade,
  amount_cents integer not null check (amount_cents >= 0),
  job_id uuid references jobs(id),
  paid_at timestamptz not null default timezone('utc', now()),
  notes text
);

-- Helper functions --------------------------------------------------------
create or replace function app.current_profile() returns profiles as $$
  select * from profiles where id = auth.uid()
$$ language sql stable;

create or replace function app.is_admin() returns boolean as $$
  select exists(select 1 from profiles where id = auth.uid() and role = 'admin')
$$ language sql stable;

create or replace function app.current_worker_id() returns uuid as $$
  select id from workers where profile_id = auth.uid() limit 1
$$ language sql stable;

create or replace function app.worker_of_profile(_worker_id uuid) returns boolean as $$
  select exists(
    select 1
    from workers
    where id = _worker_id
      and profile_id = auth.uid()
  )
$$ language sql stable;

create or replace function app.is_assigned_worker(_job_id uuid) returns boolean as $$
  select exists(
    select 1
    from job_assignments
    where job_id = _job_id
      and worker_id = app.current_worker_id()
  )
$$ language sql stable;

create or replace function app.profile_is_client(_client_id uuid) returns boolean as $$
  select exists(
    select 1
    from clients
    where id = _client_id
      and profile_id = auth.uid()
  )
$$ language sql stable;

-- Enable RLS --------------------------------------------------------------
alter table profiles enable row level security;
alter table clients enable row level security;
alter table workers enable row level security;
alter table worker_availability enable row level security;
alter table slots enable row level security;
alter table jobs enable row level security;
alter table job_assignments enable row level security;
alter table time_entries enable row level security;
alter table invoices enable row level security;
alter table invoice_lines enable row level security;
alter table worker_payments enable row level security;

-- Policies ---------------------------------------------------------------
-- Profiles: admins see all, users see their own record.
create policy "profiles self select" on profiles for select using (id = auth.uid());
create policy "profiles admin select" on profiles for select using (app.is_admin());
create policy "profiles self update" on profiles for update using (id = auth.uid());
create policy "profiles admin update" on profiles for update using (app.is_admin());

-- Clients: clients see their own, admins see all.
create policy "clients self" on clients for select using (profile_id = auth.uid());
create policy "clients admin" on clients for select using (app.is_admin());
create policy "clients admin insert" on clients for insert with check (app.is_admin());
create policy "clients admin update" on clients for update using (app.is_admin());
create policy "clients admin delete" on clients for delete using (app.is_admin());

-- Workers: workers see their own profile/metadata, admins see all.
create policy "workers self" on workers for select using (profile_id = auth.uid());
create policy "workers admin" on workers for select using (app.is_admin());
create policy "workers admin insert" on workers for insert with check (app.is_admin());
create policy "workers admin update" on workers for update using (app.is_admin());
create policy "workers admin delete" on workers for delete using (app.is_admin());

-- Worker availability: worker controls own records, admin can read all.
create policy "availability worker insert" on worker_availability for insert with check (app.worker_of_profile(worker_id));
create policy "availability worker update" on worker_availability for update using (app.worker_of_profile(worker_id));
create policy "availability worker delete" on worker_availability for delete using (app.worker_of_profile(worker_id));
create policy "availability worker select" on worker_availability for select using (app.worker_of_profile(worker_id));
create policy "availability admin select" on worker_availability for select using (app.is_admin());
create policy "availability admin insert" on worker_availability for insert with check (app.is_admin());
create policy "availability admin update" on worker_availability for update using (app.is_admin());

-- Slots: admin full control, worker/client can read open slots.
create policy "slots admin select" on slots for select using (app.is_admin());
create policy "slots admin insert" on slots for insert with check (app.is_admin());
create policy "slots admin update" on slots for update using (app.is_admin());
create policy "slots admin delete" on slots for delete using (app.is_admin());
create policy "slots public select" on slots for select using (status = 'open');

-- Jobs: admin sees all; client sees own; worker sees assigned jobs.
create policy "jobs admin select" on jobs for select using (app.is_admin());
create policy "jobs client select" on jobs for select using (client_id in (select id from clients where profile_id = auth.uid()));
create policy "jobs worker select" on jobs for select using (app.is_assigned_worker(id));
create policy "jobs client insert" on jobs for insert with check (exists (select 1 from clients where id = client_id and profile_id = auth.uid()));
create policy "jobs admin insert" on jobs for insert with check (app.is_admin());
create policy "jobs admin update" on jobs for update using (app.is_admin());
create policy "jobs admin delete" on jobs for delete using (app.is_admin());

-- Job assignments: admin manage; workers view when assigned.
create policy "job_assignments admin" on job_assignments for select using (app.is_admin());
create policy "job_assignments worker" on job_assignments for select using (worker_id = app.current_worker_id());
create policy "job_assignments admin insert" on job_assignments for insert with check (app.is_admin());
create policy "job_assignments admin update" on job_assignments for update using (app.is_admin());
create policy "job_assignments admin delete" on job_assignments for delete using (app.is_admin());

-- Time entries: workers manage their own entries for assigned jobs; admin handles approvals.
create policy "time_entries worker select" on time_entries for select using (
  worker_id = app.current_worker_id()
    and exists (
      select 1 from job_assignments
       where job_id = time_entries.job_id
         and worker_id = time_entries.worker_id
    )
);
create policy "time_entries worker insert" on time_entries for insert with check (
  worker_id = app.current_worker_id()
    and exists (
      select 1 from job_assignments
        where job_id = time_entries.job_id
          and worker_id = time_entries.worker_id
    )
);
create policy "time_entries worker update" on time_entries for update using (
  worker_id = app.current_worker_id()
    and exists (
      select 1 from job_assignments
        where job_id = time_entries.job_id
          and worker_id = time_entries.worker_id
    )
);
create policy "time_entries admin" on time_entries for select using (app.is_admin());
create policy "time_entries admin update" on time_entries for update using (app.is_admin());

-- Invoices: admin only.
create policy "invoices admin select" on invoices for select using (app.is_admin());
create policy "invoices admin insert" on invoices for insert with check (app.is_admin());
create policy "invoices admin update" on invoices for update using (app.is_admin());
create policy "invoices admin delete" on invoices for delete using (app.is_admin());

-- Invoice lines: admin only.
create policy "invoice_lines admin" on invoice_lines for select using (app.is_admin());
create policy "invoice_lines admin insert" on invoice_lines for insert with check (app.is_admin());
create policy "invoice_lines admin update" on invoice_lines for update using (app.is_admin());
create policy "invoice_lines admin delete" on invoice_lines for delete using (app.is_admin());

-- Worker payments: admin only.
create policy "worker_payments admin" on worker_payments for select using (app.is_admin());
create policy "worker_payments admin insert" on worker_payments for insert with check (app.is_admin());
create policy "worker_payments admin update" on worker_payments for update using (app.is_admin());
