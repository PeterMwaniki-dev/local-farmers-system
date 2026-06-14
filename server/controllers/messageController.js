const {
    createMessage,
    hasConversation,
    getThread,
    getConversations,
    getUnreadCount,
    markAsRead,
    getMessageById,
    getUserById
} = require('../models/messageModel');

/**
 * Validate whether the sender is allowed to message the receiver
 */
const canSendMessage = async (sender, receiver) => {
    if (sender.user_id === receiver.user_id) {
        return { allowed: false, message: 'You cannot message yourself' };
    }

    if (!receiver.is_active) {
        return { allowed: false, message: 'This user account is not available' };
    }

    if (sender.user_type === 'admin') {
        return { allowed: false, message: 'Admin accounts cannot use messaging' };
    }

    const conversationExists = await hasConversation(sender.user_id, receiver.user_id);

    // Buyers and experts can start a conversation with a farmer, or continue an existing thread
    if (sender.user_type === 'buyer' || sender.user_type === 'expert') {
        if (conversationExists || receiver.user_type === 'farmer') {
            return { allowed: true };
        }
        return { allowed: false, message: 'You can only message farmers about produce' };
    }

    // Farmers can reply only if a conversation already exists
    if (sender.user_type === 'farmer') {
        if (conversationExists) {
            return { allowed: true };
        }
        return { allowed: false, message: 'You can only reply to users who have messaged you' };
    }

    return { allowed: false, message: 'You are not authorized to send messages' };
};

/**
 * @desc    Send a message
 * @route   POST /api/messages
 * @access  Private
 */
const sendMessage = async (req, res) => {
    try {
        const { receiver_id, message_text, subject } = req.body;
        const sender = req.user;

        if (!receiver_id || !message_text || !message_text.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a receiver and message text'
            });
        }

        const receiver = await getUserById(receiver_id);
        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: 'Receiver not found'
            });
        }

        const permission = await canSendMessage(sender, receiver);
        if (!permission.allowed) {
            return res.status(403).json({
                success: false,
                message: permission.message
            });
        }

        const messageId = await createMessage({
            sender_id: sender.user_id,
            receiver_id: Number(receiver_id),
            subject: subject?.trim() || null,
            message_text: message_text.trim()
        });

        const newMessage = await getMessageById(messageId);

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: newMessage
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while sending message'
        });
    }
};

/**
 * @desc    Get inbox conversations
 * @route   GET /api/messages/conversations
 * @access  Private
 */
const getInbox = async (req, res) => {
    try {
        if (req.user.user_type === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin accounts cannot use messaging'
            });
        }

        const conversations = await getConversations(req.user.user_id);

        res.status(200).json({
            success: true,
            data: conversations
        });
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while loading conversations'
        });
    }
};

/**
 * @desc    Get message thread with a specific user
 * @route   GET /api/messages/thread/:userId
 * @access  Private
 */
const getMessageThread = async (req, res) => {
    try {
        const otherUserId = Number(req.params.userId);
        const currentUser = req.user;

        if (req.user.user_type === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin accounts cannot use messaging'
            });
        }

        const otherUser = await getUserById(otherUserId);
        if (!otherUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const conversationExists = await hasConversation(currentUser.user_id, otherUserId);
        if (!conversationExists) {
            // Allow opening an empty thread only when buyer/expert wants to message a farmer
            const canStart =
                (currentUser.user_type === 'buyer' || currentUser.user_type === 'expert') &&
                otherUser.user_type === 'farmer';

            if (!canStart) {
                return res.status(403).json({
                    success: false,
                    message: 'No conversation found with this user'
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    partner: otherUser,
                    messages: []
                }
            });
        }

        await markAsRead(currentUser.user_id, otherUserId);
        const messages = await getThread(currentUser.user_id, otherUserId);

        res.status(200).json({
            success: true,
            data: {
                partner: otherUser,
                messages
            }
        });
    } catch (error) {
        console.error('Get thread error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while loading messages'
        });
    }
};

/**
 * @desc    Get unread message count
 * @route   GET /api/messages/unread-count
 * @access  Private
 */
const getUnreadMessageCount = async (req, res) => {
    try {
        if (req.user.user_type === 'admin') {
            return res.status(200).json({ success: true, data: { count: 0 } });
        }

        const count = await getUnreadCount(req.user.user_id);

        res.status(200).json({
            success: true,
            data: { count }
        });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while loading unread count'
        });
    }
};

/**
 * @desc    Mark messages from a user as read
 * @route   PATCH /api/messages/read/:userId
 * @access  Private
 */
const markMessagesAsRead = async (req, res) => {
    try {
        const senderId = Number(req.params.userId);
        const affected = await markAsRead(req.user.user_id, senderId);

        res.status(200).json({
            success: true,
            message: 'Messages marked as read',
            data: { updated: affected }
        });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while marking messages as read'
        });
    }
};

module.exports = {
    sendMessage,
    getInbox,
    getMessageThread,
    getUnreadMessageCount,
    markMessagesAsRead
};
