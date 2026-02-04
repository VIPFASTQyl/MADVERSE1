-- Complete Supabase Setup for MADVERSE
-- =====================================
-- Instructions:
-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Click on "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Copy and paste the SQL below
-- 5. Click "Run"

-- =====================
-- 1. Create web_content1 table for all website content
-- =====================
CREATE TABLE IF NOT EXISTS web_content1 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL,
  title TEXT,
  content TEXT,
  section TEXT NOT NULL,
  language TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(key, language)
);

-- Enable RLS on web_content1
ALTER TABLE web_content1 ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view web content
CREATE POLICY "Allow public select on web_content1"
  ON web_content1 FOR SELECT
  USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update on web_content1"
  ON web_content1 FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert on web_content1"
  ON web_content1 FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =====================
-- 2. Create activity_content table
-- =====================
CREATE TABLE IF NOT EXISTS activity_content (
  id TEXT PRIMARY KEY,
  activity_type TEXT NOT NULL,
  item_name TEXT NOT NULL,
  description TEXT,
  date TEXT,
  image_url TEXT,
  link_url TEXT,
  language TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID,
  UNIQUE(activity_type, item_name, language)
);

-- Enable RLS on activity_content
ALTER TABLE activity_content ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view activities
CREATE POLICY "Allow public select on activity_content"
  ON activity_content FOR SELECT
  USING (true);

-- Allow authenticated users to modify
CREATE POLICY "Allow authenticated update on activity_content"
  ON activity_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated insert on activity_content"
  ON activity_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on activity_content"
  ON activity_content FOR DELETE
  TO authenticated
  USING (true);

-- =====================
-- 3. Create users table for admin tracking
-- =====================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own profile
CREATE POLICY "Allow users to read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- =====================
-- 4. Create contact_messages table
-- =====================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on contact_messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact messages
CREATE POLICY "Allow public insert on contact_messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to view all messages
CREATE POLICY "Allow authenticated select on contact_messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to delete messages
CREATE POLICY "Allow authenticated delete on contact_messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (true);

-- =====================
-- End of Setup
-- =====================
-- After running this, your Supabase is ready for MADVERSE!
