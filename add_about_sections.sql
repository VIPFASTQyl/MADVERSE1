-- Add sample About sections to web_content1 table
-- English versions
INSERT INTO web_content1 (id, key, title, content, section, language, created_at, updated_at)
VALUES 
  (
    'about-mission-en',
    'about_mission_en',
    'Our Mission',
    'MADVERSE is dedicated to empowering local artists, athletes, and youth by creating collaborative spaces where talent can be freely expressed and sustainably developed. We build strong bridges between creators and the community, offering real opportunities for exposure, growth, and positive impact.',
    'about',
    'en',
    now(),
    now()
  ),
  (
    'about-vision-en',
    'about_vision_en',
    'Our Vision',
    'We envision a thriving community where creativity knows no boundaries. Through direct collaboration with local creatives across visual arts, music, performance, sports, and urban culture, we provide a platform where voices are valued, work is showcased, and experiences are shared with the public.',
    'about',
    'en',
    now(),
    now()
  ),
  (
    'about-values-en',
    'about_values_en',
    'Our Values',
    'We believe local talent deserves space, support, and visibility. We are committed to creating inclusive, sustainable, and innovative solutions that foster growth and celebrate diversity in our community.',
    'about',
    'en',
    now(),
    now()
  )
ON CONFLICT (key, language) DO NOTHING;

-- Albanian versions
INSERT INTO web_content1 (id, key, title, content, section, language, created_at, updated_at)
VALUES 
  (
    'about-mission-al',
    'about_mission_al',
    'Misioni Ynë',
    'MADVERSE është i përkushtuar në fuqizimin e artistëve, atletëve dhe të rinjve lokalë duke krijuar hapësira bashkëpunuese ku talenti mund të shprehet lirshëm dhe të zhvillohet në mënyrë të qëndrueshme. Ne ndërtojmë ura të forta midis krijuesve dhe komunitetit, duke ofruar mundësi të vërteta për ekspozim, rritje dhe ndikim pozitiv.',
    'about',
    'al',
    now(),
    now()
  ),
  (
    'about-vision-al',
    'about_vision_al',
    'Vizioni Ynë',
    'Ne përfytyrohemi një komunitet që lulëzon ku kreativiteti nuk njeh kufij. Përmes bashkëpunimit të drejtpërdrejtë me krijuesit e rinj në të gjithë artet vizuale, muzikën, performancën, sporet dhe kulturën urbane, ne ofrojmë një platformë ku zërat vlerësohen, puna shfaqet dhe përvojat ndahen me publikun.',
    'about',
    'al',
    now(),
    now()
  ),
  (
    'about-values-al',
    'about_values_al',
    'Vlerat Tona',
    'Besojmë se talenti lokal meriton hapësirë, mbështetje dhe dukshmëri. Ne jemi të përkushtuar në krijimin e zgjidhjeve inkluzive, të qëndrueshme dhe inovatare që nxisin rritjen dhe shënojnë diversitetin në komunitetin tonë.',
    'about',
    'al',
    now(),
    now()
  )
ON CONFLICT (key, language) DO NOTHING;
