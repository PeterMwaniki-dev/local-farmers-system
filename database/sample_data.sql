-- Sample Test Data for Local Farmers System

USE local_farmers_db;

-- Sample Users (password is 'password123' hashed with bcrypt)
-- You'll replace these hashes when you implement proper authentication
INSERT INTO users (full_name, email, phone_number, password_hash, user_type, location) VALUES
('John Kamau', 'john.kamau@example.com', '0712345678', '$2b$10$placeholder', 'farmer', 'Kiambu'),
('Dr. Mary Wanjiku', 'mary.wanjiku@example.com', '0723456789', '$2b$10$placeholder', 'expert', 'Nairobi'),
('David Ochieng', 'david.ochieng@example.com', '0734567890', '$2b$10$placeholder', 'buyer', 'Mombasa'),
('Peter Mwangi', 'peter.mwangi@example.com', '0745678901', '$2b$10$placeholder', 'farmer', 'Nakuru');

-- Sample Farmer Profiles
INSERT INTO farmer_profiles (user_id, farm_size, farm_location, main_crops, farming_experience) VALUES
(1, 5.5, 'Kiambu County', 'Maize, Beans, Potatoes', 10),
(4, 3.2, 'Nakuru County', 'Tomatoes, Kale, Carrots', 5);

-- Sample Expert Profile
INSERT INTO expert_profiles (user_id, specialization, qualification, years_of_experience, organization) VALUES
(2, 'Crop Science', 'PhD in Agricultural Sciences', 15, 'Kenya Agricultural Research Institute');

-- Sample Buyer Profile
INSERT INTO buyer_profiles (user_id, business_name, business_type, preferred_produce, delivery_location) VALUES
(3, 'Fresh Harvest Ltd', 'Wholesaler', 'Vegetables, Fruits', 'Mombasa');

-- Sample Produce Listings
INSERT INTO produce_listings (farmer_id, produce_name, category, quantity, unit, price_per_unit, available_from, available_until, description, quality_grade, location, status) VALUES
(1, 'Maize', 'Cereals', 500, 'kg', 45.00, '2026-01-15', '2026-02-15', 'Fresh maize from Kiambu', 'Grade A', 'Kiambu', 'available'),
(1, 'Potatoes', 'Vegetables', 300, 'kg', 60.00, '2026-01-20', '2026-02-20', 'Organic potatoes', 'Premium', 'Kiambu', 'available'),
(4, 'Tomatoes', 'Vegetables', 200, 'kg', 80.00, '2026-01-25', '2026-02-25', 'Fresh tomatoes', 'Grade A', 'Nakuru', 'available');

-- Sample Buyer Request
INSERT INTO buyer_requests (buyer_id, produce_needed, category, quantity_needed, unit, budget_per_unit, delivery_location, needed_by_date, description, status) VALUES
(3, 'Kale', 'Vegetables', 500, 'kg', 30.00, 'Mombasa', '2026-02-10', 'Need fresh kale for restaurant supply', 'open');

-- Sample Advisory Post
INSERT INTO advisory_posts (expert_id, title, content, category, tags) VALUES
(2, 'Best Practices for Maize Farming', 'Maize farming requires proper soil preparation and timely planting. Here are key tips: 1) Test your soil pH, 2) Use certified seeds, 3) Apply fertilizer at the right time...', 'Crop Management', 'maize,planting,fertilizer');

-- Sample Advisory Question
INSERT INTO advisory_questions (farmer_id, title, question_text, category, status) VALUES
(1, 'How to control pests on potatoes?', 'I am experiencing pest problems on my potato farm. What organic methods can I use?', 'Pest Control', 'open');

-- Sample Forum Post
INSERT INTO forum_posts (user_id, title, content, category) VALUES
(1, 'My experience with drip irrigation', 'I recently installed drip irrigation on my farm and the results have been amazing. Water consumption reduced by 40%...', 'Success Stories');