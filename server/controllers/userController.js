const { pool } = require('../config/db');

// Get current user's profile
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;

    // Get user data
    const [users] = await pool.query(
      'SELECT user_id, full_name, email, phone_number, user_type, location, profile_image, created_at, updated_at, is_active FROM users WHERE user_id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // Get role-specific profile based on user type
    if (user.user_type === 'farmer') {
      const [farmerProfile] = await pool.query(
        'SELECT * FROM farmer_profiles WHERE user_id = ?',
        [userId]
      );
      user.farmer_profile = farmerProfile[0] || null;
    } else if (user.user_type === 'expert') {
      const [expertProfile] = await pool.query(
        'SELECT * FROM expert_profiles WHERE user_id = ?',
        [userId]
      );
      user.expert_profile = expertProfile[0] || null;
    } else if (user.user_type === 'buyer') {
      const [buyerProfile] = await pool.query(
        'SELECT * FROM buyer_profiles WHERE user_id = ?',
        [userId]
      );
      user.buyer_profile = buyerProfile[0] || null;
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user by ID (public)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.query(
      'SELECT user_id, full_name, user_type, location, profile_image, created_at FROM users WHERE user_id = ? AND is_active = TRUE',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      full_name,
      email,
      phone_number,
      location,
      // Farmer fields
      farm_size,
      farm_location,
      main_crops,
      farming_experience,
      // Expert fields
      specialization,
      qualification,
      years_of_experience,
      organization,
      // Buyer fields
      business_name,
      business_type,
      preferred_produce,
      delivery_location
    } = req.body;

    // Update main user table
    await pool.query(
      'UPDATE users SET full_name = ?, email = ?, phone_number = ?, location = ?, updated_at = NOW() WHERE user_id = ?',
      [full_name, email, phone_number, location, userId]
    );

    // Get user type to update role-specific profile
    const [users] = await pool.query('SELECT user_type FROM users WHERE user_id = ?', [userId]);
    const userType = users[0].user_type;

    // Update role-specific profile
    if (userType === 'farmer') {
      // Check if farmer profile exists
      const [existing] = await pool.query('SELECT * FROM farmer_profiles WHERE user_id = ?', [userId]);
      
      if (existing.length > 0) {
        // Update existing profile
        await pool.query(
          'UPDATE farmer_profiles SET farm_size = ?, farm_location = ?, main_crops = ?, farming_experience = ? WHERE user_id = ?',
          [farm_size, farm_location, main_crops, farming_experience, userId]
        );
      } else {
        // Create new profile
        await pool.query(
          'INSERT INTO farmer_profiles (user_id, farm_size, farm_location, main_crops, farming_experience) VALUES (?, ?, ?, ?, ?)',
          [userId, farm_size, farm_location, main_crops, farming_experience]
        );
      }
    } else if (userType === 'expert') {
      const [existing] = await pool.query('SELECT * FROM expert_profiles WHERE user_id = ?', [userId]);
      
      if (existing.length > 0) {
        await pool.query(
          'UPDATE expert_profiles SET specialization = ?, qualification = ?, years_of_experience = ?, organization = ? WHERE user_id = ?',
          [specialization, qualification, years_of_experience, organization, userId]
        );
      } else {
        await pool.query(
          'INSERT INTO expert_profiles (user_id, specialization, qualification, years_of_experience, organization) VALUES (?, ?, ?, ?, ?)',
          [userId, specialization, qualification, years_of_experience, organization]
        );
      }
    } else if (userType === 'buyer') {
      const [existing] = await pool.query('SELECT * FROM buyer_profiles WHERE user_id = ?', [userId]);
      
      if (existing.length > 0) {
        await pool.query(
          'UPDATE buyer_profiles SET business_name = ?, business_type = ?, preferred_produce = ?, delivery_location = ? WHERE user_id = ?',
          [business_name, business_type, preferred_produce, delivery_location, userId]
        );
      } else {
        await pool.query(
          'INSERT INTO buyer_profiles (user_id, business_name, business_type, preferred_produce, delivery_location) VALUES (?, ?, ?, ?, ?)',
          [userId, business_name, business_type, preferred_produce, delivery_location]
        );
      }
    }

    // Get updated profile
    const [updatedUsers] = await pool.query(
      'SELECT user_id, full_name, email, phone_number, user_type, location, profile_image, created_at FROM users WHERE user_id = ?',
      [userId]
    );

    res.json({ message: 'Profile updated successfully', user: updatedUsers[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    // Get current password hash
    const [users] = await pool.query(
      'SELECT password_hash FROM users WHERE user_id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(current_password, users[0].password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(new_password, 10);

    // Update password
    await pool.query(
      'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE user_id = ?',
      [newPasswordHash, userId]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const [users] = await pool.query('SELECT user_type FROM users WHERE user_id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userType = users[0].user_type;
    const stats = {};

    if (userType === 'farmer') {
      // Get farmer stats
      const [produceStats] = await pool.query(
        'SELECT COUNT(*) as total_listings, SUM(CASE WHEN status = "available" THEN 1 ELSE 0 END) as active_listings FROM produce_listings WHERE farmer_id = ?',
        [userId]
      );
      stats.total_listings = produceStats[0].total_listings || 0;
      stats.active_listings = produceStats[0].active_listings || 0;
    } else if (userType === 'buyer') {
      // Get buyer stats
      const [requestStats] = await pool.query(
        'SELECT COUNT(*) as total_requests, SUM(CASE WHEN status = "open" THEN 1 ELSE 0 END) as open_requests FROM buyer_requests WHERE buyer_id = ?',
        [userId]
      );
      stats.total_requests = requestStats[0].total_requests || 0;
      stats.open_requests = requestStats[0].open_requests || 0;
    } else if (userType === 'expert') {
      // Get expert stats
      const [postStats] = await pool.query(
        'SELECT COUNT(*) as total_posts, SUM(views_count) as total_views FROM advisory_posts WHERE expert_id = ?',
        [userId]
      );
      stats.total_posts = postStats[0].total_posts || 0;
      stats.total_views = postStats[0].total_views || 0;
    }

    // Get forum posts count for all users
    const [forumStats] = await pool.query(
      'SELECT COUNT(*) as forum_posts FROM forum_posts WHERE user_id = ?',
      [userId]
    );
    stats.forum_posts = forumStats[0].forum_posts || 0;

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get public stats for landing page
exports.getPublicStats = async (req, res) => {
  try {
    const [farmers] = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE user_type = "farmer"'
    );
    
    const [buyers] = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE user_type = "buyer"'
    );
    
    const [experts] = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE user_type = "expert"'
    );

    res.json({
      success: true,
      data: {
        farmers: farmers[0].count,
        buyers: buyers[0].count,
        experts: experts[0].count
      }
    });
  } catch (error) {
    console.error('Get public stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get stats'
    });
  }
};