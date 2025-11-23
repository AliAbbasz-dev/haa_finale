-- First HAAven Assistant Database Schema
-- Run this in Supabase SQL Editor after running the previous migrations

-- Table for storing chat conversations
CREATE TABLE IF NOT EXISTS haaven_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  messages JSONB NOT NULL DEFAULT '[]', -- Array of {role: 'user'|'assistant', content: string, timestamp: string}
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_haaven_conversations_user_id ON haaven_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_haaven_conversations_created_at ON haaven_conversations(created_at DESC);

-- Enable RLS
ALTER TABLE haaven_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see their own conversations
DROP POLICY IF EXISTS "Users can view own conversations" ON haaven_conversations;
CREATE POLICY "Users can view own conversations" ON haaven_conversations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own conversations" ON haaven_conversations;
CREATE POLICY "Users can insert own conversations" ON haaven_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own conversations" ON haaven_conversations;
CREATE POLICY "Users can update own conversations" ON haaven_conversations
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own conversations" ON haaven_conversations;
CREATE POLICY "Users can delete own conversations" ON haaven_conversations
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_haaven_conversations_updated_at ON haaven_conversations;
CREATE TRIGGER update_haaven_conversations_updated_at
  BEFORE UPDATE ON haaven_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
