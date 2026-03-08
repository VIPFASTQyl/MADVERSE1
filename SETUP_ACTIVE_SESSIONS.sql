-- Create table to track active user sessions
CREATE TABLE IF NOT EXISTS active_sessions (
  session_id VARCHAR(100) PRIMARY KEY,
  last_seen TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for querying by last_seen
CREATE INDEX IF NOT EXISTS idx_active_sessions_last_seen ON active_sessions(last_seen DESC);

-- Optional: Create a function to clean up old sessions (older than 1 hour)
-- Run this periodically with a cron job or trigger
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM active_sessions
  WHERE last_seen < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;
