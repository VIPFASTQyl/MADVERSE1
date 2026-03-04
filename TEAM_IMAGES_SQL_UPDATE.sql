-- =====================================================
-- Update Team Member Images from URLs to Local PNG Files
-- =====================================================
-- Run this in your Supabase SQL Editor

-- Step 1: Update image URLs to local files in web_content1 table
-- Change from: https://images.unsplash.com/... 
-- Change to: /team-{member-name}.png

-- For English
UPDATE web_content1 
SET content = '/team-klest.png'
WHERE key = 'team_klest_image' AND language = 'en';

UPDATE web_content1 
SET content = '/team-guri.png'
WHERE key = 'team_guri_image' AND language = 'en';

UPDATE web_content1 
SET content = '/team-erion.png'
WHERE key = 'team_erion_image' AND language = 'en';

-- For Albanian
UPDATE web_content1 
SET content = '/team-klest.png'
WHERE key = 'team_klest_image' AND language = 'al';

UPDATE web_content1 
SET content = '/team-guri.png'
WHERE key = 'team_guri_image' AND language = 'al';

UPDATE web_content1 
SET content = '/team-erion.png'
WHERE key = 'team_erion_image' AND language = 'al';

-- Step 2: Verify the updates
SELECT key, content, language FROM web_content1 
WHERE key LIKE 'team_%_image' 
ORDER BY language, key;
