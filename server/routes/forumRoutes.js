const express = require('express');
const router = express.Router();
const {
  getAllForumPosts,
  getForumPostById,
  incrementForumPostViews,
  getMyForumPosts,
  createForumPost,
  updateForumPost,
  deleteForumPost,
  getPostComments,
  createComment,
  deleteComment
} = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/posts', getAllForumPosts);
router.get('/posts/:id', getForumPostById);
router.post('/posts/:id/view', incrementForumPostViews);
router.get('/posts/:postId/comments', getPostComments);

// Protected routes
router.post('/posts', protect, createForumPost);
router.get('/my-posts', protect, getMyForumPosts);
router.put('/posts/:id', protect, updateForumPost);
router.delete('/posts/:id', protect, deleteForumPost);
router.post('/posts/:postId/comments', protect, createComment);
router.delete('/comments/:commentId', protect, deleteComment);

module.exports = router;