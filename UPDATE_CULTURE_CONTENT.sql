-- Update Culture/Arts/Youth content on HOME PAGE
-- English version
UPDATE web_content1 
SET content = 'Culture Arts Youth'
WHERE key = 'aboutHomeTitle' AND language = 'en';

UPDATE web_content1 
SET content = 'Our plan is to empower culture, arts, and youth in the city of Peja by creating space for expression, collaboration, and growth. Through creative events, community projects, and public experiences, MADVERSE aims to strengthen the cultural spirit of the city and give young people the platform they deserve.'
WHERE key = 'aboutHomeDescription' AND language = 'en';

-- Albanian version
UPDATE web_content1 
SET content = 'Kultur Art Rini'
WHERE key = 'aboutHomeTitle' AND language = 'al';

UPDATE web_content1 
SET content = 'Plani ynë është të fuqizojmë kulturën, artin dhe rininë në qytetin e Pejës duke krijuar hapësirë për shprehje, bashkëpunim dhe zhvillim. Përmes eventeve kreative, projekteve komunitare dhe eksperiencave publike, MADVERSE synon të forcojë shpirtin kulturor të qytetit dhe t''u japë të rinjve platformën që meritojnë.'
WHERE key = 'aboutHomeDescription' AND language = 'al';
