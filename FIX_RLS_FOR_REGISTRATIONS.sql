-- Fix RLS policies for registrations table to allow anonymous writes
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- Fix RLS policies for activity_registrations table to allow anonymous writes
ALTER TABLE activity_registrations DISABLE ROW LEVEL SECURITY;
