-- Phase 1: Enhanced User Features Database Schema
-- Run this in Supabase SQL Editor

-- 1. Extend user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  bio TEXT,
  interests TEXT[], -- Array of interests/categories
  profile_image_url TEXT,
  date_of_birth DATE,
  location TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Activity favorites/wishlist table
CREATE TABLE IF NOT EXISTS activity_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL REFERENCES activity_content(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, activity_id)
);

-- 3. Activity registrations table
CREATE TABLE IF NOT EXISTS activity_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL REFERENCES activity_content(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'registered', -- registered, completed, cancelled
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, activity_id)
);

-- 4. Activity history table (automatically tracked)
CREATE TABLE IF NOT EXISTS activity_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL REFERENCES activity_content(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- viewed, registered, completed, favorite
  action_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_history ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policies for activity_favorites
CREATE POLICY "Users can view their own favorites"
  ON activity_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON activity_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
  ON activity_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for activity_registrations
CREATE POLICY "Users can view their own registrations"
  ON activity_registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can register for activities"
  ON activity_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their registration"
  ON activity_registrations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for activity_history
CREATE POLICY "Users can view their own history"
  ON activity_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert history"
  ON activity_history FOR INSERT
  WITH CHECK (true);
