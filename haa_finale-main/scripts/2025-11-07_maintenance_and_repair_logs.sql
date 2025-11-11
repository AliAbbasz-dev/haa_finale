-- Migration: maintenance_logs and repair_logs with relations to homes/rooms/vehicles and next-due fields
-- Run in Supabase SQL editor

create extension if not exists pgcrypto;

-- maintenance_logs: for routine service tasks on vehicles, homes, or rooms
create table if not exists maintenance_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete cascade,
  home_id uuid references homes(id) on delete cascade,
  room_id uuid references rooms(id) on delete cascade,

  service_type text not null,                      -- e.g., Oil Change, HVAC Filter
  service_date date not null,
  mileage integer,                                 -- only meaningful when vehicle_id is set
  provider text,
  outcome text,
  cost numeric,
  notes text,
  image_url text,

  -- Next-due tracking
  next_due_date date,
  next_due_mileage integer,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_maint_logs_vehicle on maintenance_logs(vehicle_id);
create index if not exists idx_maint_logs_home on maintenance_logs(home_id);
create index if not exists idx_maint_logs_room on maintenance_logs(room_id);
create index if not exists idx_maint_logs_next_due_date on maintenance_logs(next_due_date);

-- At least one target context must be set
create or replace function maintenance_logs_target_check() returns trigger as $$
begin
  if (NEW.vehicle_id is null and NEW.home_id is null and NEW.room_id is null) then
    raise exception 'One of vehicle_id, home_id, or room_id must be provided';
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger trg_maintenance_logs_target_check
before insert or update on maintenance_logs
for each row execute function maintenance_logs_target_check();

-- repair_logs: for non-routine issues and fixes
create table if not exists repair_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete cascade,
  home_id uuid references homes(id) on delete cascade,
  room_id uuid references rooms(id) on delete cascade,

  repair_type text not null,                        -- e.g., Brake Service, Roof Leak Fix
  service_date date not null,
  mileage integer,
  provider text,
  outcome text,
  warranty text,
  cost numeric,
  notes text,
  image_url text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_repair_logs_vehicle on repair_logs(vehicle_id);
create index if not exists idx_repair_logs_home on repair_logs(home_id);
create index if not exists idx_repair_logs_room on repair_logs(room_id);

create or replace function repair_logs_target_check() returns trigger as $$
begin
  if (NEW.vehicle_id is null and NEW.home_id is null and NEW.room_id is null) then
    raise exception 'One of vehicle_id, home_id, or room_id must be provided';
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger trg_repair_logs_target_check
before insert or update on repair_logs
for each row execute function repair_logs_target_check();
