const express = require('express');
const router = express.Router();
const {
    // Posts
    createAdvisoryPost,
    getAdvisoryPosts,
    getAdvisoryPost,
    getMyPosts,
    updateAdvisoryPost,
    deleteAdvisoryPost,
    
    // Questions
    createAdvisoryQuestion,
    getAdvisoryQuestions,
    getAdvisoryQuestion,
    getMyQuestions,
    updateAdvisoryQuestion,
    deleteAdvisoryQuestion,
    
    // Responses
    createAdvisoryResponse,
    updateAdvisoryResponse,
    deleteAdvisoryResponse
} = require('../controllers/advisoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

// 
// ADVISORY POSTS ROUTES
// 

// Public routes
router.get('/posts', getAdvisoryPosts);                    // Get all posts (with filters)
router.get('/posts/:id', getAdvisoryPost);                 // Get single post

// Protected routes (Experts only)
router.post('/posts', protect, authorize('expert'), createAdvisoryPost);           // Create post
router.get('/my-posts', protect, authorize('expert'), getMyPosts);                 // Get my posts
router.put('/posts/:id', protect, authorize('expert'), updateAdvisoryPost);        // Update post
router.delete('/posts/:id', protect, authorize('expert'), deleteAdvisoryPost);     // Delete post

// 
// ADVISORY QUESTIONS ROUTES
// 

// Public routes
router.get('/questions', getAdvisoryQuestions);             // Get all questions (with filters)
router.get('/questions/:id', getAdvisoryQuestion);          // Get single question with responses

// Protected routes (Farmers only)
router.post('/questions', protect, authorize('farmer'), createAdvisoryQuestion);           // Ask question
router.get('/my-questions', protect, authorize('farmer'), getMyQuestions);                 // Get my questions
router.put('/questions/:id', protect, authorize('farmer'), updateAdvisoryQuestion);        // Update question
router.delete('/questions/:id', protect, authorize('farmer'), deleteAdvisoryQuestion);     // Delete question

// 
// ADVISORY RESPONSES ROUTES
// 

// Protected routes (Experts only)
router.post('/questions/:id/responses', protect, authorize('expert'), createAdvisoryResponse);     // Respond to question
router.put('/responses/:id', protect, authorize('expert'), updateAdvisoryResponse);                // Update response
router.delete('/responses/:id', protect, authorize('expert'), deleteAdvisoryResponse);             // Delete response

module.exports = router;