-- Fix RLS Policies for user_profiles signup
-- Run this in Supabase SQL Editor to allow sign-up profile creation

-- Step 1: Disable RLS temporarily to set policies correctly
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing problematic policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- Step 3: Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create new policies that work properly
-- Policy for INSERT during signup
CREATE POLICY "Users can insert their own profile"
  ON user_profiles 
  FOR INSERT 
  WITH CHECK (id = auth.uid());

-- Policy for SELECT (view own profile)
CREATE POLICY "Users can view their own profile"
  ON user_profiles 
  FOR SELECT 
  USING (id = auth.uid());

-- Policy for UPDATE (edit own profile)
CREATE POLICY "Users can update their own profile"
  ON user_profiles 
  FOR UPDATE 
  USING (id = auth.uid());

-- Verify policies are in place
-- Run this query to check:
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'user_profiles';

