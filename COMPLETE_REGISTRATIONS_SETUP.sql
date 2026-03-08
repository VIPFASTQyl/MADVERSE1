-- Complete setup for activity registrations with RLS

-- Step 1: Create registrations table (if not exists)
CREATE TABLE IF NOT EXISTS registrations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Step 2: Create activity_registrations table (if not exists)
CREATE TABLE IF NOT EXISTS activity_registrations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  registration_id BIGINT REFERENCES registrations(id) ON DELETE CASCADE,
  activity_id VARCHAR(255) NOT NULL,
  activity_title VARCHAR(255) NOT NULL,
  activity_category VARCHAR(100),
  activity_date VARCHAR(100),
  activity_location VARCHAR(255),
  registered_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(registration_id, activity_id)
);

-- Step 3: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_activity_registrations_registration_id ON activity_registrations(registration_id);
CREATE INDEX IF NOT EXISTS idx_activity_registrations_activity_id ON activity_registrations(activity_id);

-- Step 4: Enable RLS on both tables
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_registrations ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies for registrations table
DROP POLICY IF EXISTS "Allow read registrations" ON registrations;
DROP POLICY IF EXISTS "Allow insert registrations" ON registrations;

CREATE POLICY "Allow read registrations" ON registrations
FOR SELECT USING (true);

CREATE POLICY "Allow insert registrations" ON registrations
FOR INSERT WITH CHECK (true);

-- Step 6: Create RLS policies for activity_registrations table
DROP POLICY IF EXISTS "Allow read activity_registrations" ON activity_registrations;
DROP POLICY IF EXISTS "Allow insert activity_registrations" ON activity_registrations;
DROP POLICY IF EXISTS "Allow update activity_registrations" ON activity_registrations;

CREATE POLICY "Allow read activity_registrations" ON activity_registrations
FOR SELECT USING (true);

CREATE POLICY "Allow insert activity_registrations" ON activity_registrations
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update activity_registrations" ON activity_registrations
FOR UPDATE USING (true) WITH CHECK (true);

-- Step 7: Verify the setup
SELECT 'registrations' as table_name, COUNT(*) as row_count FROM registrations
UNION ALL
SELECT 'activity_registrations' as table_name, COUNT(*) as row_count FROM activity_registrations;

-- Show all RLS policies
SELECT tablename, policyname, permissive, roles, qual 
FROM pg_policies 
WHERE tablename IN ('registrations', 'activity_registrations')
ORDER BY tablename, policyname;
