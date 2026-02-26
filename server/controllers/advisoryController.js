const {
    // Posts
    createPost,
    getAllPosts,
    getPostCount,
    getPostById,
    getPostsByExpert,
    updatePost,
    deletePost,
    incrementPostViews,
    
    // Questions
    createQuestion,
    getAllQuestions,
    getQuestionCount,
    getQuestionById,
    getQuestionsByFarmer,
    updateQuestion,
    deleteQuestion,
    incrementQuestionViews,
    
    // Responses
    createResponse,
    getResponseById,
    updateResponse,
    deleteResponse
} = require('../models/advisoryModel');

// =============================================
// ADVISORY POSTS CONTROLLERS
// =============================================

/**
 * @desc    Create new advisory post
 * @route   POST /api/advisory/posts
 * @access  Private (Expert only)
 */
const createAdvisoryPost = async (req, res) => {
    try {
        const { title, content, category, tags, image_url } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title and content'
            });
        }

        const postId = await createPost({
            expert_id: req.user.user_id,
            title,
            content,
            category,
            tags,
            image_url
        });

        const newPost = await getPostById(postId);

        res.status(201).json({
            success: true,
            message: 'Advisory post created successfully',
            data: newPost
        });

    } catch (error) {
        console.error('Create advisory post error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating advisory post'
        });
    }
};

/**
 * @desc    Get all advisory posts with filters
 * @route   GET /api/advisory/posts
 * @access  Public
 */
const getAdvisoryPosts = async (req, res) => {
    try {
        const { category, search, expert_id, page = 1, limit = 20 } = req.query;

        const filters = {};
        if (category) filters.category = category;
        if (search) filters.search = search;
        if (expert_id) filters.expert_id = parseInt(expert_id);

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        const [posts, total] = await Promise.all([
            getAllPosts(filters, limitNum, offset),
            getPostCount(filters)
        ]);

        res.status(200).json({
            success: true,
            count: posts.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            data: posts
        });

    } catch (error) {
        console.error('Get advisory posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching advisory posts'
        });
    }
};

/**
 * @desc    Get single advisory post by ID
 * @route   GET /api/advisory/posts/:id
 * @access  Public
 */
const getAdvisoryPost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await getPostById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Advisory post not found'
            });
        }

        await incrementPostViews(id);

        res.status(200).json({
            success: true,
            data: post
        });

    } catch (error) {
        console.error('Get advisory post by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching advisory post'
        });
    }
};

/**
 * @desc    Get expert's own posts
 * @route   GET /api/advisory/my-posts
 * @access  Private (Expert only)
 */
const getMyPosts = async (req, res) => {
    try {
        console.log('🔍 Getting posts for user_id:', req.user.user_id);

        const posts = await getPostsByExpert(req.user.user_id);

        console.log('📊 Posts found:', posts.length);

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });

    } catch (error) {
        console.error('Get my posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching your posts'
        });
    }
};

/**
 * @desc    Update advisory post
 * @route   PUT /api/advisory/posts/:id
 * @access  Private (Expert only - own post)
 */
const updateAdvisoryPost = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const post = await getPostById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Advisory post not found'
            });
        }

        if (post.expert_id !== req.user.user_id) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this post'
            });
        }

        const updated = await updatePost(id, updateData);

        if (!updated) {
            return res.status(400).json({
                success: false,
                message: 'No changes were made'
            });
        }

        const updatedPost = await getPostById(id);

        res.status(200).json({
            success: true,
            message: 'Advisory post updated successfully',
            data: updatedPost
        });

    } catch (error) {
        console.error('Update advisory post error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating advisory post'
        });
    }
};

/**
 * @desc    Delete advisory post
 * @route   DELETE /api/advisory/posts/:id
 * @access  Private (Expert only - own post)
 */
const deleteAdvisoryPost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await getPostById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Advisory post not found'
            });
        }

        if (post.expert_id !== req.user.user_id) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this post'
            });
        }

        await deletePost(id);

        res.status(200).json({
            success: true,
            message: 'Advisory post deleted successfully'
        });

    } catch (error) {
        console.error('Delete advisory post error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting advisory post'
        });
    }
};

// =============================================
// ADVISORY QUESTIONS CONTROLLERS
// =============================================

/**
 * @desc    Create new question
 * @route   POST /api/advisory/questions
 * @access  Private (Farmer only)
 */
const createAdvisoryQuestion = async (req, res) => {
    try {
        const { title, question_text, category } = req.body;

        if (!title || !question_text) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title and question'
            });
        }

        const questionId = await createQuestion({
            farmer_id: req.user.user_id,
            title,
            question_text,
            category
        });

        const newQuestion = await getQuestionById(questionId);

        res.status(201).json({
            success: true,
            message: 'Question posted successfully',
            data: newQuestion
        });

    } catch (error) {
        console.error('Create question error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while posting question'
        });
    }
};

/**
 * @desc    Get all questions with filters
 * @route   GET /api/advisory/questions
 * @access  Public
 */
const getAdvisoryQuestions = async (req, res) => {
    try {
        const { category, search, status, page = 1, limit = 20 } = req.query;

        const filters = {};
        if (category) filters.category = category;
        if (search) filters.search = search;
        if (status) filters.status = status;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        const [questions, total] = await Promise.all([
            getAllQuestions(filters, limitNum, offset),
            getQuestionCount(filters)
        ]);

        res.status(200).json({
            success: true,
            count: questions.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            data: questions
        });

    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching questions'
        });
    }
};

/**
 * @desc    Get single question by ID
 * @route   GET /api/advisory/questions/:id
 * @access  Public
 */
const getAdvisoryQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await getQuestionById(id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        await incrementQuestionViews(id);

        res.status(200).json({
            success: true,
            data: question
        });

    } catch (error) {
        console.error('Get question by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching question'
        });
    }
};

/**
 * @desc    Get farmer's own questions
 * @route   GET /api/advisory/my-questions
 * @access  Private (Farmer only)
 */
const getMyQuestions = async (req, res) => {
    try {
        const questions = await getQuestionsByFarmer(req.user.user_id);

        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });

    } catch (error) {
        console.error('Get my questions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching your questions'
        });
    }
};

/**
 * @desc    Update question
 * @route   PUT /api/advisory/questions/:id
 * @access  Private (Farmer only - own question)
 */
const updateAdvisoryQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const [rows] = await require('../config/db').pool.query(
            'SELECT * FROM advisory_questions WHERE question_id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        const question = rows[0];

        if (question.farmer_id !== req.user.user_id) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this question'
            });
        }

        const updated = await updateQuestion(id, updateData);

        if (!updated) {
            return res.status(400).json({
                success: false,
                message: 'No changes were made'
            });
        }

        const updatedQuestion = await getQuestionById(id);

        res.status(200).json({
            success: true,
            message: 'Question updated successfully',
            data: updatedQuestion
        });

    } catch (error) {
        console.error('Update question error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating question'
        });
    }
};

/**
 * @desc    Delete question
 * @route   DELETE /api/advisory/questions/:id
 * @access  Private (Farmer only - own question)
 */
const deleteAdvisoryQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await require('../config/db').pool.query(
            'SELECT * FROM advisory_questions WHERE question_id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        const question = rows[0];

        if (question.farmer_id !== req.user.user_id) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this question'
            });
        }

        await deleteQuestion(id);

        res.status(200).json({
            success: true,
            message: 'Question deleted successfully'
        });

    } catch (error) {
        console.error('Delete question error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting question'
        });
    }
};

// =============================================
// ADVISORY RESPONSES CONTROLLERS
// =============================================

/**
 * @desc    Create response to a question
 * @route   POST /api/advisory/questions/:id/responses
 * @access  Private (Expert only)
 */
const createAdvisoryResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const { response_text } = req.body;

        if (!response_text) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a response'
            });
        }

        const question = await getQuestionById(id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        const responseId = await createResponse({
            question_id: id,
            expert_id: req.user.user_id,
            response_text
        });

        const newResponse = await getResponseById(responseId);

        res.status(201).json({
            success: true,
            message: 'Response posted successfully',
            data: newResponse
        });

    } catch (error) {
        console.error('Create response error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while posting response'
        });
    }
};

/**
 * @desc    Update response
 * @route   PUT /api/advisory/responses/:id
 * @access  Private (Expert only - own response)
 */
const updateAdvisoryResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const response = await getResponseById(id);

        if (!response) {
            return res.status(404).json({
                success: false,
                message: 'Response not found'
            });
        }

        if (response.expert_id !== req.user.user_id) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this response'
            });
        }

        const updated = await updateResponse(id, updateData);

        if (!updated) {
            return res.status(400).json({
                success: false,
                message: 'No changes were made'
            });
        }

        const updatedResponse = await getResponseById(id);

        res.status(200).json({
            success: true,
            message: 'Response updated successfully',
            data: updatedResponse
        });

    } catch (error) {
        console.error('Update response error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating response'
        });
    }
};

/**
 * @desc    Delete response
 * @route   DELETE /api/advisory/responses/:id
 * @access  Private (Expert only - own response)
 */
const deleteAdvisoryResponse = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await getResponseById(id);

        if (!response) {
            return res.status(404).json({
                success: false,
                message: 'Response not found'
            });
        }

        if (response.expert_id !== req.user.user_id) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this response'
            });
        }

        await deleteResponse(id);

        res.status(200).json({
            success: true,
            message: 'Response deleted successfully'
        });

    } catch (error) {
        console.error('Delete response error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting response'
        });
    }
};

module.exports = {
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
};
