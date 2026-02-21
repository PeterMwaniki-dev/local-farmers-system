// controllers/reportController.js
// Analytics and reporting controller

const { pool } = require('../config/db');

// ============================================
// USER STATISTICS
// ============================================

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    // Total users by type
    const [usersByType] = await pool.query(`
      SELECT 
        user_type,
        COUNT(*) as count
      FROM users
      GROUP BY user_type
    `);

    // User registrations by month (last 6 months)
    const [registrationsByMonth] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        user_type,
        COUNT(*) as count
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m'), user_type
      ORDER BY month ASC
    `);

    // Total users
    const [totalUsers] = await pool.query('SELECT COUNT(*) as total FROM users');

    // Growth rate (compare this month vs last month)
    const [thisMonth] = await pool.query(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE MONTH(created_at) = MONTH(NOW()) 
      AND YEAR(created_at) = YEAR(NOW())
    `);

    const [lastMonth] = await pool.query(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE MONTH(created_at) = MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH))
      AND YEAR(created_at) = YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH))
    `);

    const growthRate = lastMonth[0].count > 0 
      ? (((thisMonth[0].count - lastMonth[0].count) / lastMonth[0].count) * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      data: {
        usersByType,
        registrationsByMonth,
        totalUsers: totalUsers[0].total,
        growthRate: parseFloat(growthRate)
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user statistics'
    });
  }
};

// ============================================
// PRODUCE STATISTICS
// ============================================

// Get produce statistics
exports.getProduceStats = async (req, res) => {
  try {
    // Total produce listings
    const [totalProduce] = await pool.query('SELECT COUNT(*) as total FROM produce_listings');

    // Produce by category
    const [produceByCategory] = await pool.query(`
      SELECT 
        category,
        COUNT(*) as count
      FROM produce_listings
      GROUP BY category
      ORDER BY count DESC
    `);

    // Produce by status
    const [produceByStatus] = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM produce_listings
      GROUP BY status
    `);

    // Top 5 most listed produce
    const [topProduce] = await pool.query(`
      SELECT 
        produce_name,
        COUNT(*) as count
      FROM produce_listings
      GROUP BY produce_name
      ORDER BY count DESC
      LIMIT 5
    `);

    // Produce listings by month (last 6 months)
    const [listingsByMonth] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM produce_listings
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);

    res.json({
      success: true,
      data: {
        totalProduce: totalProduce[0].total,
        produceByCategory,
        produceByStatus,
        topProduce,
        listingsByMonth
      }
    });
  } catch (error) {
    console.error('Get produce stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get produce statistics'
    });
  }
};

// ============================================
// ACTIVITY STATISTICS
// ============================================

// Get platform activity statistics
exports.getActivityStats = async (req, res) => {
  try {
    // Forum posts count
    const [totalForumPosts] = await pool.query('SELECT COUNT(*) as total FROM forum_posts');

    // Advisory posts count
    const [totalAdvisoryPosts] = await pool.query('SELECT COUNT(*) as total FROM advisory_posts');

    // Buyer requests count
    const [totalBuyerRequests] = await pool.query('SELECT COUNT(*) as total FROM buyer_requests');

    // Comments count
    const [totalComments] = await pool.query('SELECT COUNT(*) as total FROM forum_comments');

    // Activity by month (last 6 months)
    const [forumByMonth] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM forum_posts
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);

    const [advisoryByMonth] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM advisory_posts
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);

    const [requestsByMonth] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM buyer_requests
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);

    res.json({
      success: true,
      data: {
        totalForumPosts: totalForumPosts[0].total,
        totalAdvisoryPosts: totalAdvisoryPosts[0].total,
        totalBuyerRequests: totalBuyerRequests[0].total,
        totalComments: totalComments[0].total,
        forumByMonth,
        advisoryByMonth,
        requestsByMonth
      }
    });
  } catch (error) {
    console.error('Get activity stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get activity statistics'
    });
  }
};

// ============================================
// TOP USERS
// ============================================

// Get top active users
exports.getTopUsers = async (req, res) => {
  try {
    // Top 5 farmers by listing count
    const [topFarmers] = await pool.query(`
      SELECT 
        u.user_id,
        u.full_name,
        u.location,
        COUNT(p.listing_id) as listing_count
      FROM users u
      LEFT JOIN produce_listings p ON u.user_id = p.farmer_id
      WHERE u.user_type = 'farmer'
      GROUP BY u.user_id
      ORDER BY listing_count DESC
      LIMIT 5
    `);

    // Top 5 buyers by request count
    const [topBuyers] = await pool.query(`
      SELECT 
        u.user_id,
        u.full_name,
        u.location,
        COUNT(b.request_id) as request_count
      FROM users u
      LEFT JOIN buyer_requests b ON u.user_id = b.buyer_id
      WHERE u.user_type = 'buyer'
      GROUP BY u.user_id
      ORDER BY request_count DESC
      LIMIT 5
    `);

    // Top 5 experts by post count
    const [topExperts] = await pool.query(`
      SELECT 
        u.user_id,
        u.full_name,
        u.location,
        COUNT(a.post_id) as post_count
      FROM users u
      LEFT JOIN advisory_posts a ON u.user_id = a.expert_id
      WHERE u.user_type = 'expert'
      GROUP BY u.user_id
      ORDER BY post_count DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        topFarmers,
        topBuyers,
        topExperts
      }
    });
  } catch (error) {
    console.error('Get top users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get top users'
    });
  }
};

// ============================================
// GEOGRAPHIC DISTRIBUTION
// ============================================

// Get geographic distribution
exports.getGeographicDistribution = async (req, res) => {
  try {
    // Users by location (top 10)
    const [usersByLocation] = await pool.query(`
      SELECT 
        location,
        COUNT(*) as count
      FROM users
      WHERE location IS NOT NULL AND location != ''
      GROUP BY location
      ORDER BY count DESC
      LIMIT 10
    `);

    // Produce listings by location (top 10)
    const [produceByLocation] = await pool.query(`
      SELECT 
        location,
        COUNT(*) as count
      FROM produce_listings
      WHERE location IS NOT NULL AND location != ''
      GROUP BY location
      ORDER BY count DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        usersByLocation,
        produceByLocation
      }
    });
  } catch (error) {
    console.error('Get geographic distribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get geographic distribution'
    });
  }
};

// ============================================
// ENGAGEMENT METRICS
// ============================================

// Get engagement metrics
exports.getEngagementMetrics = async (req, res) => {
  try {
    // Most viewed produce (top 10)
    const [mostViewedProduce] = await pool.query(`
      SELECT 
        produce_name,
        views_count,
        category,
        location
      FROM produce_listings
      WHERE views_count > 0
      ORDER BY views_count DESC
      LIMIT 10
    `);

    // Most viewed advisory posts (top 10)
    const [mostViewedAdvisory] = await pool.query(`
      SELECT 
        title,
        views_count,
        category
      FROM advisory_posts
      WHERE views_count > 0
      ORDER BY views_count DESC
      LIMIT 10
    `);

    // Most active forum discussions (by comment count)
    const [mostActiveForums] = await pool.query(`
      SELECT 
        fp.title,
        fp.category,
        COUNT(fc.comment_id) as comment_count
      FROM forum_posts fp
      LEFT JOIN forum_comments fc ON fp.post_id = fc.post_id
      GROUP BY fp.post_id
      ORDER BY comment_count DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        mostViewedProduce,
        mostViewedAdvisory,
        mostActiveForums
      }
    });
  } catch (error) {
    console.error('Get engagement metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get engagement metrics'
    });
  }
};

// ============================================
// OVERVIEW SUMMARY
// ============================================

// Get complete overview summary
exports.getOverviewSummary = async (req, res) => {
  try {
    // Get all basic counts
    const [userCount] = await pool.query('SELECT COUNT(*) as total FROM users');
    const [produceCount] = await pool.query('SELECT COUNT(*) as total FROM produce_listings');
    const [forumCount] = await pool.query('SELECT COUNT(*) as total FROM forum_posts');
    const [advisoryCount] = await pool.query('SELECT COUNT(*) as total FROM advisory_posts');
    const [requestCount] = await pool.query('SELECT COUNT(*) as total FROM buyer_requests');
    const [commentCount] = await pool.query('SELECT COUNT(*) as total FROM forum_comments');

    // Active users (posted/listed in last 30 days)
    const [activeUsers] = await pool.query(`
      SELECT COUNT(DISTINCT user_id) as count
      FROM (
        SELECT farmer_id as user_id FROM produce_listings WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        UNION
        SELECT user_id FROM forum_posts WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        UNION
        SELECT expert_id as user_id FROM advisory_posts WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      ) as active
    `);

    res.json({
      success: true,
      data: {
        totalUsers: userCount[0].total,
        totalProduce: produceCount[0].total,
        totalForumPosts: forumCount[0].total,
        totalAdvisoryPosts: advisoryCount[0].total,
        totalBuyerRequests: requestCount[0].total,
        totalComments: commentCount[0].total,
        activeUsers: activeUsers[0].count
      }
    });
  } catch (error) {
    console.error('Get overview summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get overview summary'
    });
  }
};