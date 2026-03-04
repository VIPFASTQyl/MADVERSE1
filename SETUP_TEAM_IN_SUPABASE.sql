-- =====================================================
-- Add Team Member Image URLs to Supabase
-- =====================================================
-- Run this in your Supabase SQL Editor

-- Step 1: Delete existing team entries (if updating)
DELETE FROM web_content1 WHERE key LIKE 'team_%';

-- Step 2: Add Team Member Data (English)
INSERT INTO web_content1 (key, content, section, language, updated_at, created_at)
VALUES 
  ('team_klest_name', 'Klest', 'team', 'en', NOW(), NOW()),
  ('team_klest_title', 'Founder', 'team', 'en', NOW(), NOW()),
  ('team_klest_bio', '', 'team', 'en', NOW(), NOW()),
  ('team_klest_image', '/team-klest.png', 'team', 'en', NOW(), NOW()),
  
  ('team_guri_name', 'Guri', 'team', 'en', NOW(), NOW()),
  ('team_guri_title', 'Co-Founder', 'team', 'en', NOW(), NOW()),
  ('team_guri_bio', '', 'team', 'en', NOW(), NOW()),
  ('team_guri_image', '/team-guri.png', 'team', 'en', NOW(), NOW()),
  
  ('team_erion_name', 'Erion', 'team', 'en', NOW(), NOW()),
  ('team_erion_title', 'Manager', 'team', 'en', NOW(), NOW()),
  ('team_erion_bio', '', 'team', 'en', NOW(), NOW()),
  ('team_erion_image', '/team-erion.png', 'team', 'en', NOW(), NOW());

-- Step 3: Add Team Member Data (Albanian)
INSERT INTO web_content1 (key, content, section, language, updated_at, created_at)
VALUES 
  ('team_klest_name', 'Klest', 'team', 'al', NOW(), NOW()),
  ('team_klest_title', 'Themelues', 'team', 'al', NOW(), NOW()),
  ('team_klest_bio', '', 'team', 'al', NOW(), NOW()),
  ('team_klest_image', '/team-klest.png', 'team', 'al', NOW(), NOW()),
  
  ('team_guri_name', 'Guri', 'team', 'al', NOW(), NOW()),
  ('team_guri_title', 'Bashkë-Themelues', 'team', 'al', NOW(), NOW()),
  ('team_guri_bio', '', 'team', 'al', NOW(), NOW()),
  ('team_guri_image', '/team-guri.png', 'team', 'al', NOW(), NOW()),
  
  ('team_erion_name', 'Erion', 'team', 'al', NOW(), NOW()),
  ('team_erion_title', 'Menaxher', 'team', 'al', NOW(), NOW()),
  ('team_erion_bio', '', 'team', 'al', NOW(), NOW()),
  ('team_erion_image', '/team-erion.png', 'team', 'al', NOW(), NOW());

-- Step 4: Verify the data was inserted correctly
SELECT key, content, language FROM web_content1 
WHERE key LIKE 'team_%' 
ORDER BY language, key;
