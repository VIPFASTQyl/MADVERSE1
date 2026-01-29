-- Supabase Setup Instructions
-- ============================
-- 
-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/xlayiymdhgixsqtcivzq
-- 2. Click on "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Copy and paste the SQL below
-- 5. Click "Run"
--
-- ============================

-- Create contact_messages table
CREATE TABLE contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact messages
CREATE POLICY "Allow public insert"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to view all messages
CREATE POLICY "Allow authenticated select"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update their own messages
CREATE POLICY "Allow authenticated update"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = created_at::text);
