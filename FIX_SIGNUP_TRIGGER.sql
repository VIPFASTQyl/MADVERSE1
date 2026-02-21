-- Create a trigger to automatically create user_profiles when auth user is created
-- Run this in Supabase SQL Editor

-- Step 1: Delete old trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Create function that runs when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, created_at, updated_at)
  VALUES (new.id, now(), now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Update RLS policies to allow updates after trigger creates profile
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

CREATE POLICY "Users can update their own profile"
  ON user_profiles 
  FOR UPDATE 
  USING (id = auth.uid());

-- Step 5: Verify the trigger is created
-- SELECT trigger_name, event_manipulation, event_object_table
-- FROM information_schema.triggers 
-- WHERE trigger_name = 'on_auth_user_created';
