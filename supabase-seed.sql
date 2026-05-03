-- Wijhat Event-Link Seed Data
-- Run AFTER supabase-schema.sql
-- LEAP 2026 as example event, 10 realistic tours

-- ============================================
-- EVENT
-- ============================================
INSERT INTO events (slug, name, logo_url, primary_color, secondary_color, hero_image, start_date, end_date, is_active) VALUES
('leap-2026', 'LEAP 2026',
 'https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=200&fit=crop',
 '#1B4332', '#D4A574',
 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1600&h=600&fit=crop',
 '2026-02-09', '2026-02-12', true);

-- ============================================
-- 10 TOURS
-- ============================================
INSERT INTO tours (event_id, title, subtitle, description, highlights, duration_minutes, max_capacity, price_sar, category, sustainability_tags, images, inclusions, exclusions, meeting_point, difficulty, sort_order) VALUES

-- 1. Riyadh City Highlights
((SELECT id FROM events WHERE slug = 'leap-2026'),
 'Riyadh City Highlights', 'Discover the vibrant capital',
 'Discover the vibrant capital of Saudi Arabia on this guided city tour. Visit the iconic Kingdom Centre Tower with its sky bridge, explore the historic Masmak Fortress where the Kingdom was founded, stroll through the bustling Al-Bathaa district, and marvel at the futuristic architecture of the King Abdullah Financial District. Your bilingual guide brings centuries of history to life while showcasing Riyadh''s rapid transformation into a global metropolis.',
 ARRAY['Kingdom Centre sky bridge visit', 'Masmak Fortress guided tour', 'Al-Bathaa heritage walk', 'King Abdullah Financial District', 'Bilingual guide throughout'],
 180, 25, 350.00, 'cultural',
 ARRAY['eco-transport', 'local-community'],
 ARRAY['https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1597655601841-214a4cfe8b2c?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1567157577867-05ccb1388e12?w=800&h=500&fit=crop'],
 ARRAY['Hotel pickup & drop-off', 'Professional bilingual guide', 'All entrance fees', 'Bottled water', 'Traditional Arabic coffee & dates'],
 ARRAY['Personal expenses', 'Meals', 'Gratuities'],
 'Hotel lobby — specific details sent after booking', 'easy', 1),

-- 2. Diriyah Heritage Experience
((SELECT id FROM events WHERE slug = 'leap-2026'),
 'Diriyah Heritage Experience', 'Walk through the birthplace of Saudi Arabia',
 'Step back in time at the UNESCO World Heritage site of At-Turaif in Diriyah, the historic capital of the First Saudi State. Walk through meticulously restored mud-brick palaces that tell the story of the Kingdom''s founding, explore the winding alleyways of the old city, and experience authentic Saudi hospitality with Arabic coffee and dates in a traditional setting. This immersive journey connects you to the roots of modern Saudi Arabia.',
 ARRAY['UNESCO At-Turaif district', 'Restored mud-brick palaces', 'Traditional Saudi hospitality', 'Diriyah Gate plaza', 'Historical narrative walkthrough'],
 240, 20, 450.00, 'heritage',
 ARRAY['local-community', 'carbon-neutral'],
 ARRAY['https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1548820394-d7fb3e0a65c9?w=800&h=500&fit=crop'],
 ARRAY['Round-trip transportation', 'Expert heritage guide', 'All entrance fees', 'Traditional coffee & dates experience', 'Souvenir booklet'],
 ARRAY['Meals', 'Personal purchases', 'Photography fees at select venues'],
 'Diriyah Gate parking area', 'easy', 2),

-- 3. AlUla Day Expedition
((SELECT id FROM events WHERE slug = 'leap-2026'),
 'AlUla Day Expedition', 'Ancient wonders in the desert',
 'Fly to the breathtaking landscapes of AlUla, home to Hegra — Saudi Arabia''s first UNESCO World Heritage site. Explore ancient Nabataean tombs carved into rose-red sandstone cliffs, visit the iconic Elephant Rock formation, walk through the ancient Oasis of AlUla, and enjoy a curated lunch at a premium local restaurant. This full-day expedition from Riyadh reveals one of the world''s most extraordinary archaeological landscapes.',
 ARRAY['Hegra UNESCO site & Nabataean tombs', 'Elephant Rock formation', 'AlUla Old Town walking tour', 'Curated lunch at premium restaurant', 'Round-trip domestic flights'],
 720, 15, 2800.00, 'adventure',
 ARRAY['eco-transport'],
 ARRAY['https://images.unsplash.com/photo-1579606032821-4e6161c81571?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1548820394-d7fb3e0a65c9?w=800&h=500&fit=crop'],
 ARRAY['Round-trip domestic flights (Riyadh–AlUla)', 'All ground transportation', 'Expert archaeologist guide', 'All entrance fees', 'Premium lunch', 'Refreshments throughout'],
 ARRAY['Travel insurance', 'Dinner', 'Personal expenses', 'Souvenir purchases'],
 'Riyadh King Khalid International Airport, Terminal 5', 'moderate', 3),

-- 4. Desert Safari & Stargazing
((SELECT id FROM events WHERE slug = 'leap-2026'),
 'Desert Safari & Stargazing', 'Dunes, dinner, and desert skies',
 'Experience the magic of the Arabian desert with an exhilarating 4x4 dune bashing session across the red sands outside Riyadh. As the sun sets, enjoy a serene camel ride along the dune crests, then settle into a traditional Bedouin-style camp for a feast of grilled meats, rice, and Arabic sweets under a blanket of stars. The evening concludes with stargazing through a professional telescope and live oud music around the fire.',
 ARRAY['4x4 dune bashing adventure', 'Sunset camel ride', 'Traditional Bedouin dinner', 'Live oud music', 'Professional telescope stargazing'],
 360, 30, 550.00, 'adventure',
 ARRAY['eco-transport', 'local-community'],
 ARRAY['https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=500&fit=crop'],
 ARRAY['Round-trip desert transport', 'Dune bashing (4x4)', 'Camel ride', 'Full Bedouin dinner', 'Shisha', 'Soft drinks & water', 'Stargazing with telescope', 'Live music'],
 ARRAY['Alcoholic beverages', 'Personal expenses', 'Photography packages'],
 'Hotel lobby — pickup at 2:30 PM', 'moderate', 4),

-- 5. Saudi Culinary Journey
((SELECT id FROM events WHERE slug = 'leap-2026'),
 'Saudi Culinary Journey', 'Taste the real flavors of Saudi Arabia',
 'Embark on a gastronomic adventure through Riyadh''s authentic dining scene. Start at a local spice market where you''ll learn about the aromatics that define Saudi cuisine, then visit three iconic restaurants to sample Najdi specialties including Kabsa, Matazeez, and Jareesh. The experience culminates in a hands-on cooking class with a renowned Saudi chef, where you''ll prepare (and eat) your own traditional dishes. Leave with recipes and a new appreciation for Saudi culinary heritage.',
 ARRAY['Local spice market tour', 'Three restaurant tastings', 'Hands-on cooking class', 'Professional Saudi chef instruction', 'Recipe booklet to take home'],
 270, 15, 400.00, 'culinary',
 ARRAY['local-community'],
 ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop'],
 ARRAY['All food tastings & beverages', 'Cooking class with chef', 'Spice market tour', 'Recipe booklet', 'Transportation between venues', 'Apron to keep'],
 ARRAY['Alcoholic beverages', 'Additional food purchases', 'Gratuities'],
 'Al-Bathaa district, near spice market entrance', 'easy', 5),

-- 6. Edge of the World Expedition
((SELECT id FROM events WHERE slug = 'leap-2026'),
 'Edge of the World Expedition', 'Stand at the rim of an ancient ocean',
 'Journey to Jebel Fihrayn, famously known as the Edge of the World — one of Saudi Arabia''s most dramatic natural wonders. This towering escarpment offers panoramic views of the vast desert plains below, once the floor of a prehistoric ocean. The guided trek includes fossil hunting, wildlife spotting (look for ibex and eagles), and a scenic picnic lunch perched on the cliff edge. A truly unforgettable experience for nature lovers and photographers.',
 ARRAY['Jebel Fihrayn (Edge of the World)', 'Panoramic cliff-edge views', 'Fossil hunting', 'Wildlife spotting', 'Scenic cliff-edge picnic'],
 300, 16, 600.00, 'adventure',
 ARRAY['eco-transport', 'carbon-neutral'],
 ARRAY['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop'],
 ARRAY['Round-trip 4x4 transport', 'Expert desert guide', 'Picnic lunch & refreshments', 'Binoculars for wildlife spotting', 'First aid kit'],
 ARRAY['Gratuities', 'Personal expenses', 'Professional photography'],
 'Designated pickup point — sent after booking', 'challenging', 6),

-- 7. Riyadh Art & Culture Trail
((SELECT id FROM events WHERE slug = 'leap-2026'),
 'Riyadh Art & Culture Trail', 'From ancient artifacts to contemporary galleries',
 'Explore Riyadh''s flourishing art scene on this curated cultural trail. Visit the National Museum to see artifacts spanning millennia of Arabian history, explore the King Abdulaziz Center for National Dialogue''s exhibitions, discover contemporary Saudi artists at local galleries, and end with a visit to the vibrant Boulevard Riyadh art installations. Perfect for art enthusiasts and cultural explorers wanting to understand Saudi Arabia''s creative renaissance.',
 ARRAY['National Museum guided tour', 'Contemporary gallery visits', 'Boulevard Riyadh art installations', 'Artist meet-and-greet (when available)', 'Cultural commentary throughout'],
 240, 20, 280.00, 'cultural',
 ARRAY['local-community'],
 ARRAY['https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&h=500&fit=crop'],
 ARRAY['Museum entrance fees', 'Professional art guide', 'Transportation between venues', 'Welcome coffee', 'Art trail map'],
 ARRAY['Meals', 'Personal art purchases', 'Gratuities'],
 'National Museum main entrance', 'easy', 7),

-- 8. Green Riyadh Sustainability Tour
((SELECT id FROM events WHERE slug = 'leap-2026'),
 'Green Riyadh Sustainability Tour', 'The future is being built now',
 'Explore Saudi Arabia''s ambitious vision for a sustainable future. Visit the King Salman Park construction site (one of the world''s largest urban parks), tour an innovative vertical farm using cutting-edge hydroponics, learn about the Saudi Green Initiative''s goals to plant 10 billion trees, and see how Riyadh is transforming into a sustainable metropolis. Includes a workshop where you''ll build your own mini terrarium to take home.',
 ARRAY['King Salman Park overview', 'Vertical farm tour', 'Saudi Green Initiative briefing', 'Sustainability workshop', 'Mini terrarium to keep'],
 180, 20, 300.00, 'sustainability',
 ARRAY['eco-transport', 'local-community', 'carbon-neutral'],
 ARRAY['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&h=500&fit=crop'],
 ARRAY['Electric vehicle transport', 'Expert sustainability guide', 'All entrance fees', 'Workshop materials & terrarium', 'Refreshments', 'Information pack'],
 ARRAY['Meals', 'Personal purchases'],
 'Central Riyadh — sent after booking', 'easy', 8),

-- 9. Souq & Shopping Experience
((SELECT id FROM events WHERE slug = 'leap-2026'),
 'Souq & Shopping Experience', 'Navigate Riyadh''s traditional markets',
 'Dive into the sensory overload of Riyadh''s legendary souqs. Your guide leads you through Souq Al-Zal, the famous antique and curio market where generations of collectors have found treasures. Browse handcrafted perfumes and oud at Souq Al-Attar, explore the gold market''s dazzling displays, hunt for traditional garments and accessories, and learn the art of haggling Saudi-style. Includes a traditional lunch at a beloved local eatery.',
 ARRAY['Souq Al-Zal antiques market', 'Souq Al-Attar perfumes & oud', 'Gold market visit', 'Traditional garment browsing', 'Haggling tips from a local expert'],
 210, 20, 250.00, 'cultural',
 ARRAY['local-community'],
 ARRAY['https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&h=500&fit=crop'],
 ARRAY['Expert local guide', 'Traditional lunch', 'Welcome Arabic coffee', 'Souq navigation map', 'Shopping bag'],
 ARRAY['Personal purchases', 'Gratuities', 'Additional food & drinks'],
 'Deera Square area — sent after booking', 'easy', 9),

-- 10. LEAP Conference VIP Add-On
((SELECT id FROM events WHERE slug = 'leap-2026'),
 'LEAP Conference VIP Add-On', 'Maximize your LEAP experience',
 'Make the most of your LEAP attendance with this exclusive add-on package. Includes priority fast-track entry to the conference, a dedicated concierge for the day, reserved seating at 3 keynote sessions of your choice, access to the VIP networking lounge with complimentary refreshments, a guided tour of the innovation showcase floor highlighting the top 20 startups, and an evening networking mixer with conference speakers and investors. The perfect way to turn attendance into opportunity.',
 ARRAY['Priority fast-track LEAP entry', 'Dedicated day concierge', 'Reserved keynote seating (3 sessions)', 'VIP networking lounge access', 'Curated startup showcase tour', 'Evening networking mixer'],
 480, 10, 1200.00, 'business',
 ARRAY['local-community'],
 ARRAY['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=500&fit=crop'],
 ARRAY['LEAP day pass (must have own ticket)', 'Dedicated concierge', 'VIP lounge access', 'Keynote reserved seating', 'Networking mixer invitation', 'Refreshments throughout'],
 ARRAY['LEAP conference ticket', 'Transportation', 'Accommodation', 'Additional meals'],
 'LEAP venue main entrance — concierge meets you there', 'easy', 10);

-- ============================================
-- TIME SLOTS (Feb 9-12, 2026)
-- ============================================

-- Tour 1: Riyadh City Highlights — morning & afternoon
INSERT INTO tour_slots (tour_id, date, start_time, end_time, available_seats, is_open)
SELECT t.id, d::date, '09:00'::time, '12:00'::time, 25, true
FROM tours t, generate_series('2026-02-09'::date, '2026-02-12'::date, '1 day'::interval) d
WHERE t.title = 'Riyadh City Highlights';

INSERT INTO tour_slots (tour_id, date, start_time, end_time, available_seats, is_open)
SELECT t.id, d::date, '14:00'::time, '17:00'::time, 25, true
FROM tours t, generate_series('2026-02-09'::date, '2026-02-12'::date, '1 day'::interval) d
WHERE t.title = 'Riyadh City Highlights';

-- Tour 2: Diriyah Heritage — morning
INSERT INTO tour_slots (tour_id, date, start_time, end_time, available_seats, is_open)
SELECT t.id, d::date, '08:00'::time, '12:00'::time, 20, true
FROM tours t, generate_series('2026-02-09'::date, '2026-02-12'::date, '1 day'::interval) d
WHERE t.title = 'Diriyah Heritage Experience';

-- Tour 3: AlUla — full day (limited to 3 days)
INSERT INTO tour_slots (tour_id, date, start_time, end_time, available_seats, is_open)
SELECT t.id, d::date, '06:00'::time, '18:00'::time, 15, true
FROM tours t, generate_series('2026-02-09'::date, '2026-02-11'::date, '1 day'::interval) d
WHERE t.title = 'AlUla Day Expedition';

-- Tour 4: Desert Safari — afternoon/evening
INSERT INTO tour_slots (tour_id, date, start_time, end_time, available_seats, is_open)
SELECT t.id, d::date, '15:00'::time, '21:00'::time, 30, true
FROM tours t, generate_series('2026-02-09'::date, '2026-02-12'::date, '1 day'::interval) d
WHERE t.title = 'Desert Safari & Stargazing';

-- Tour 5: Culinary Journey — late morning
INSERT INTO tour_slots (tour_id, date, start_time, end_time, available_seats, is_open)
SELECT t.id, d::date, '11:00'::time, '15:30'::time, 15, true
FROM tours t, generate_series('2026-02-09'::date, '2026-02-12'::date, '1 day'::interval) d
WHERE t.title = 'Saudi Culinary Journey';

-- Tour 6: Edge of the World — early morning
INSERT INTO tour_slots (tour_id, date, start_time, end_time, available_seats, is_open)
SELECT t.id, d::date, '06:30'::time, '11:30'::time, 16, true
FROM tours t, generate_series('2026-02-09'::date, '2026-02-12'::date, '1 day'::interval) d
WHERE t.title = 'Edge of the World Expedition';

-- Tour 7: Art & Culture Trail — morning
INSERT INTO tour_slots (tour_id, date, start_time, end_time, available_seats, is_open)
SELECT t.id, d::date, '09:30'::time, '13:30'::time, 20, true
FROM tours t, generate_series('2026-02-09'::date, '2026-02-12'::date, '1 day'::interval) d
WHERE t.title = 'Riyadh Art & Culture Trail';

-- Tour 8: Sustainability Tour — morning
INSERT INTO tour_slots (tour_id, date, start_time, end_time, available_seats, is_open)
SELECT t.id, d::date, '09:00'::time, '12:00'::time, 20, true
FROM tours t, generate_series('2026-02-09'::date, '2026-02-12'::date, '1 day'::interval) d
WHERE t.title = 'Green Riyadh Sustainability Tour';

-- Tour 9: Souq Experience — late morning
INSERT INTO tour_slots (tour_id, date, start_time, end_time, available_seats, is_open)
SELECT t.id, d::date, '10:00'::time, '13:30'::time, 20, true
FROM tours t, generate_series('2026-02-09'::date, '2026-02-12'::date, '1 day'::interval) d
WHERE t.title = 'Souq & Shopping Experience';

-- Tour 10: LEAP VIP — full conference day
INSERT INTO tour_slots (tour_id, date, start_time, end_time, available_seats, is_open)
SELECT t.id, d::date, '08:00'::time, '20:00'::time, 10, true
FROM tours t, generate_series('2026-02-09'::date, '2026-02-12'::date, '1 day'::interval) d
WHERE t.title = 'LEAP Conference VIP Add-On';
