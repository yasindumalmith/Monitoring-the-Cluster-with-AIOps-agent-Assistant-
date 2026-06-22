const chatService = require('../services/ChatService');

/**
 * Controller to handle fetching the chat history for a user
 */
const getChatHistory = async (req, res) => {
    try {
        // The userId is injected into req.user by the verifyToken middleware
        const userId = req.user.userId;
        
        const history = await chatService.getChatHistory(userId);
        
        res.status(200).json(history);
    } catch (error) {
        console.error('Controller Error - getChatHistory:', error);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
};

/**
 * Controller to handle fetching all messages for a specific chat session
 */
const getChatSession = async (req, res) => {
    try {
        const userId = req.user.userId;
        const chatId = req.params.chatId;
        
        const messages = await chatService.getChatSession(userId, chatId);
        
        res.status(200).json(messages);
    } catch (error) {
        console.error('Controller Error - getChatSession:', error);
        res.status(500).json({ error: 'Failed to fetch chat session messages' });
    }
};

module.exports = {
    getChatHistory,
    getChatSession
};
