const { pool } = require('../config/db');

// Get all forum posts (with optional filters)
exports.getAllForumPosts = async (req, res) => {
  try {
    const { search, category } = req.query;
    
    let query = `
      SELECT 
        fp.*,
        u.full_name as user_name,
        u.user_type,
        (SELECT COUNT(*) FROM forum_comments WHERE post_id = fp.post_id) as comment_count
      FROM forum_posts fp
      JOIN users u ON fp.user_id = u.user_id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (search) {
      query += ' AND (fp.title LIKE ? OR fp.content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (category) {
      query += ' AND fp.category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY fp.created_at DESC';
    
    const [posts] = await pool.query(query, params);
    res.json(posts);
  } catch (error) {
    console.error('Get forum posts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single forum post by ID
exports.getForumPostById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [posts] = await pool.query(
      `SELECT 
        fp.*,
        u.full_name as user_name,
        u.user_type
      FROM forum_posts fp
      JOIN users u ON fp.user_id = u.user_id
      WHERE fp.post_id = ?`,
      [id]
    );
    
    if (posts.length === 0) {
      return res.status(404).json({ message: 'Forum post not found' });
    }

    res.json(posts[0]);
  } catch (error) {
    console.error('Get forum post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Increment views for a forum post (dedicated endpoint)
exports.incrementForumPostViews = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'UPDATE forum_posts SET views_count = views_count + 1 WHERE post_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Forum post not found' });
    }

    res.json({ message: 'View recorded' });
  } catch (error) {
    console.error('Increment forum post views error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's own forum posts
exports.getMyForumPosts = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const [posts] = await pool.query(
      `SELECT 
        fp.*,
        (SELECT COUNT(*) FROM forum_comments WHERE post_id = fp.post_id) as comment_count
      FROM forum_posts fp
      WHERE fp.user_id = ?
      ORDER BY fp.created_at DESC`,
      [userId]
    );
    
    res.json(posts);
  } catch (error) {
    console.error('Get my forum posts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create forum post
exports.createForumPost = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { title, content, category } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO forum_posts (user_id, title, content, category) VALUES (?, ?, ?, ?)',
      [userId, title, content, category || 'General Discussion']
    );
    
    res.status(201).json({
      message: 'Forum post created successfully',
      post_id: result.insertId
    });
  } catch (error) {
    console.error('Create forum post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update forum post
exports.updateForumPost = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;
    const { title, content, category } = req.body;
    
    // Check if post exists and belongs to user
    const [posts] = await pool.query(
      'SELECT * FROM forum_posts WHERE post_id = ? AND user_id = ?',
      [id, userId]
    );
    
    if (posts.length === 0) {
      return res.status(404).json({ message: 'Forum post not found or unauthorized' });
    }
    
    await pool.query(
      'UPDATE forum_posts SET title = ?, content = ?, category = ?, updated_at = NOW() WHERE post_id = ?',
      [title, content, category, id]
    );
    
    res.json({ message: 'Forum post updated successfully' });
  } catch (error) {
    console.error('Update forum post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete forum post (allows both owner and admin)
exports.deleteForumPost = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const userType = req.user.user_type;
    const { id } = req.params;
    
    // Check if post exists
    const [posts] = await pool.query(
      'SELECT * FROM forum_posts WHERE post_id = ?',
      [id]
    );
    
    if (posts.length === 0) {
      return res.status(404).json({ message: 'Forum post not found' });
    }
    
    // Check if user owns this post OR is admin
    const isAdmin = userType === 'admin';
    const isOwner = posts[0].user_id === userId;
    
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }
    
    // Delete associated comments first
    await pool.query('DELETE FROM forum_comments WHERE post_id = ?', [id]);
    
    // Delete post
    await pool.query('DELETE FROM forum_posts WHERE post_id = ?', [id]);
    
    res.json({ message: 'Forum post deleted successfully' });
  } catch (error) {
    console.error('Delete forum post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ============ COMMENTS ============

// Get comments for a post
exports.getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    
    const [comments] = await pool.query(
      `SELECT 
        fc.*,
        u.full_name as user_name,
        u.user_type
      FROM forum_comments fc
      JOIN users u ON fc.user_id = u.user_id
      WHERE fc.post_id = ?
      ORDER BY fc.created_at ASC`,
      [postId]
    );
    
    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create comment
exports.createComment = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { postId } = req.params;
    const { comment_text } = req.body;
    
    if (!comment_text) {
      return res.status(400).json({ message: 'Please provide comment text' });
    }
    
    // Check if post exists
    const [posts] = await pool.query('SELECT * FROM forum_posts WHERE post_id = ?', [postId]);
    
    if (posts.length === 0) {
      return res.status(404).json({ message: 'Forum post not found' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO forum_comments (post_id, user_id, comment_text) VALUES (?, ?, ?)',
      [postId, userId, comment_text]
    );
    
    res.status(201).json({
      message: 'Comment added successfully',
      comment_id: result.insertId
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete comment (allows both owner and admin)
exports.deleteComment = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const userType = req.user.user_type;
    const { commentId } = req.params;
    
    // Check if comment exists
    const [comments] = await pool.query(
      'SELECT * FROM forum_comments WHERE comment_id = ?',
      [commentId]
    );
    
    if (comments.length === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user owns this comment OR is admin
    const isAdmin = userType === 'admin';
    const isOwner = comments[0].user_id === userId;
    
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment' });
    }
    
    await pool.query('DELETE FROM forum_comments WHERE comment_id = ?', [commentId]);
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};