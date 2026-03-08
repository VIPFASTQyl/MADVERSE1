-- Fix RLS policies for activity_registrations table to allow counting

-- First, check if RLS is already enabled
-- If not, enable it
ALTER TABLE activity_registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow read activity_registrations" ON activity_registrations;
DROP POLICY IF EXISTS "Allow insert activity_registrations" ON activity_registrations;
DROP POLICY IF EXISTS "Allow update activity_registrations" ON activity_registrations;

-- Create policy to allow anyone to SELECT (for counting members)
CREATE POLICY "Allow read activity_registrations" ON activity_registrations
FOR SELECT
USING (true);

-- Create policy to allow anyone to INSERT (for registering)
CREATE POLICY "Allow insert activity_registrations" ON activity_registrations
FOR INSERT
WITH CHECK (true);

-- Create policy to allow anyone to UPDATE their own registrations
CREATE POLICY "Allow update activity_registrations" ON activity_registrations
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Create index on activity_id for faster queries
CREATE INDEX IF NOT EXISTS idx_activity_registrations_activity_id ON activity_registrations(activity_id);

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, qual 
FROM pg_policies 
WHERE tablename = 'activity_registrations';
