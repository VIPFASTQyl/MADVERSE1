-- Fix RLS Policies for activity_content table
-- This allows public inserts/updates to work with custom JWT auth

-- Drop the old restrictive policies
DROP POLICY IF EXISTS "Allow authenticated insert on activity_content" ON activity_content;
DROP POLICY IF EXISTS "Allow authenticated update on activity_content" ON activity_content;
DROP POLICY IF EXISTS "Allow authenticated delete on activity_content" ON activity_content;

-- Allow public inserts (for admin dashboard with custom JWT)
CREATE POLICY "Allow public insert on activity_content"
  ON activity_content FOR INSERT
  WITH CHECK (true);

-- Allow public updates (for admin dashboard with custom JWT)
CREATE POLICY "Allow public update on activity_content"
  ON activity_content FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow public delete (for admin dashboard with custom JWT)
CREATE POLICY "Allow public delete on activity_content"
  ON activity_content FOR DELETE
  USING (true);

-- Verify the policies
SELECT * FROM pg_policies WHERE tablename = 'activity_content';
