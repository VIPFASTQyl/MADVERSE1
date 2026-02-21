-- Simple function to confirm email for a user
CREATE OR REPLACE FUNCTION confirm_email_for_user(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update user's email_confirmed_at to mark email as verified
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = user_id;

  RETURN true;
END;
$$;
