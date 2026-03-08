-- Create table to track active user sessions
CREATE TABLE IF NOT EXISTS active_sessions (
  session_id VARCHAR(100) PRIMARY KEY,
  last_seen TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for querying by last_seen
CREATE INDEX IF NOT EXISTS idx_active_sessions_last_seen ON active_sessions(last_seen DESC);

-- Enable Row Level Security
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their session
CREATE POLICY "Allow insert active_sessions" ON active_sessions
FOR INSERT
WITH CHECK (true);

-- Allow anyone to update their session
CREATE POLICY "Allow update active_sessions" ON active_sessions
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow anyone to read active_sessions (for getting count)
CREATE POLICY "Allow read active_sessions" ON active_sessions
FOR SELECT
USING (true);

-- Allow anyone to delete (for cleanup)
CREATE POLICY "Allow delete active_sessions" ON active_sessions
FOR DELETE
USING (true);

-- Optional: Create a function to clean up old sessions (older than 1 hour)
-- Run this periodically with a cron job or trigger
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM active_sessions
  WHERE last_seen < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;
