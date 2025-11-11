-- Migration: Room features table (Option A) and vehicle mileage column
-- Run in Supabase SQL editor

-- Enable required extension for gen_random_uuid()
create extension if not exists pgcrypto;

-- Create room_features table for flexible, queryable attributes per room
create table if not exists room_features (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms(id) on delete cascade,
  key text not null, -- e.g., 'paint_color', 'flooring', 'lighting_type', 'install_info'
  value text,        -- free-form or normalized value
  unit text,         -- optional unit, e.g., 'hex', 'sqft', 'w', 'lumens'
  category text,     -- e.g., 'Finishes', 'Lighting', 'Installation'
  metadata jsonb,    -- extra structure if needed (e.g., brand, model, receipts)
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_room_features_room_id on room_features(room_id);
create index if not exists idx_room_features_key on room_features(key);

-- Add mileage to vehicles profile if missing
alter table vehicles add column if not exists mileage integer;

-- Notes:
-- - Keep existing columns on rooms (paint_color, flooring, installer, purchase_from, warranty_json)
--   for backward compatibility. We can migrate or gradually move data into room_features later.
-- - Dropdowns for paint/flooring/lighting will initially read from constants; we can add lookup tables
--   and backfill later (e.g., paint_colors, flooring_types, lighting_types).
