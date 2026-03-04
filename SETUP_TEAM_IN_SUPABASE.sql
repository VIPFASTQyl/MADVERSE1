-- =====================================================
-- Add Team Member Image URLs to Supabase
-- =====================================================
-- Run this in your Supabase SQL Editor

-- Step 1: Add/Update Team Member Data (English)
INSERT INTO web_content1 (key, content, section, language, updated_at)
VALUES 
  ('team_klest_name', 'Klest', 'team', 'en', NOW()),
  ('team_klest_title', 'Founder', 'team', 'en', NOW()),
  ('team_klest_bio', '', 'team', 'en', NOW()),
  ('team_klest_image', '/team-klest.png', 'team', 'en', NOW()),
  
  ('team_guri_name', 'Guri', 'team', 'en', NOW()),
  ('team_guri_title', 'Co-Founder', 'team', 'en', NOW()),
  ('team_guri_bio', '', 'team', 'en', NOW()),
  ('team_guri_image', '/team-guri.png', 'team', 'en', NOW()),
  
  ('team_erion_name', 'Erion', 'team', 'en', NOW()),
  ('team_erion_title', 'Manager', 'team', 'en', NOW()),
  ('team_erion_bio', '', 'team', 'en', NOW()),
  ('team_erion_image', '/team-erion.png', 'team', 'en', NOW())
ON CONFLICT (key, language) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = NOW();

-- Step 2: Add/Update Team Member Data (Albanian)
INSERT INTO web_content1 (key, content, section, language, updated_at)
VALUES 
  ('team_klest_name', 'Klest', 'team', 'al', NOW()),
  ('team_klest_title', 'Themelues', 'team', 'al', NOW()),
  ('team_klest_bio', '', 'team', 'al', NOW()),
  ('team_klest_image', '/team-klest.png', 'team', 'al', NOW()),
  
  ('team_guri_name', 'Guri', 'team', 'al', NOW()),
  ('team_guri_title', 'Bashkë-Themelues', 'team', 'al', NOW()),
  ('team_guri_bio', '', 'team', 'al', NOW()),
  ('team_guri_image', '/team-guri.png', 'team', 'al', NOW()),
  
  ('team_erion_name', 'Erion', 'team', 'al', NOW()),
  ('team_erion_title', 'Menaxher', 'team', 'al', NOW()),
  ('team_erion_bio', '', 'team', 'al', NOW()),
  ('team_erion_image', '/team-erion.png', 'team', 'al', NOW())
ON CONFLICT (key, language) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = NOW();

-- Step 3: Verify the data
SELECT key, content, language FROM web_content1 
WHERE key LIKE 'team_%' 
ORDER BY language, key;
