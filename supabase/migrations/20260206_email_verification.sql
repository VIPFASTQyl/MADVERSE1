-- Create verification_tokens table
CREATE TABLE IF NOT EXISTS verification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  created_at timestamp WITH TIME ZONE DEFAULT NOW(),
  expires_at timestamp WITH TIME ZONE NOT NULL,
  used boolean DEFAULT false,
  used_at timestamp WITH TIME ZONE
);

-- Create index for token lookup
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_user_id ON verification_tokens(user_id);

-- Function to generate verification token
CREATE OR REPLACE FUNCTION generate_verification_token(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  token text;
BEGIN
  -- Generate a random token
  token := encode(gen_random_bytes(32), 'hex');
  
  -- Insert the token (expires in 24 hours)
  INSERT INTO verification_tokens(user_id, token, expires_at)
  VALUES(user_id, token, NOW() + INTERVAL '24 hours');
  
  RETURN token;
END;
$$;

-- Function to verify token and mark email as verified
CREATE OR REPLACE FUNCTION verify_email_token(token text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id_var uuid;
BEGIN
  -- Find the token
  SELECT user_id INTO user_id_var
  FROM verification_tokens
  WHERE verification_tokens.token = token
    AND used = false
    AND expires_at > NOW();

  IF user_id_var IS NULL THEN
    RETURN false;
  END IF;

  -- Mark token as used
  UPDATE verification_tokens
  SET used = true, used_at = NOW()
  WHERE verification_tokens.token = token;

  -- Update user's email_confirmed_at (this is how Supabase tracks email verification)
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = user_id_var;

  RETURN true;
END;
$$;
