// controllers/adminController.js
// Admin dashboard and management controller

const { pool } = require('../config/db');

// Get admin statistics
exports.getAdminStats = async (req, res) => {
  try {
    // Total users by type
    const [userStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN user_type = 'farmer' THEN 1 ELSE 0 END) as total_farmers,
        SUM(CASE WHEN user_type = 'buyer' THEN 1 ELSE 0 END) as total_buyers,
        SUM(CASE WHEN user_type = 'expert' THEN 1 ELSE 0 END) as total_experts,
        SUM(CASE WHEN user_type = 'admin' THEN 1 ELSE 0 END) as total_admins
      FROM users
    `);

    // Total produce listings
    const [produceStats] = await pool.query(
      'SELECT COUNT(*) as total_produce FROM produce_listings'
    );

    // Total buyer requests
    const [requestStats] = await pool.query(
      'SELECT COUNT(*) as total_requests FROM buyer_requests'
    );

    // Total advisory posts
    const [advisoryStats] = await pool.query(
      'SELECT COUNT(*) as total_advisory_posts FROM advisory_posts'
    );

    // Total forum posts
    const [forumStats] = await pool.query(
      'SELECT COUNT(*) as total_forum_posts FROM forum_posts'
    );

    // Total forum comments
    const [commentStats] = await pool.query(
      'SELECT COUNT(*) as total_comments FROM forum_comments'
    );

    res.json({
      totalUsers: userStats[0].total_users,
      totalFarmers: userStats[0].total_farmers,
      totalBuyers: userStats[0].total_buyers,
      totalExperts: userStats[0].total_experts,
      totalAdmins: userStats[0].total_admins,
      totalProduce: produceStats[0].total_produce,
      totalRequests: requestStats[0].total_requests,
      totalAdvisoryPosts: advisoryStats[0].total_advisory_posts,
      totalForumPosts: forumStats[0].total_forum_posts,
      totalComments: commentStats[0].total_comments
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get recent users
exports.getRecentUsers = async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT user_id, full_name, email, user_type, location, is_active, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 20
    `);

    res.json(users);
  } catch (error) {
    console.error('Get recent users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get recent activity
exports.getRecentActivity = async (req, res) => {
  try {
    const activities = [];

    // Recent produce listings
    const [recentProduce] = await pool.query(`
      SELECT 
        p.listing_id,
        p.produce_name,
        p.created_at,
        u.full_name as user_name,
        'produce' as type
      FROM produce_listings p
      JOIN users u ON p.farmer_id = u.user_id
      ORDER BY p.created_at DESC
      LIMIT 5
    `);

    recentProduce.forEach(item => {
      activities.push({
        type: 'produce',
        user_name: item.user_name,
        action: 'listed new produce',
        description: item.produce_name,
        created_at: item.created_at
      });
    });

    // Recent forum posts
    const [recentForum] = await pool.query(`
      SELECT 
        fp.post_id,
        fp.title,
        fp.created_at,
        u.full_name as user_name,
        'forum' as type
      FROM forum_posts fp
      JOIN users u ON fp.user_id = u.user_id
      ORDER BY fp.created_at DESC
      LIMIT 5
    `);

    recentForum.forEach(item => {
      activities.push({
        type: 'forum',
        user_name: item.user_name,
        action: 'created a forum post',
        description: item.title,
        created_at: item.created_at
      });
    });

    // Recent advisory posts
    const [recentAdvisory] = await pool.query(`
      SELECT 
        ap.post_id,
        ap.title,
        ap.created_at,
        u.full_name as user_name,
        'advisory' as type
      FROM advisory_posts ap
      JOIN users u ON ap.expert_id = u.user_id
      ORDER BY ap.created_at DESC
      LIMIT 5
    `);

    recentAdvisory.forEach(item => {
      activities.push({
        type: 'advisory',
        user_name: item.user_name,
        action: 'published advisory post',
        description: item.title,
        created_at: item.created_at
      });
    });

    // Sort all activities by date
    activities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Return top 15
    res.json(activities.slice(0, 15));
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users (with pagination)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, user_type, search } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT user_id, full_name, email, user_type, location, phone_number, is_active, created_at FROM users WHERE 1=1';
    const params = [];

    if (user_type) {
      query += ' AND user_type = ?';
      params.push(user_type);
    }

    if (search) {
      query += ' AND (full_name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [users] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const countParams = [];

    if (user_type) {
      countQuery += ' AND user_type = ?';
      countParams.push(user_type);
    }

    if (search) {
      countQuery += ' AND (full_name LIKE ? OR email LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await pool.query(countQuery, countParams);

    res.json({
      users,
      total: countResult[0].total,
      page: parseInt(page),
      totalPages: Math.ceil(countResult[0].total / limit)
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle user active status
exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get current status
    const [users] = await pool.query(
      'SELECT is_active FROM users WHERE user_id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newStatus = !users[0].is_active;

    // Update status
    await pool.query(
      'UPDATE users SET is_active = ? WHERE user_id = ?',
      [newStatus, userId]
    );

    res.json({
      message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`,
      is_active: newStatus
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user (admin only - use with caution)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const [users] = await pool.query(
      'SELECT user_id FROM users WHERE user_id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user (cascading deletes should handle related records)
    await pool.query('DELETE FROM users WHERE user_id = ?', [userId]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get chart data for analytics
exports.getChartData = async (req, res) => {
  try {
    // User growth over last 12 months
    const [userGrowth] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%b %Y') as month,
        DATE_FORMAT(created_at, '%Y-%m') as sort_month,
        COUNT(*) as count
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m'), DATE_FORMAT(created_at, '%b %Y')
      ORDER BY sort_month ASC
    `);

    // User distribution
    const [userDist] = await pool.query(`
      SELECT 
        SUM(CASE WHEN user_type = 'farmer' THEN 1 ELSE 0 END) as farmers,
        SUM(CASE WHEN user_type = 'buyer' THEN 1 ELSE 0 END) as buyers,
        SUM(CASE WHEN user_type = 'expert' THEN 1 ELSE 0 END) as experts
      FROM users
      WHERE user_type != 'admin'
    `);

    // Platform activity counts
    const [produce] = await pool.query('SELECT COUNT(*) as count FROM produce_listings');
    const [requests] = await pool.query('SELECT COUNT(*) as count FROM buyer_requests');
    const [advisory] = await pool.query('SELECT COUNT(*) as count FROM advisory_posts');
    const [forumPosts] = await pool.query('SELECT COUNT(*) as count FROM forum_posts');
    const [comments] = await pool.query('SELECT COUNT(*) as count FROM forum_comments');

    // Popular categories
    const [categories] = await pool.query(`
      SELECT 
        category,
        COUNT(*) as count
      FROM produce_listings
      WHERE category IS NOT NULL
      GROUP BY category
      ORDER BY count DESC
      LIMIT 8
    `);

    res.json({
      userGrowth: {
        labels: userGrowth.map(item => item.month),
        data: userGrowth.map(item => item.count)
      },
      userDistribution: {
        farmers: userDist[0].farmers,
        buyers: userDist[0].buyers,
        experts: userDist[0].experts
      },
      activity: {
        produce: produce[0].count,
        requests: requests[0].count,
        advisory: advisory[0].count,
        forumPosts: forumPosts[0].count,
        comments: comments[0].count
      },
      categories: {
        labels: categories.map(item => item.category),
        data: categories.map(item => item.count)
      }
    });
  } catch (error) {
    console.error('Get chart data error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};