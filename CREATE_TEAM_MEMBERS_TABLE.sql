-- =====================================================
-- Create Team Members Table
-- =====================================================
-- Run this in your Supabase SQL Editor

-- Step 1: Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL, -- e.g., "Founder", "Co-Founder", "Manager"
  title TEXT,
  bio TEXT,
  image_url TEXT,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, language)
);

-- Step 2: Enable RLS on team_members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Step 3: Allow public select on team_members
CREATE POLICY "Allow public select on team_members"
ON team_members
FOR SELECT
TO public
USING (true);

-- Step 4: Insert Team Member Data (English)
INSERT INTO team_members (name, role, title, bio, image_url, language)
VALUES 
  ('Klest', 'Founder', 'Founder', '', '/team-klest.png', 'en'),
  ('Guri', 'Co-Founder', 'Co-Founder', '', '/team-guri.png', 'en'),
  ('Erion', 'Manager', 'Manager', '', '/team-erion.png', 'en')
ON CONFLICT (name, language) DO UPDATE SET
  role = EXCLUDED.role,
  updated_at = NOW();

-- Step 5: Insert Team Member Data (Albanian)
INSERT INTO team_members (name, role, title, bio, image_url, language)
VALUES 
  ('Klest', 'Themelues', 'Themelues', '', '/team-klest.png', 'al'),
  ('Guri', 'Bashkë-Themelues', 'Bashkë-Themelues', '', '/team-guri.png', 'al'),
  ('Erion', 'Menaxher', 'Menaxher', '', '/team-erion.png', 'al')
ON CONFLICT (name, language) DO UPDATE SET
  role = EXCLUDED.role,
  updated_at = NOW();

-- Step 6: Verify the data
SELECT id, name, role, title, image_url, language FROM team_members ORDER BY language, name;
