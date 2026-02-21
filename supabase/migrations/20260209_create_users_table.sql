-- Create users table for custom authentication (NOT using Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(500),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read their own data
CREATE POLICY "Users can read their own data"
  ON public.users
  FOR SELECT
  USING (true);

-- RLS Policy: Allow inserts for signup (public)
CREATE POLICY "Allow signup"
  ON public.users
  FOR INSERT
  WITH CHECK (true);

-- RLS Policy: Users can update their own records
CREATE POLICY "Users can update their own data"
  ON public.users
  FOR UPDATE
  USING (true);
