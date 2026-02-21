-- Simple RPC function for profile creation during signup
-- Run this AFTER FIX_SIGNUP_TRIGGER.sql
-- This function has elevated permissions (SECURITY DEFINER) to bypass RLS

DROP FUNCTION IF EXISTS public.update_signup_profile(uuid, text, text);

CREATE OR REPLACE FUNCTION public.update_signup_profile(
  user_id uuid,
  user_full_name text,
  user_phone text
)
RETURNS json AS $$
BEGIN
  -- Update the user profile created by the trigger
  UPDATE public.user_profiles 
  SET 
    full_name = user_full_name,
    phone = user_phone,
    updated_at = now()
  WHERE id = user_id;

  RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Allow public access (anon users during signup)
GRANT EXECUTE ON FUNCTION public.update_signup_profile(uuid, text, text) TO anon, authenticated;

-- Verify function exists:
-- SELECT proname FROM pg_proc WHERE proname = 'update_signup_profile';

