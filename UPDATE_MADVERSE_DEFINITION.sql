-- Update MADVERSE definition content
-- English version
UPDATE web_content1 
SET content = 'MADVERSE is a creative movement born in Peja and powered by youth energy. It turns streets into canvases and ideas into culture through music, art, sport and raw expression. We do not wait for permission. We create space, build platforms and give a voice to those who see the world differently. MADVERSE is more than an event. It is a mindset.'
WHERE key = 'about_whatismadverse_desc_en' AND language = 'en';

-- Albanian version
UPDATE web_content1 
SET content = 'MADVERSE osht ni lëvizje kreative e lindun në Pejë dhe e shtyme prej energjisë së rinisë. I kthen rrugët në kanavacë dhe idetë në kulturë përmes muzikës, artit, sportit dhe shprehjes së lirë. Na nuk presim leje. Na krijojmë hapësirë, ndërtojmë platforma dhe i japim zë atyne që e shohin botën ndryshe. MADVERSE osht ma shumë se event. Osht mentalitet.'
WHERE key = 'about_whatismadverse_desc_al' AND language = 'al';
