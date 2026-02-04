-- Update About sections to match your actual website content
-- Delete old about sections (Mission, Vision, Values)
DELETE FROM web_content1 WHERE section = 'about';

-- Insert new about sections matching your website structure
-- English versions
INSERT INTO web_content1 (id, key, title, content, section, language, created_at, updated_at)
VALUES 
  ('about-whatismadverse-title-en', 'about_whatismadverse_title_en', 'What is Madverse - Title', 'What is MADVERSE?', 'about', 'en', now(), now()),
  ('about-whatismadverse-desc-en', 'about_whatismadverse_desc_en', 'What is Madverse - Description', 'MADVERSE is a cultural and community-driven platform dedicated to empowering local artists, athletes, and youth by creating collaborative spaces where talent can be freely expressed and sustainably developed.', 'about', 'en', now(), now()),
  ('about-feelculture-title-en', 'about_feelculture_title_en', 'Feel Culture - Title', 'Culture You Can Feel and Interact', 'about', 'en', now(), now()),
  ('about-feelculture-desc-en', 'about_feelculture_desc_en', 'Feel Culture - Description', 'From performances art installations to workshops and street culture, MADVERSE creates moments that connect people through raw creativity and expression.', 'about', 'en', now(), now())
ON CONFLICT (key, language) DO UPDATE SET content = EXCLUDED.content, updated_at = now();

-- Albanian versions
INSERT INTO web_content1 (id, key, title, content, section, language, created_at, updated_at)
VALUES 
  ('about-whatismadverse-title-al', 'about_whatismadverse_title_al', 'Çfarë është Madverse - Titulli', 'Çfarë është MADVERSE?', 'about', 'al', now(), now()),
  ('about-whatismadverse-desc-al', 'about_whatismadverse_desc_al', 'Çfarë është Madverse - Përshkrimi', 'MADVERSE është një platformë e drejtuar nga kultura dhe komuniteti e dedikuar për fuqizimin e artistëve, atletëve dhe të rinjve lokal.', 'about', 'al', now(), now()),
  ('about-feelculture-title-al', 'about_feelculture_title_al', 'Ndjeje Kulturën - Titulli', 'Kultura që Mund ta Ndienj dhe Ndërveprim', 'about', 'al', now(), now()),
  ('about-feelculture-desc-al', 'about_feelculture_desc_al', 'Ndjeje Kulturën - Përshkrimi', 'Nga performancat e instalimeve të artit deri në punëtori dhe kultura urbane, MADVERSE krijon momente që lidhin njerëzit përmes kreativitetit të papërpunuar dhe shprehjes.', 'about', 'al', now(), now())
ON CONFLICT (key, language) DO UPDATE SET content = EXCLUDED.content, updated_at = now();
