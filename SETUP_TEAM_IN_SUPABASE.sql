-- =====================================================
-- Add Team Member Image URLs to Supabase
-- =====================================================
-- Run this in your Supabase SQL Editor

-- Step 1: Delete existing team entries (if updating)
DELETE FROM web_content1 WHERE key LIKE 'team_%';

-- Step 2: Add Team Member Data (English)
INSERT INTO web_content1 (id, key, title, content, section, language, updated_at, created_at)
VALUES 
  (gen_random_uuid(), 'team_klest_name', 'Klest - Name', 'Klest', 'team', 'en', NOW(), NOW()),
  (gen_random_uuid(), 'team_klest_title', 'Klest - Title', 'Founder', 'team', 'en', NOW(), NOW()),
  (gen_random_uuid(), 'team_klest_bio', 'Klest - Bio', '', 'team', 'en', NOW(), NOW()),
  (gen_random_uuid(), 'team_klest_image', 'Klest - Image', '/team-klest.png', 'team', 'en', NOW(), NOW()),
  
  (gen_random_uuid(), 'team_guri_name', 'Guri - Name', 'Guri', 'team', 'en', NOW(), NOW()),
  (gen_random_uuid(), 'team_guri_title', 'Guri - Title', 'Co-Founder', 'team', 'en', NOW(), NOW()),
  (gen_random_uuid(), 'team_guri_bio', 'Guri - Bio', '', 'team', 'en', NOW(), NOW()),
  (gen_random_uuid(), 'team_guri_image', 'Guri - Image', '/team-guri.png', 'team', 'en', NOW(), NOW()),
  
  (gen_random_uuid(), 'team_erion_name', 'Erion - Name', 'Erion', 'team', 'en', NOW(), NOW()),
  (gen_random_uuid(), 'team_erion_title', 'Erion - Title', 'Manager', 'team', 'en', NOW(), NOW()),
  (gen_random_uuid(), 'team_erion_bio', 'Erion - Bio', '', 'team', 'en', NOW(), NOW()),
  (gen_random_uuid(), 'team_erion_image', 'Erion - Image', '/team-erion.png', 'team', 'en', NOW(), NOW());

-- Step 3: Add Team Member Data (Albanian)
INSERT INTO web_content1 (id, key, title, content, section, language, updated_at, created_at)
VALUES 
  (gen_random_uuid(), 'team_klest_name', 'Klest - Emër', 'Klest', 'team', 'al', NOW(), NOW()),
  (gen_random_uuid(), 'team_klest_title', 'Klest - Titull', 'Themelues', 'team', 'al', NOW(), NOW()),
  (gen_random_uuid(), 'team_klest_bio', 'Klest - Biografia', '', 'team', 'al', NOW(), NOW()),
  (gen_random_uuid(), 'team_klest_image', 'Klest - Fotografia', '/team-klest.png', 'team', 'al', NOW(), NOW()),
  
  (gen_random_uuid(), 'team_guri_name', 'Guri - Emër', 'Guri', 'team', 'al', NOW(), NOW()),
  (gen_random_uuid(), 'team_guri_title', 'Guri - Titull', 'Bashkë-Themelues', 'team', 'al', NOW(), NOW()),
  (gen_random_uuid(), 'team_guri_bio', 'Guri - Biografia', '', 'team', 'al', NOW(), NOW()),
  (gen_random_uuid(), 'team_guri_image', 'Guri - Fotografia', '/team-guri.png', 'team', 'al', NOW(), NOW()),
  
  (gen_random_uuid(), 'team_erion_name', 'Erion - Emër', 'Erion', 'team', 'al', NOW(), NOW()),
  (gen_random_uuid(), 'team_erion_title', 'Erion - Titull', 'Menaxher', 'team', 'al', NOW(), NOW()),
  (gen_random_uuid(), 'team_erion_bio', 'Erion - Biografia', '', 'team', 'al', NOW(), NOW()),
  (gen_random_uuid(), 'team_erion_image', 'Erion - Fotografia', '/team-erion.png', 'team', 'al', NOW(), NOW());

-- Step 4: Verify the data was inserted correctly
SELECT key, content, language FROM web_content1 
WHERE key LIKE 'team_%' 
ORDER BY language, key;
