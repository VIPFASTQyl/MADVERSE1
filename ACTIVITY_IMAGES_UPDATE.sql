-- ==============================================================
-- MADVERSE Activity Images - Update to Local File References
-- ==============================================================
-- This SQL script updates all activities to use local PNG files
-- Run this in your Supabase SQL Editor

-- Step 1: Update all activity image URLs to reference local PNG files
-- Format: /activity-{activity_type-in-lowercase}.png

UPDATE activity_content 
SET image_url = '/activity-' || LOWER(activity_type) || '.png'
WHERE image_url IS NOT NULL OR image_url != '';

-- Examples of what will be generated:
-- Youth activity -> /activity-youth.png
-- Arts activity -> /activity-arts.png
-- Culture activity -> /activity-culture.png
-- Sports activity -> /activity-sports.png
-- Exhibition activity -> /activity-exhibition.png
-- Volunteering activity -> /activity-volunteering.png

-- Verify the updates
SELECT DISTINCT activity_type, image_url FROM activity_content ORDER BY activity_type;

-- Optional: If you want different images per activity, use this mapping:
-- UPDATE activity_content SET image_url = '/activity-youth.png' WHERE activity_type = 'Youth';
-- UPDATE activity_content SET image_url = '/activity-arts.png' WHERE activity_type = 'Arts';
-- UPDATE activity_content SET image_url = '/activity-culture.png' WHERE activity_type = 'Culture';
-- UPDATE activity_content SET image_url = '/activity-sports.png' WHERE activity_type = 'Sports';
-- UPDATE activity_content SET image_url = '/activity-exhibition.png' WHERE activity_type = 'Exhibition';
-- UPDATE activity_content SET image_url = '/activity-volunteering.png' WHERE activity_type = 'Volunteering';
