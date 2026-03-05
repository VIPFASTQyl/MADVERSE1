- ==============================================================
-- MADVERSE Custom Activity Image Updates
-- ==============================================================
-- Copy the appropriate queries and run them in Supabase SQL Editor

-- OPTION 1: Automatic naming (activity-{type}.png)
-- This will create image paths like: /activity-youth.png, /activity-arts.png
UPDATE activity_content 
SET image_url = '/activity-' || LOWER(activity_type) || '.png'
WHERE TRUE;

-- ============================================================
-- OPTION 2: Specific image per activity (Use this if you prefer)
-- Uncomment and modify the ones you want to use
-- ============================================================

-- UPDATE activity_content 
-- SET image_url = '/activity-youth.png'
-- WHERE activity_type = 'Youth';

-- UPDATE activity_content 
-- SET image_url = '/activity-arts.png'
-- WHERE activity_type = 'Arts';

-- UPDATE activity_content 
-- SET image_url = '/activity-culture.png'
-- WHERE activity_type = 'Culture';

-- UPDATE activity_content 
-- SET image_url = '/activity-sports.png'
-- WHERE activity_type = 'Sports';

-- UPDATE activity_content 
-- SET image_url = '/activity-exhibition.png'
-- WHERE activity_type = 'Exhibition';

-- UPDATE activity_content 
-- SET image_url = '/activity-volunteering.png'
-- WHERE activity_type = 'Volunteering';

-- ============================================================
-- VERIFICATION QUERIES (Run these to check your changes)
-- ============================================================

-- See all activities with their updated image paths
SELECT id, activity_type, item_name, image_url, language 
FROM activity_content 
ORDER BY activity_type, language;

-- Count activities by type
SELECT activity_type, COUNT(*) as count, image_url 
FROM activity_content 
GROUP BY activity_type, image_url;

-- Check for any NULL or empty image URLs
SELECT * FROM activity_content 
WHERE image_url IS NULL OR image_url = '';

-- ============================================================
-- ROLLBACK (If you need to revert changes)
-- ============================================================

-- Restore to original state (if needed):
-- UPDATE activity_content 
-- SET image_url = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
-- WHERE activity_type = 'Youth';

-- etc. for other types...
