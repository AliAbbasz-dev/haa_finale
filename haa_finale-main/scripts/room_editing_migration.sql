-- Migration: Add Room Editing Features
-- Date: 2025-12-23
-- Description: Adds lighting field to rooms table and creates room_files table for file uploads

-- 1. Add lighting column to rooms table
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS lighting text;

-- 2. Create room_files table for multiple file uploads per room
CREATE TABLE IF NOT EXISTS room_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text,
  file_size bigint,
  uploaded_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Add indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_room_files_room_id ON room_files(room_id);
CREATE INDEX IF NOT EXISTS idx_room_files_user_id ON room_files(user_id);

-- 4. Enable Row Level Security
ALTER TABLE room_files ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies for room_files

-- Policy: Users can view their own room files
DROP POLICY IF EXISTS "Users can view their own room files" ON room_files;
CREATE POLICY "Users can view their own room files"
  ON room_files FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own files
DROP POLICY IF EXISTS "Users can insert their own room files" ON room_files;
CREATE POLICY "Users can insert their own room files"
  ON room_files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own files
DROP POLICY IF EXISTS "Users can delete their own room files" ON room_files;
CREATE POLICY "Users can delete their own room files"
  ON room_files FOR DELETE
  USING (auth.uid() = user_id);

-- Migration complete
