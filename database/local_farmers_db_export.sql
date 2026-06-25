-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: local_farmers_db
-- ------------------------------------------------------
-- Server version	8.0.46-0ubuntu0.24.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `advisory_posts`
--

DROP TABLE IF EXISTS `advisory_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `advisory_posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `expert_id` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `category` varchar(50) DEFAULT NULL COMMENT 'e.g., Pest Control, Fertilization, Planting',
  `tags` varchar(255) DEFAULT NULL COMMENT 'Comma-separated tags for searchability',
  `image_url` varchar(255) DEFAULT NULL,
  `views_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`),
  KEY `expert_id` (`expert_id`),
  KEY `idx_category` (`category`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `advisory_posts_ibfk_1` FOREIGN KEY (`expert_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `advisory_posts`
--

LOCK TABLES `advisory_posts` WRITE;
/*!40000 ALTER TABLE `advisory_posts` DISABLE KEYS */;
INSERT INTO `advisory_posts` VALUES (1,2,'Best Practices for Maize Farming','Maize farming requires proper soil preparation and timely planting. Here are key tips: 1) Test your soil pH, 2) Use certified seeds, 3) Apply fertilizer at the right time...','Crop Management','maize,planting,fertilizer',NULL,1,'2026-05-11 13:16:04','2026-06-10 10:22:16'),(2,31,'The Living Foundation: Why Soil Health is Your Farm’s Most Valuable Asset','Whether you are managing a large-scale operation or a local community garden, your success is rooted in what lies beneath the surface. For too long, soil has been treated as a mere medium for holding plants upright—a substrate to be manipulated with chemistry. In reality, soil is a biological engine. When that engine is tuned, productivity follows naturally.\n\nUnderstanding soil health requires looking at it through three interconnected lenses: physical structure, chemical balance, and biological vitality.\n1. The Physical: Protecting the Architecture\n\nGood soil should be \"crumbly,\" like a chocolate cake. This structure, or aggregation, allows for two things: Infiltration and Aeration.\n\n    The Risk: Heavy machinery and over-tilling collapse these pores, leading to compaction. When it rains, water sits on top rather than sinking in, leading to runoff and erosion.\n\n    The Fix: Minimize soil disturbance. Every time you turn the soil, you break up the \"highways\" that roots and water use to move.\n\n2. The Biological: The Underground Workforce\n\nHealthy soil is teeming with life—bacteria, fungi, protozoa, and earthworms. These organisms are responsible for nutrient cycling.\n\n    The Mycorrhizal Connection: Certain fungi form symbiotic relationships with roots, effectively extending the root system\'s reach to find phosphorus and water.\n\n    The Fix: Keep a living root in the ground as often as possible. Cover crops act as a \"solar panel,\" pumping carbon (in the form of root exudates) into the soil to feed these microbes during the off-season.\n\n3. The Chemical: Beyond N-P-K\n\nWhile Nitrogen (N), Phosphorus (P), and Potassium (K) are the big three, soil health is also about pH and micronutrients.\n\n    The pH Gatekeeper: If your soil is too acidic or too alkaline, nutrients become \"locked\" and unavailable to the plant, no matter how much fertilizer you apply.\n\n    The Fix: Regular testing is non-negotiable. Don\'t guess—measure. Focus on increasing Soil Organic Matter (SOM). For every 1% increase in SOM, the soil can hold thousands of additional gallons of water per acre.\n\nActionable Steps for the Season\n\n    Diversify Your Rotation: Monocultures deplete specific nutrients and allow pests to thrive. Rotating crops breaks these cycles.\n\n    Armour the Soil: Use mulch or crop residues to protect the surface from the \"hammering\" effect of raindrops and the intense heat of the sun.\n\n    Integrate Organic Matter: Compost and manure are not just fertilizers; they are inoculants that bring beneficial biology back to the land.\n\nThe Bottom Line: We don\'t \"grow\" plants; we create the environment where plants can grow. Invest in your soil today, and it will sustain your yields for generations to come.','Soil Health',NULL,NULL,1,'2026-05-11 13:49:36','2026-06-10 10:22:06'),(3,37,'Soil Health: Decoding the 3:1 Dynamic','Maintaining a balanced soil structure is the foundation of any high-yielding crop cycle. When soil is over-tilled, it degrades the organic matter and destroys the natural pathways built by beneficial soil organisms. To ensure your roots have the strength to anchor and pull nutrients, shift toward conservation tillage or no-till practices. This keeps your soil compact enough to prevent erosion but loose enough for deep root penetration.\n\nThe easiest way to check your soil\'s health in the field is the drainage test. Healthy soil should maintain roughly a 3:1 ratio of water retention to active drainage, ensuring roots stay hydrated without sitting in anaerobic, waterlogged zones. If your fields are holding pools of water for more than 24 hours after rainfall, it is time to integrate deep-rooting cover crops like radish or alfalfa to naturally break up subsoil compaction.','Soil Health',NULL,NULL,0,'2026-06-14 08:59:01','2026-06-14 08:59:01'),(4,37,'Integrated Pest Management (IPM): The Economic Threshold','Reaching for a chemical spray at the first sign of an insect can backfire by wiping out natural predators and driving pest resistance. Instead, practice Integrated Pest Management (IPM) by treating chemical applications as a strict last resort. Focus first on cultural controls like strategic crop rotation and physical barriers, alongside biological controls that introduce or protect beneficial insects like ladybugs and lacewings.\n\nThe true trigger for any intervention should always be the economic threshold. This is the point where the cost of pest damage exceeds the cost of applying a control measure. Dedicate time each week to scouting your fields in a regular \"W\" pattern, counting the pest population per plant. Only deploy targeted, narrow-spectrum treatments when those numbers cross your regional threshold, saving input costs while protecting the local ecosystem.','Pest Control','Pests',NULL,0,'2026-06-14 09:00:07','2026-06-14 09:00:07'),(5,37,'Nutrient Synchronization: Base vs. Top-Dressing','Applying all your fertilizer at the time of planting is highly inefficient, as it leads to heavy nutrient leaching before the plants are mature enough to absorb it. For major cereal crops like corn or wheat, implement a split-application strategy. Apply a modest starter base of phosphorus and potassium during seeding to fuel early root development, but hold back the bulk of your nitrogen until the vegetative growth spurts hit.\n\nTiming your nitrogen top-dressing with maximum vegetative expansion ensures the plant channels that nutrition directly into biomass and yield components. For optimal efficiency, apply top-dressing when the soil is moist but right before a light rain is expected. Avoid applying right before heavy downpours, which wash your investment away into local waterways, or during intense heat, which causes nitrogen to volatilize into the air as waste gas.','Crop Management',NULL,NULL,0,'2026-06-14 09:01:09','2026-06-14 09:01:09'),(6,37,'Moisture Management: The Crucial Milk Stage','While crops require steady hydration throughout their lifespan, their sensitivity to water stress peaks drastically during the reproductive phases. For grain and cereal crops, the \"milk stage\"—when the young kernels fill with a white, milky starch—is the ultimate make-or-break window. Drought stress during this brief period can irreversibly shrivel your grains, cutting your final harvest weight by up to 40%.\n\nMonitor your soil moisture closely as the crop transitions from flowering to grain fill. If you are managing an irrigation system, prioritize water distribution to these fields even if it means rationing vegetative-stage crops nearby. Ensuring uniform, adequate soil moisture during this timeframe directly secures high seed weight and optimal crop quality.','Soil Health',NULL,NULL,0,'2026-06-14 09:02:07','2026-06-14 09:02:07'),(7,37,'Crop Rotation: Breaking the Host Lifecycle','Planting the exact same crop family in the same soil year after year creates an open invitation for specialized pests and pathogens to thrive. Over consecutive seasons, their populations build exponentially in the soil debris, making each harvest harder to protect. Breaking this chain requires a strict three-to-four-year crop rotation plan that mixes entirely different plant families.\n\nWhen you follow a heavy feeder like maize with a legume like soybeans or groundnuts, you achieve a dual benefit. First, you starve out the specific root parasites and fungi that rely on the maize host. Second, the legumes work with soil bacteria to fix atmospheric nitrogen, naturally rejuvenating the soil\'s fertility and significantly lowering your synthetic fertilizer bills for the next season\'s crop.','Crop Management',NULL,NULL,0,'2026-06-14 09:02:45','2026-06-14 09:02:45'),(8,37,'Seed Selection: Looking Beyond Yield','It is easy to get caught up choosing seed varieties purely based on their maximum potential yield, but that top-tier number only happens under flawless greenhouse conditions. In the real world, climate variability, unpredictable rainfall, and local disease pressures will test your fields. When evaluating certified seed tags, give equal weight to specific resistance traits, such as drought tolerance or resistance to local fungal blights.\n\nA variety with a slightly lower peak yield that features high disease resistance will consistently outperform a high-yield, sensitive variety during a tough weather season. Always purchase certified seeds from verified distributors to guarantee high germination rates (above 85%) and to ensure your fields start completely free from seed-borne pathogens and noxious weed contamination.','Post-Harvest',NULL,NULL,1,'2026-06-14 09:03:37','2026-06-15 06:05:18'),(9,31,'Soil pH Optimization: Balancing the Chemical Foundation','Soil pH is the master switch controlling nutrient availability for your crops. When soil becomes too acidic (below 6.0) or too alkaline (above 7.5), essential elements like phosphorus, calcium, and magnesium become chemically locked in the soil matrix, making it impossible for roots to absorb them no matter how much fertilizer you apply. For highly acidic soils, applying agricultural lime (calcium carbonate) neutralizes acidity, while elemental sulfur can be used to gradually lower the pH of alkaline soils.\n\nBecause changing soil chemistry takes time, these corrections should be made well ahead of planting—ideally during the off-season or ahead of autumn tillage. Always base your application rates on a professional lab soil test rather than guesswork. Applying lime or sulfur requires months to react thoroughly with soil particles, so early management ensures a stable, highly fertile root zone by the time your seeds germinate.','Soil Health',NULL,NULL,0,'2026-06-14 09:05:56','2026-06-14 09:05:56'),(10,31,'Managing Soil Organic Matter (SOM): The Ultimate Sponge','Soil Organic Matter (SOM) makes up only a tiny fraction of total soil weight, but it dictates everything from water retention to microbial life. Every 1% increase in SOM allows an acre of land to hold roughly 20,000 gallons of additional water, serving as a critical safety buffer during unexpected dry spells. Intensely cultivated soils rapidly lose this organic matter as oxygen exposure speeds up decomposition, leaving the ground prone to hard crusting and rapid moisture loss.\n\nTo aggressively build and protect your SOM, minimize aggressive tillage and consistently return crop residues back to the field. Integrating green manures—crops grown specifically to be plowed under while still green—and applying well-rotted livestock manure injects raw carbon directly into the system. This feeds the underground ecosystem of earthworms and beneficial fungi, creating a resilient, spongy soil structure that holds both water and nutrients tightly.','Crop Management',NULL,NULL,0,'2026-06-14 09:06:38','2026-06-14 09:06:38'),(11,31,'Subsoil Compaction: Breaking the Invisible Barrier','While surface soil often looks loose and inviting, heavy machinery traffic and repeated plowing at the exact same depth create a dense, impervious layer just beneath the surface known as a plow pan. This compacted subsoil acts like concrete, physically blocking roots from growing deep into the earth and cutting them off from deep-water reserves. During heavy rains, water cannot drain past this hardpan layer, causing the topsoil to saturate, pool, and suffocate plant roots in anaerobic conditions.\n\nRemediating deep subsoil compaction requires a combination of mechanical intervention and biological engineering. In severely restricted fields, utilizing a mechanical subsoiler or \"ripper\" during dry conditions can physically shatter the hardpan without flipping the soil layers. Follow this up immediately by planting deep-rooting cover crops, such as daikon radish or sweet clover, whose aggressive taproots punch through the newly loosened channels, naturally maintaining open pathways for future crop root systems.','Soil Health',NULL,NULL,1,'2026-06-14 09:07:16','2026-06-15 06:50:12'),(12,37,'Best practices for dairy farming','Cowgzygdsggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg','Livestock',NULL,NULL,0,'2026-06-15 06:54:00','2026-06-15 06:54:00');
/*!40000 ALTER TABLE `advisory_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `advisory_questions`
--

DROP TABLE IF EXISTS `advisory_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `advisory_questions` (
  `question_id` int NOT NULL AUTO_INCREMENT,
  `farmer_id` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `question_text` text NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `status` enum('open','answered','closed') DEFAULT 'open',
  `views_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`question_id`),
  KEY `farmer_id` (`farmer_id`),
  KEY `idx_status` (`status`),
  KEY `idx_category` (`category`),
  CONSTRAINT `advisory_questions_ibfk_1` FOREIGN KEY (`farmer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `advisory_questions`
--

LOCK TABLES `advisory_questions` WRITE;
/*!40000 ALTER TABLE `advisory_questions` DISABLE KEYS */;
INSERT INTO `advisory_questions` VALUES (1,1,'How to control pests on potatoes?','I am experiencing pest problems on my potato farm. What organic methods can I use?','Pest Control','open',0,'2026-05-11 13:16:04');
/*!40000 ALTER TABLE `advisory_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `advisory_responses`
--

DROP TABLE IF EXISTS `advisory_responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `advisory_responses` (
  `response_id` int NOT NULL AUTO_INCREMENT,
  `question_id` int NOT NULL,
  `expert_id` int NOT NULL,
  `response_text` text NOT NULL,
  `is_helpful` tinyint(1) DEFAULT NULL COMMENT 'Farmer can mark if helpful',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`response_id`),
  KEY `expert_id` (`expert_id`),
  KEY `idx_question_id` (`question_id`),
  CONSTRAINT `advisory_responses_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `advisory_questions` (`question_id`) ON DELETE CASCADE,
  CONSTRAINT `advisory_responses_ibfk_2` FOREIGN KEY (`expert_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `advisory_responses`
--

LOCK TABLES `advisory_responses` WRITE;
/*!40000 ALTER TABLE `advisory_responses` DISABLE KEYS */;
/*!40000 ALTER TABLE `advisory_responses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buyer_profiles`
--

DROP TABLE IF EXISTS `buyer_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buyer_profiles` (
  `profile_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `business_name` varchar(150) DEFAULT NULL,
  `business_type` varchar(100) DEFAULT NULL COMMENT 'e.g., Retailer, Wholesaler, Restaurant',
  `preferred_produce` text COMMENT 'Comma-separated list of produce types',
  `delivery_location` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`profile_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `buyer_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buyer_profiles`
--

LOCK TABLES `buyer_profiles` WRITE;
/*!40000 ALTER TABLE `buyer_profiles` DISABLE KEYS */;
INSERT INTO `buyer_profiles` VALUES (1,3,'Fresh Harvest Ltd','Wholesaler','Vegetables, Fruits','Mombasa','2026-05-11 13:16:04'),(2,16,'FreshLink David Omondi','Retailer','Vegetables, Fruits','Nairobi','2026-05-11 13:40:43'),(3,17,'FreshLink Carol Wanjiru','Restaurant','Cereals, Legumes','Mombasa','2026-05-11 13:40:43'),(4,18,'FreshLink James Karanja','Wholesaler','Vegetables, Cereals','Nakuru','2026-05-11 13:40:43'),(5,19,'FreshLink Lucy Atieno','Retailer','Fruits, Legumes','Kisumu','2026-05-11 13:40:43'),(6,20,'FreshLink Kevin Musyoka','Restaurant','Vegetables, Fruits','Machakos','2026-05-11 13:40:43'),(7,21,'FreshLink Sharon Jepkosgei','Wholesaler','Cereals, Legumes','Eldoret','2026-05-11 13:40:43'),(8,22,'FreshLink Hassan Abdullahi','Retailer','Vegetables, Cereals','Garissa','2026-05-11 13:40:43'),(9,23,'FreshLink Naomi Njoki','Restaurant','Fruits, Legumes','Thika','2026-05-11 13:40:43'),(10,24,'FreshLink Dennis Otieno','Wholesaler','Vegetables, Fruits','Kisii','2026-05-11 13:40:43'),(11,25,'FreshLink Mercy Chepngeno','Retailer','Cereals, Legumes','Kericho','2026-05-11 13:40:43'),(12,26,'FreshLink Paul Njoroge','Restaurant','Vegetables, Cereals','Nyeri','2026-05-11 13:40:43'),(13,27,'FreshLink Irene Mumbi','Wholesaler','Fruits, Legumes','Murang’a','2026-05-11 13:40:43'),(14,28,'FreshLink George Onyango','Retailer','Vegetables, Fruits','Siaya','2026-05-11 13:40:43'),(15,29,'FreshLink Aisha Mohammed','Restaurant','Cereals, Legumes','Mombasa','2026-05-11 13:40:43'),(16,30,'FreshLink Victor Maina','Wholesaler','Vegetables, Cereals','Nairobi','2026-05-11 13:40:43');
/*!40000 ALTER TABLE `buyer_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buyer_requests`
--

DROP TABLE IF EXISTS `buyer_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buyer_requests` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `buyer_id` int NOT NULL,
  `produce_needed` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `quantity_needed` decimal(10,2) NOT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `budget_per_unit` decimal(10,2) DEFAULT NULL,
  `delivery_location` varchar(100) DEFAULT NULL,
  `needed_by_date` date DEFAULT NULL,
  `description` text,
  `status` enum('open','fulfilled','cancelled') DEFAULT 'open',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`request_id`),
  KEY `buyer_id` (`buyer_id`),
  KEY `idx_produce_needed` (`produce_needed`),
  KEY `idx_status` (`status`),
  CONSTRAINT `buyer_requests_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buyer_requests`
--

LOCK TABLES `buyer_requests` WRITE;
/*!40000 ALTER TABLE `buyer_requests` DISABLE KEYS */;
INSERT INTO `buyer_requests` VALUES (1,3,'Kale','Vegetables',500.00,'kg',30.00,'Mombasa','2026-02-10','Need fresh kale for restaurant supply','open','2026-05-11 13:16:04','2026-05-11 13:16:04'),(2,38,'Kales','Vegetables',100.00,'kg',75.00,'Nairobi','2026-07-16','The kales have to be of grade A or premium quality and organically grown.','open','2026-06-10 10:16:13','2026-06-10 10:16:13'),(3,17,'Fresh Kale','Vegetables',55.00,'kg',150.00,'Mombasa','2026-07-01','The Kale has to be of premium quality and well packaged for delivery.','open','2026-06-14 09:39:55','2026-06-14 09:39:55'),(4,17,'Lemons and Lime','Fruits',100.00,'kg',75.00,'Mombasa','2026-07-02','The lemons and lime need to be of Grade A or higher','open','2026-06-14 09:43:03','2026-06-14 09:43:03'),(5,17,'Fresh carrots','Vegetables',125.00,'pieces',10.00,'Mombasa','2026-07-03',NULL,'open','2026-06-14 09:43:42','2026-06-14 09:43:42'),(6,38,'Duck Meat','Poultry',50.00,'kg',270.00,'Nairobi','2026-06-26','The duck has to be freshly slaughtered','open','2026-06-14 09:47:33','2026-06-14 09:47:33'),(7,38,'Goat Milk','Dairy',2.00,'crates',500.00,'Nairobi','2026-06-26','Milk must be fresh and free from contamination.','open','2026-06-14 09:49:04','2026-06-14 09:49:04');
/*!40000 ALTER TABLE `buyer_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expert_profiles`
--

DROP TABLE IF EXISTS `expert_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expert_profiles` (
  `profile_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `specialization` varchar(100) DEFAULT NULL COMMENT 'e.g., Crop Science, Livestock, Soil Management',
  `qualification` varchar(200) DEFAULT NULL,
  `years_of_experience` int DEFAULT NULL,
  `organization` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`profile_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `expert_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expert_profiles`
--

LOCK TABLES `expert_profiles` WRITE;
/*!40000 ALTER TABLE `expert_profiles` DISABLE KEYS */;
INSERT INTO `expert_profiles` VALUES (1,2,'Crop Science','PhD in Agricultural Sciences',15,'Kenya Agricultural Research Institute','2026-05-11 13:16:04'),(2,31,'Soil Management','BSc Agriculture',20,'Sonnet Shamba Advisory','2026-05-11 13:40:43'),(3,32,'Pest Control','BSc Agriculture',5,'Sonnet Shamba Advisory','2026-05-11 13:40:43'),(4,33,'Irrigation','BSc Agriculture',6,'Sonnet Shamba Advisory','2026-05-11 13:40:43'),(5,34,'Post-Harvest','BSc Agriculture',7,'Sonnet Shamba Advisory','2026-05-11 13:40:43'),(6,35,'Crop Science','BSc Agriculture',8,'Sonnet Shamba Advisory','2026-05-11 13:40:43'),(7,37,'Crop Science','PhD Agricultural Science',20,'Green Farmers Institute','2026-06-10 09:29:32');
/*!40000 ALTER TABLE `expert_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `farmer_profiles`
--

DROP TABLE IF EXISTS `farmer_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `farmer_profiles` (
  `profile_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `farm_size` decimal(10,2) DEFAULT NULL COMMENT 'Farm size in acres',
  `farm_location` varchar(150) DEFAULT NULL,
  `main_crops` text COMMENT 'Comma-separated list of main crops',
  `farming_experience` int DEFAULT NULL COMMENT 'Years of farming experience',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`profile_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `farmer_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `farmer_profiles`
--

LOCK TABLES `farmer_profiles` WRITE;
/*!40000 ALTER TABLE `farmer_profiles` DISABLE KEYS */;
INSERT INTO `farmer_profiles` VALUES (1,1,5.50,'Kiambu County','Maize, Beans, Potatoes',10,'2026-05-11 13:16:04'),(2,4,3.20,'Nakuru County','Tomatoes, Kale, Carrots',5,'2026-05-11 13:16:04'),(3,6,8.50,'Eldoret','Maize, Beans',8,'2026-05-11 13:40:43'),(4,7,2.50,'Nyeri','Potatoes, Cabbage',9,'2026-05-11 13:40:43'),(5,8,3.50,'Kiambu','Tomatoes, Kale',10,'2026-05-11 13:40:43'),(6,9,4.50,'Nakuru','Onions, Carrots',11,'2026-05-11 13:40:43'),(7,10,5.50,'Thika','Avocados, Mangoes',12,'2026-05-11 13:40:43'),(8,11,6.50,'Kisumu','Green grams, Cowpeas',13,'2026-05-11 13:40:43'),(9,12,7.50,'Siaya','Maize, Beans',14,'2026-05-11 13:40:43'),(10,13,8.50,'Kericho','Potatoes, Dairy, Poultry (Chicken)',15,'2026-05-11 13:40:43'),(11,14,2.50,'Machakos','Tomatoes, Kale',16,'2026-05-11 13:40:43'),(12,15,3.50,'Murang’a','Onions, Carrots',17,'2026-05-11 13:40:43'),(13,36,20.00,'Kiambu County','Maize, Beans, Tomatoes and Kales',33,'2026-06-10 10:21:49');
/*!40000 ALTER TABLE `farmer_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum_comments`
--

DROP TABLE IF EXISTS `forum_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum_comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `comment_text` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `user_id` (`user_id`),
  KEY `idx_post_id` (`post_id`),
  CONSTRAINT `forum_comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `forum_posts` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `forum_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_comments`
--

LOCK TABLES `forum_comments` WRITE;
/*!40000 ALTER TABLE `forum_comments` DISABLE KEYS */;
INSERT INTO `forum_comments` VALUES (1,1,36,'That is wonderful John. I recently started using drip myself and it is excellent.','2026-06-14 09:56:48'),(2,3,37,'The key to reducing fertilizer costs without shrinking your harvest is increasing your Nutrient Use Efficiency (NUE). Right now, a large percentage of standard broadcast fertilizer is completely lost to the environment through volatilization (gassing off into the air) or leaching (washing deep into groundwater). To stop this waste and cut input costs, switch immediately to a split-application and banding strategy:\n\n1\nRun a targeted zone test\nPre-season\n\nInstead of a flat-rate application across the entire field, sample your soil based on historical yield zones. Only apply high rates where the soil potential can actually convert those inputs into grain.\n2\nBand a sub-surface starter\nAt planting\n\nPlace a modest starter blend of phosphorus and a small amount of nitrogen exactly 2 inches to the side and 2 inches below the seed. Placing it directly in the root zone ensures the seedling can access it immediately, preventing weed fertilization.\n3\nIncorporate a biological fix\nVegetative transition\n\nInoculate your seeds or soil with nitrogen-fixing bacteria (Rhizobium for legumes, or free-living fixers like Azospirillum for grass crops). These microbes unlock chemically bound phosphorus already sitting dormant in your soil matrix.\n4\nSide-dress during peak demand\nMid-season growth spurt\n\nApply the remaining 60-70% of your nitrogen requirement right when the crop enters its rapid vegetative growth phase. Injecting or dropping it directly between the rows prevents atmospheric loss and puts the food exactly when and where the plant is actively hungry.\n\nBy timing your applications to match the plant\'s natural growth curve, you can typically reduce total synthetic nitrogen applications by 15% to 25% while maintaining your target yields.','2026-06-14 10:08:25'),(3,4,37,'Standing water is a symptom of poor structural porosity, and fixing it permanently requires identifying whether the blockage is at the surface or deep underground. When water cannot infiltrate, it creates anaerobic (oxygen-depleted) conditions that suffocate roots within 24 to 48 hours.\n\nHere is the technical approach to opening up your soil profile and restoring natural drainage:\n\n                  TYPICAL SOIL PROFILE COMPACTION\n                  \n       [ Surface Layer ]   <-- Loose, managed topsoil (0-6 inches)\n   ======================= <-- PLOW PAN / HARDPAN LAYER (Impervious barrier)\n       [ Subsoil Layer ]   <-- Deep, dry roots blocked from expanding downward\n\n    Step 1: Locate the Barrier. Take a soil probe or a simple T-handle tile probe out to the wet areas when the soil is drying. Push it into the ground with steady pressure. If it drops easily for 6 inches and then hits a literal \"wall\" that requires you to lean your full body weight on it, you have a classic plow pan (compaction layer caused by repeated tillage at the same depth).\n\n    Step 2: Mechanical Shattering (The Short-Term Reset). During a dry period in the late summer or autumn, run a mechanical subsoiler (inline ripper) through the problem areas. Set the depth exactly 2 inches below the hardpan layer you discovered with the probe. Operating the ripper when the soil is dry ensures the shanks shatter and fracture the dense layer rather than just slicing a clean, muddy groove through it.\n\n    Step 3: Biological Anchoring (The Long-Term Solution). Mechanical ripping is only a temporary fix; without roots to hold those new cracks open, the soil will settle and compact right back together within two seasons. Immediately follow your subsoiling with a cover crop of daikon radishes (tillage radishes) or deep-rooted forage oats. The aggressive, taproots of these covers act as living biological drills, growing straight down into the fractured hardpan. When they die off and rot over the winter, they leave wide, open channels that allow spring rains to drain instantly into the deep subsoil.','2026-06-14 10:09:36');
/*!40000 ALTER TABLE `forum_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum_posts`
--

DROP TABLE IF EXISTS `forum_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum_posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `category` varchar(50) DEFAULT NULL COMMENT 'e.g., General, Success Stories, Tips',
  `views_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`),
  KEY `user_id` (`user_id`),
  KEY `idx_category` (`category`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `forum_posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_posts`
--

LOCK TABLES `forum_posts` WRITE;
/*!40000 ALTER TABLE `forum_posts` DISABLE KEYS */;
INSERT INTO `forum_posts` VALUES (1,1,'My experience with drip irrigation','I recently installed drip irrigation on my farm and the results have been amazing. Water consumption reduced by 40%...','Success Stories',5,'2026-05-11 13:16:04','2026-06-14 09:55:59'),(3,36,'How can I cut back on synthetic fertilizer without tanking my crop yields?','With the rising cost of commercial inputs, farmers are looking for ways to optimize their spending. They ask experts how to safely transition to a split-application method, leverage nitrogen-fixing cover crops, or use precision soil testing to target only the areas of the field that truly need supplementation.','Questions & Help',1,'2026-06-14 09:59:08','2026-06-14 10:08:15'),(4,36,'My fields are pooling water long after heavy rains. How do I fix this drainage issue permanently?','When standing water suffocates crop roots, farmers need to know if they are dealing with surface compaction or a deeper subsoil hardpan. They ask experts for advice on whether to invest in mechanical subsoiling (ripping), install tile drainage systems, or use deep-rooting biological covers like tillage radishes to shatter the dense layers.','Questions & Help',1,'2026-06-14 09:59:52','2026-06-14 10:09:26'),(5,13,'Weeds are becoming resistant to my usual herbicide rotation. What is my next move?','As aggressive weeds evolve resistance to common chemical controls, standard spraying programs stop working. Farmers turn to weed scientists and agronomy experts to build an Integrated Pest Management (IPM) strategy that combines different chemical modes of action with cultural controls like narrow row spacing and optimized cover crop termination.','Questions & Help',0,'2026-06-14 10:03:45','2026-06-14 10:03:45'),(6,13,'The \"Spade and Jar\" Field Test: Know Your Soil Without the Lab Cost','While laboratory testing is necessary for precise nutrient profiling, you can easily monitor your soil\'s physical health and biological activity right in the field using just a shovel and a clear glass jar. Dig up a 6-inch block of soil from an active root zone and observe its structure. Healthy soil should break apart easily into crumbly, irregular granules (like cake crumbs), which indicates good aeration and organic matter. If it comes up in hard, flat plates or dense clods that you can barely crush with your thumb, your field is suffering from compaction.\n\nTo test your soil texture and organic content further, drop a handful of that soil into a clear jar filled with water, shake it vigorously for a minute, and let it settle. Within 24 hours, the sand, silt, and clay will separate into distinct layers, with the sand at the bottom and clay at the top. Any dark material floating on the water or darkening the liquid is your organic matter. Monitoring these visual changes across your different fields every spring lets you track exactly which areas are recovering from compaction and where your cover-cropping efforts are paying off.','Tips & Tricks',0,'2026-06-14 10:06:00','2026-06-14 10:06:00'),(7,13,'Staggered Row Planning: Nature\'s Free Defense Against High-Wind Damage','If your farm is located in an open area prone to high winds or sudden summer storms, planting your row crops parallel to the prevailing wind direction can turn your fields into wind tunnels, causing severe lodging (when crops bend or break at the stalk). To drastically reduce this risk without investing in expensive artificial windbreaks, offset your planting angle by 30 to 45 degrees relative to the region\'s dominant wind patterns.\n\nBy staggering the rows at an angle, the outer plants act as a natural fluid buffer. They break the mechanical force of the wind and force the air upward and over the field rather than letting it whistle cleanly down the rows. This simple adjustment in your tractor\'s GPS or mapping layout creates a self-shielding effect across the entire canopy, protecting fragile stalks during critical reproductive phases when heavy grain heads make the plants top-heavy and vulnerable to snapping.','Tips & Tricks',0,'2026-06-14 10:06:35','2026-06-14 10:06:35'),(8,37,'Optimize Your Planter’s Downforce Dynamics: The Secret to Even Emergence','Many farmers focus heavily on seed variety and fertilizer placement but overlook the mechanical pressure their planting equipment exerts on the soil. If your row units do not have enough downforce, the disc openers will ride up out of the ground in hard spots, dropping seeds too shallowly into dry soil where they delay germinating. Conversely, if the row units have too much downforce, they compress the sidewalls of the seed trench into dense, smeared mud cakes. This creates \"sidewall compaction,\" making it physically impossible for fragile primary roots to push outward, leading to stunted plants and what experts call \"moisture-restricted runts.\"\n\nTo solve this without constantly stopping to manually adjust heavy springs on every row unit, consider upgrading your planter to an automated hydraulic downforce system. Unlike static springs or air bags that react slowly, automated hydraulic cylinders measure soil resistance hundreds of times per second and instantly adjust pressure row-by-row. If a row unit hits a hard clay vein, the system pumps up the pressure to maintain an exact, uniform depth; when it hits loose, sandy soil, it backs off instantly to prevent compaction. Ensuring every single seed is tucked into identical soil density at an identical depth guarantees synchronized emergence, meaning your entire field sprouts within the same 24-hour window, preventing older plants from shading out and stealing nutrients from late-emerging neighbors.','Equipment & Tools',0,'2026-06-14 10:16:34','2026-06-14 10:16:34');
/*!40000 ALTER TABLE `forum_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `market_trends`
--

DROP TABLE IF EXISTS `market_trends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `market_trends` (
  `trend_id` int NOT NULL AUTO_INCREMENT,
  `produce_name` varchar(100) NOT NULL,
  `average_price` decimal(10,2) DEFAULT NULL,
  `demand_level` enum('low','medium','high') DEFAULT NULL,
  `supply_level` enum('low','medium','high') DEFAULT NULL,
  `recorded_date` date NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `data_points` int DEFAULT NULL COMMENT 'Number of listings used for calculation',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`trend_id`),
  KEY `idx_produce_name` (`produce_name`),
  KEY `idx_recorded_date` (`recorded_date`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `market_trends`
--

LOCK TABLES `market_trends` WRITE;
/*!40000 ALTER TABLE `market_trends` DISABLE KEYS */;
INSERT INTO `market_trends` VALUES (1,'Tomatoes',80.00,'high','medium','2026-02-01','Nairobi',NULL,'2026-05-11 13:16:29'),(2,'Tomatoes',75.00,'high','low','2026-02-01','Mombasa',NULL,'2026-05-11 13:16:29'),(3,'Tomatoes',70.00,'medium','medium','2026-02-01','Kisumu',NULL,'2026-05-11 13:16:29'),(4,'Cabbage',40.00,'medium','high','2026-02-01','Nairobi',NULL,'2026-05-11 13:16:29'),(5,'Cabbage',35.00,'medium','high','2026-02-01','Nakuru',NULL,'2026-05-11 13:16:29'),(6,'Kale (Sukuma Wiki)',30.00,'high','medium','2026-02-01','Nairobi',NULL,'2026-05-11 13:16:29'),(7,'Kale (Sukuma Wiki)',25.00,'high','high','2026-02-01','Eldoret',NULL,'2026-05-11 13:16:29'),(8,'Maize',45.00,'high','low','2026-02-01','Kitale',NULL,'2026-05-11 13:16:29'),(9,'Maize',50.00,'high','low','2026-02-01','Nairobi',NULL,'2026-05-11 13:16:29'),(10,'Beans',120.00,'medium','medium','2026-02-01','Meru',NULL,'2026-05-11 13:16:29'),(11,'Beans',130.00,'medium','low','2026-02-01','Nairobi',NULL,'2026-05-11 13:16:29'),(12,'Potatoes',60.00,'medium','medium','2026-02-01','Nairobi',NULL,'2026-05-11 13:16:29'),(13,'Potatoes',50.00,'low','high','2026-02-01','Molo',NULL,'2026-05-11 13:16:29'),(14,'Carrots',70.00,'medium','medium','2026-02-01','Nairobi',NULL,'2026-05-11 13:16:29'),(15,'Onions',90.00,'high','low','2026-02-01','Nairobi',NULL,'2026-05-11 13:16:29'),(16,'Onions',95.00,'high','low','2026-02-01','Mombasa',NULL,'2026-05-11 13:16:29'),(17,'Spinach',35.00,'medium','medium','2026-02-01','Nairobi',NULL,'2026-05-11 13:16:29'),(18,'Green Peppers',100.00,'high','low','2026-02-01','Nairobi',NULL,'2026-05-11 13:16:29'),(19,'Mangoes',80.00,'high','medium','2026-02-01','Mombasa',NULL,'2026-05-11 13:16:29'),(20,'Avocados',15.00,'high','medium','2026-02-01','Nairobi',NULL,'2026-05-11 13:16:29'),(21,'Tomatoes',85.00,'high','low','2026-02-05','Nairobi',NULL,'2026-05-11 13:16:29'),(22,'Kale (Sukuma Wiki)',32.00,'high','medium','2026-02-05','Nairobi',NULL,'2026-05-11 13:16:29'),(23,'Maize',48.00,'high','low','2026-02-05','Kitale',NULL,'2026-05-11 13:16:29'),(24,'Onions',95.00,'high','low','2026-02-05','Nairobi',NULL,'2026-05-11 13:16:29');
/*!40000 ALTER TABLE `market_trends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `subject` varchar(150) DEFAULT NULL,
  `message_text` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`message_id`),
  KEY `sender_id` (`sender_id`),
  KEY `idx_receiver_id` (`receiver_id`),
  KEY `idx_is_read` (`is_read`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,38,36,'Inquiry about Beans','Hello Reuben. I am interested with 10 bags of beans. Can you maybe sell me the 10 bags at 2200 per bag?',1,'2026-06-10 10:09:54'),(2,36,38,NULL,'Hello Peter. The best I can do for now is 2400 per bag. What do you think?',1,'2026-06-10 10:11:09'),(3,38,36,NULL,'How about we meet in the middle at 2300?',1,'2026-06-10 10:12:22'),(4,36,38,NULL,'Sounds like a deal. Do you want delivery or are you going to pick the bags at the farm?',1,'2026-06-10 10:13:31'),(5,31,36,'Inquiry about Tomatoes','Hello. Are the tomates still available?',1,'2026-06-10 10:19:25'),(6,36,31,NULL,'Hello Daktari. Yes, the tomatoes are available.',1,'2026-06-10 10:20:31');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `notification_type` varchar(50) DEFAULT NULL COMMENT 'e.g., new_response, new_request, system',
  `is_read` tinyint(1) DEFAULT '0',
  `related_id` int DEFAULT NULL COMMENT 'ID of related entity (question_id, request_id, etc.)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_is_read` (`is_read`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produce_listings`
--

DROP TABLE IF EXISTS `produce_listings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produce_listings` (
  `listing_id` int NOT NULL AUTO_INCREMENT,
  `farmer_id` int NOT NULL,
  `produce_name` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL COMMENT 'e.g., Vegetables, Fruits, Cereals, Legumes',
  `quantity` decimal(10,2) NOT NULL,
  `unit` varchar(20) DEFAULT NULL COMMENT 'e.g., kg, bags, crates',
  `price_per_unit` decimal(10,2) DEFAULT NULL,
  `available_from` date DEFAULT NULL,
  `available_until` date DEFAULT NULL,
  `description` text,
  `quality_grade` varchar(20) DEFAULT NULL COMMENT 'e.g., Grade A, Grade B, Premium',
  `location` varchar(100) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `status` enum('available','sold','expired') DEFAULT 'available',
  `views_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`listing_id`),
  KEY `farmer_id` (`farmer_id`),
  KEY `idx_produce_name` (`produce_name`),
  KEY `idx_category` (`category`),
  KEY `idx_status` (`status`),
  CONSTRAINT `produce_listings_ibfk_1` FOREIGN KEY (`farmer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produce_listings`
--

LOCK TABLES `produce_listings` WRITE;
/*!40000 ALTER TABLE `produce_listings` DISABLE KEYS */;
INSERT INTO `produce_listings` VALUES (4,36,'Tomatoes','Vegetables',50.00,'crates',5000.00,'2026-06-10','2026-08-10','Freshly harvested tomatoes available at a great price. Call or message to get your order today!!','Premium','Kiambu','/uploads/produce/Tomatoes-1781085903753-907184840.jpeg','available',1,'2026-06-10 10:05:03','2026-06-10 10:16:46'),(5,36,'Beans','Legumes',30.00,'bags',2500.00,'2026-06-12','2026-11-11','Pesticide free beans available at an amazing price. Call or message me to place your order. We deliver country wide.','Grade A','Kiambu','/uploads/produce/kidney-beans-1296x728-feature-1781086097715-857942857.webp','available',1,'2026-06-10 10:08:17','2026-06-10 10:16:35'),(6,36,'Maize','Grains',50.00,'bags',2200.00,'2026-06-01','2026-08-20','Fresh maize on cobs and grains available for sale. Reach out to me for delivery if interested.','Grade A','Kiambu','/uploads/produce/Maize-1781087077912-942226024.jpeg','available',0,'2026-06-10 10:24:37','2026-06-10 10:24:37'),(7,36,'Cabbage','Vegetables',35.00,'crates',1000.00,'2026-05-31','2026-06-29','Fresh cabbage available!!','Premium','Kiambu','/uploads/produce/Cabbage-1781428317717-776292897.jpeg','available',0,'2026-06-14 09:11:57','2026-06-14 09:12:31'),(8,36,'Melon','Fruits',158.00,'pieces',50.00,'2026-06-02','2026-06-29',NULL,'Grade A','Kiambu','/uploads/produce/Melon-1781428463200-318677909.jpeg','available',0,'2026-06-14 09:14:05','2026-06-14 09:14:23'),(9,13,'Potatoes','Tubers',50.00,'bags',5000.00,'2026-05-20','2026-07-22','Premium potatoes available at a great price','Premium','Kericho','/uploads/produce/potatoes-1781428862655-396829599.jpeg','available',0,'2026-06-14 09:21:02','2026-06-14 09:21:41'),(10,13,'Cassava','Tubers',17.00,'bags',3000.00,'2026-06-02','2026-06-23','Quality Cassava just for you. Call or message me today','Grade A','Kericho','/uploads/produce/Cassava-1781429020004-4022861.jpeg','available',0,'2026-06-14 09:23:40','2026-06-14 09:23:40'),(11,13,'Fresh Milk','Dairy',150.00,'crates',500.00,'2026-06-08','2026-06-24','Fresh milk available','Premium','Kericho','/uploads/produce/Milk-1781429216200-3564405.jpeg','available',0,'2026-06-14 09:26:56','2026-06-14 09:26:56'),(12,13,'Free range Rooster','Poultry',3.50,'kg',650.00,'2026-06-11','2026-07-30','Healthy rooster available at an amazing price.','Premium','Kericho','/uploads/produce/rooster-Rhode-Island-Red-roosters-chicken-domestication-1781429424961-365330382.webp','available',1,'2026-06-14 09:30:24','2026-06-15 06:22:46');
/*!40000 ALTER TABLE `produce_listings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `user_type` enum('farmer','expert','buyer','admin') NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT 'default-avatar.png',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone_number` (`phone_number`),
  KEY `idx_user_type` (`user_type`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'John Kamau','john.kamau@example.com','0712345678','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','farmer','Kiambu','default-avatar.png','2026-05-11 13:16:04','2026-05-11 13:16:04',1),(2,'Dr. Mary Wanjiku','mary.wanjiku@example.com','0723456789','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','expert','Nairobi','default-avatar.png','2026-05-11 13:16:04','2026-05-11 13:16:04',1),(3,'David Ochieng','davidochieng@gmail.com','0734567890','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','buyer','Mombasa','default-avatar.png','2026-05-11 13:16:04','2026-06-14 08:47:17',1),(4,'Peter Mwangi','peter.mwangi@example.com','0745678901','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','farmer','Nakuru','default-avatar.png','2026-05-11 13:16:04','2026-05-11 13:16:04',1),(5,'System Admin','admin@sonnetshamba.com','0799999999','$2b$10$EO5UCIpj4vUVh6xo5bwaSeCghY/BUCO5Yefi/ouBVsEJzV7h3rtoK','admin','Nairobi','default-avatar.png','2026-05-11 13:24:11','2026-05-11 13:33:08',1),(6,'Samuel Kiptoo','samuel.kiptoo@test.com','0701000101','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','farmer','Eldoret','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(7,'Grace Wambui','grace.wambui@test.com','0701000102','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','farmer','Nyeri','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(8,'Peter Mwangi','peter.mwangi2@test.com','0701000103','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','farmer','Kiambu','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(9,'Mary Njeri','mary.njeri@test.com','0701000104','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','farmer','Nakuru','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(10,'John Kamau','john.kamau2@test.com','0701000105','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','farmer','Thika','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(11,'Esther Akinyi','esther.akinyi@test.com','0701000106','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','farmer','Kisumu','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(12,'Brian Ochieng','brian.ochieng@test.com','0701000107','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','farmer','Siaya','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(13,'Faith Chebet','faithchebet@gmail.com','0701000108','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','farmer','Kericho','default-avatar.png','2026-05-11 13:40:43','2026-06-14 09:24:24',1),(14,'Joseph Mutua','joseph.mutua@test.com','0701000109','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','farmer','Machakos','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(15,'Alice Muthoni','alice.muthoni@test.com','0701000110','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','farmer','Murang’a','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(16,'David Omondi','david.omondi@test.com','0702000201','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','buyer','Nairobi','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(17,'Carol Wanjiru','carolwanjiru@gmail.com','0702000202','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','buyer','Mombasa','default-avatar.png','2026-05-11 13:40:43','2026-06-14 08:43:51',1),(18,'James Karanja','james.karanja@test.com','0702000203','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','buyer','Nakuru','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(19,'Lucy Atieno','lucy.atieno@test.com','0702000204','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','buyer','Kisumu','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(20,'Kevin Musyoka','kevin.musyoka@test.com','0702000205','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','buyer','Machakos','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(21,'Sharon Jepkosgei','sharon.jepkosgei@test.com','0702000206','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','buyer','Eldoret','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(22,'Hassan Abdullahi','hassan.abdullahi@test.com','0702000207','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','buyer','Garissa','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(23,'Naomi Njoki','naomi.njoki@test.com','0702000208','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','buyer','Thika','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(24,'Dennis Otieno','dennis.otieno@test.com','0702000209','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','buyer','Kisii','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(25,'Mercy Chepngeno','mercy.chepngeno@test.com','0702000210','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','buyer','Kericho','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(26,'Paul Njoroge','paul.njoroge@test.com','0702000211','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','buyer','Nyeri','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(27,'Irene Mumbi','irene.mumbi@test.com','0702000212','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','buyer','Murang’a','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(28,'George Onyango','george.onyango@test.com','0702000213','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','buyer','Siaya','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(29,'Aisha Mohammed','aisha.mohammed@test.com','0702000214','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','buyer','Mombasa','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(30,'Victor Maina','victor.maina@test.com','0702000215','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','buyer','Nairobi','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(31,'Dr. Mary Wanjiku','drmarywanjiku@gmail.com','0703000301','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','expert','Nairobi','default-avatar.png','2026-05-11 13:40:43','2026-06-14 08:51:34',1),(32,'Dr. Daniel Kipchirchir','dr.daniel.kipchirchir@test.com','0703000302','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','expert','Eldoret','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(33,'Eng. Sylvia Nduta','eng.sylvia.nduta@test.com','0703000303','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','expert','Nakuru','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(34,'Prof. Peter Otieno','prof.peter.otieno@test.com','0703000304','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','expert','Kisumu','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(35,'Dr. Fatuma Ali','dr.fatuma.ali@test.com','0703000305','$2b$10$CHF0Tr6nQTTNoJwrDKOrO.VvcwX5yw4pAmGGzeAi59LiaPWLNnEbC','expert','Mombasa','default-avatar.png','2026-05-11 13:40:43','2026-05-11 13:40:43',1),(36,'Reuben Mwaniki','reubenmwaniki@gmail.com','0743711491','$2b$10$zcMeU1X3HP6KAw2j5CNjSetU/dL/BMo9Mdhe4.AMOor2Z.lyRxEdO','farmer','Kiambu','default-avatar.png','2026-06-10 09:25:29','2026-06-10 10:21:49',1),(37,'Dr. Esther Naiyanoi','dresthernaiyanoi@gmail.com','0723713413','$2b$10$xsIR7IuSpHcOSoa8DVJWbOapahcr6FQM2mGMBs/SSXZDhBBEpYmQO','expert','Kajiado','default-avatar.png','2026-06-10 09:27:13','2026-06-14 08:53:03',1),(38,'Peter Mbugua','petermbugua3000@gmail.com','0720031632','$2b$10$GnqJH4USdU0xJiCLv0KnTek7Qm.7hYjV0iRdQPx6yC0j2R7LvOxTO','buyer','Nairobi','default-avatar.png','2026-06-10 09:32:13','2026-06-10 09:32:13',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-25 13:13:54
