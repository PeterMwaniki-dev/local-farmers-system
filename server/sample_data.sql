-- sample_data.sql
-- Sample data for demonstration and testing

USE local_farmers_db;

-- 
-- MARKET TRENDS DATA
-- 

INSERT INTO market_trends (produce_name, location, average_price, demand_level, supply_level, recorded_date) VALUES
('Tomatoes', 'Nairobi', 80.00, 'high', 'medium', '2026-02-01'),
('Tomatoes', 'Mombasa', 75.00, 'high', 'low', '2026-02-01'),
('Tomatoes', 'Kisumu', 70.00, 'medium', 'medium', '2026-02-01'),
('Cabbage', 'Nairobi', 40.00, 'medium', 'high', '2026-02-01'),
('Cabbage', 'Nakuru', 35.00, 'medium', 'high', '2026-02-01'),
('Kale (Sukuma Wiki)', 'Nairobi', 30.00, 'high', 'medium', '2026-02-01'),
('Kale (Sukuma Wiki)', 'Eldoret', 25.00, 'high', 'high', '2026-02-01'),
('Maize', 'Kitale', 45.00, 'high', 'low', '2026-02-01'),
('Maize', 'Nairobi', 50.00, 'high', 'low', '2026-02-01'),
('Beans', 'Meru', 120.00, 'medium', 'medium', '2026-02-01'),
('Beans', 'Nairobi', 130.00, 'medium', 'low', '2026-02-01'),
('Potatoes', 'Nairobi', 60.00, 'medium', 'medium', '2026-02-01'),
('Potatoes', 'Molo', 50.00, 'low', 'high', '2026-02-01'),
('Carrots', 'Nairobi', 70.00, 'medium', 'medium', '2026-02-01'),
('Onions', 'Nairobi', 90.00, 'high', 'low', '2026-02-01'),
('Onions', 'Mombasa', 95.00, 'high', 'low', '2026-02-01'),
('Spinach', 'Nairobi', 35.00, 'medium', 'medium', '2026-02-01'),
('Green Peppers', 'Nairobi', 100.00, 'high', 'low', '2026-02-01'),
('Mangoes', 'Mombasa', 80.00, 'high', 'medium', '2026-02-01'),
('Avocados', 'Nairobi', 15.00, 'high', 'medium', '2026-02-01');

-- Recent trends (last week)
INSERT INTO market_trends (produce_name, location, average_price, demand_level, supply_level, recorded_date) VALUES
('Tomatoes', 'Nairobi', 85.00, 'high', 'low', '2026-02-05'),
('Kale (Sukuma Wiki)', 'Nairobi', 32.00, 'high', 'medium', '2026-02-05'),
('Maize', 'Kitale', 48.00, 'high', 'low', '2026-02-05'),
('Onions', 'Nairobi', 95.00, 'high', 'low', '2026-02-05');

-- 
-- SAMPLE FORUM POSTS
-- 

-- Forum posts from different users
INSERT INTO forum_posts (user_id, title, content, category) VALUES
(7, 'Best time to plant maize in Rift Valley?', 'Hello fellow farmers! I am planning to plant maize this season. What is the best time to plant in the Rift Valley region? Any advice on preparation and seed varieties would be appreciated.', 'Questions & Help'),
(8, 'Looking for reliable tomato suppliers', 'My restaurant chain needs consistent supply of quality tomatoes. We can purchase 500kg weekly. Contact me if you can supply regularly.', 'Market Updates'),
(7, 'My success story: From 1 acre to 5 acres in 2 years', 'I want to share how I grew my farm from 1 acre to 5 acres using better farming techniques and connecting with buyers through this platform. Happy to answer questions!', 'Success Stories'),
(9, 'Dealing with tomato blight - my experience', 'I recently dealt with tomato blight on my farm. Here are the steps I took to save my crop and prevent future outbreaks. Early detection is key!', 'Tips & Tricks'),
(7, 'Best irrigation methods for small farms?', 'I have a 2-acre farm and want to install an irrigation system. What are the most cost-effective methods? Drip irrigation vs sprinklers?', 'Equipment & Tools');

-- 
-- SAMPLE FORUM COMMENTS
-- 

INSERT INTO forum_comments (post_id, user_id, comment_text) VALUES
(1, 9, 'The best time is during the long rains (March-May) or short rains (October-November). Make sure soil is well prepared and has good drainage.'),
(1, 7, 'I plant in April and harvest in August. Use certified seeds like DH04 or H614 for best yields.'),
(3, 8, 'Congratulations! What were the key factors that helped you expand?'),
(3, 9, 'Inspiring story! Did you get any financing or use your own savings?'),
(5, 9, 'Drip irrigation is more water-efficient and better for vegetables. Initial cost is higher but saves money long-term.');

-- 
-- SAMPLE ADVISORY POSTS (Additional)
-- 

-- Add more advisory posts for variety
INSERT INTO advisory_posts (expert_id, title, content, category, tags) VALUES
(9, 'Organic Pest Control Methods for Vegetable Farms', 
'Organic pest control is essential for sustainable farming. Here are effective methods:\n\n1. Companion Planting: Plant marigolds around tomatoes to repel aphids\n2. Neem Oil Spray: Mix neem oil with water and spray on affected plants\n3. Manual Removal: Regularly inspect and remove pests by hand\n4. Beneficial Insects: Encourage ladybugs and lacewings that eat harmful pests\n5. Crop Rotation: Prevents pest buildup in soil\n\nRemember, prevention is better than cure. Monitor your crops daily and act quickly when you spot pests.',
'Pest Control', 'organic, pests, vegetables'),

(9, 'Maximizing Yields in Small-Scale Farming', 
'Small-scale farmers can achieve excellent yields with proper techniques:\n\n1. Soil Testing: Know your soil nutrients and pH levels\n2. Proper Spacing: Don''t overcrowd plants\n3. Timely Weeding: Weeds compete for nutrients\n4. Mulching: Retains moisture and suppresses weeds\n5. Quality Seeds: Invest in certified seeds\n6. Fertilizer Application: Apply at the right time and quantity\n\nFocus on quality over quantity. Better to have a well-maintained small farm than a poorly managed large one.',
'Crop Management', 'yields, small-scale, productivity'),

(9, 'Water Management During Dry Seasons', 
'Water scarcity is a major challenge. Here''s how to manage:\n\n1. Drip Irrigation: Delivers water directly to roots, reduces wastage\n2. Mulching: Covers soil to reduce evaporation\n3. Water Harvesting: Collect and store rainwater in tanks\n4. Drought-Resistant Crops: Consider sorghum, millet during dry periods\n5. Proper Timing: Water early morning or late evening\n\nConserve every drop! Water is precious, especially during droughts.',
'Irrigation', 'water, drought, irrigation'),

(9, 'Post-Harvest Handling of Tomatoes', 
'Proper post-harvest handling reduces losses:\n\n1. Harvest at Right Stage: Pick when firm and starting to turn color\n2. Gentle Handling: Avoid bruising\n3. Proper Packaging: Use ventilated crates\n4. Temperature Control: Store in cool, shaded area\n5. Quick Marketing: Sell within 3-5 days for best prices\n6. Grading: Sort by size and quality\n\nUp to 40% of tomatoes can be lost post-harvest. Proper handling protects your investment!',
'Post-Harvest', 'tomatoes, post-harvest, storage');

-- 
-- COMPLETE MESSAGE
-- 

SELECT 'Sample data inserted successfully!' as Status;
SELECT COUNT(*) as 'Market Trends Added' FROM market_trends;
SELECT COUNT(*) as 'Forum Posts Added' FROM forum_posts;
SELECT COUNT(*) as 'Forum Comments Added' FROM forum_comments;
SELECT COUNT(*) as 'Advisory Posts Added' FROM advisory_posts;