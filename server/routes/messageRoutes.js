const express = require('express');
const router = express.Router();
const {
    sendMessage,
    getInbox,
    getMessageThread,
    getUnreadMessageCount,
    markMessagesAsRead
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getInbox);
router.get('/unread-count', protect, getUnreadMessageCount);
router.get('/thread/:userId', protect, getMessageThread);
router.patch('/read/:userId', protect, markMessagesAsRead);

module.exports = router;
