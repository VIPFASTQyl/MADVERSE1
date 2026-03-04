-- =============================================
-- Add Guri Team Member Content
-- =============================================
-- Run this in your Supabase SQL Editor to add Guri to the team section

-- English version
INSERT INTO web_content1 (key, title, content, section, language)
VALUES 
  ('team_guri_name', NULL, 'Guri', 'team', 'en'),
  ('team_guri_title', NULL, 'asdasd', 'team', 'en'),
  ('team_guri_bio', NULL, '', 'team', 'en')
ON CONFLICT (key, language) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = NOW();

-- Albanian version
INSERT INTO web_content1 (key, title, content, section, language)
VALUES 
  ('team_guri_name', NULL, 'Guri', 'team', 'al'),
  ('team_guri_title', NULL, 'alskaksk', 'team', 'al'),
  ('team_guri_bio', NULL, '', 'team', 'al')
ON CONFLICT (key, language) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = NOW();

-- Verify the data was inserted
SELECT * FROM web_content1 WHERE key LIKE 'team_guri%' ORDER BY language;
