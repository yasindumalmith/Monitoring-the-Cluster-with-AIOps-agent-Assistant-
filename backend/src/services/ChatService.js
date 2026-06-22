const chatRepository = require('../repository/chatRepository');

/**
 * Retrieves the distinct chat sessions for a specific user
 * @param {number} userId - The ID of the authenticated user
 * @returns {Promise<Array>} List of chat sessions
 */
const getChatHistory = async (userId) => {
    try {
        const chats = await chatRepository.getChatsByUserId(userId);
        return chats;
    } catch (error) {
        console.error('Service Error - getChatHistory:', error);
        throw new Error('Could not fetch chat history');
    }
};

/**
 * Retrieves all messages for a specific chat session
 * @param {number} userId - The ID of the authenticated user
 * @param {string} chatId - The UUID of the chat session
 * @returns {Promise<Array>} List of messages
 */
const getChatSession = async (userId, chatId) => {
    try {
        const messages = await chatRepository.getConversationsByChatId(userId, chatId);
        return messages;
    } catch (error) {
        console.error('Service Error - getChatSession:', error);
        throw new Error('Could not fetch chat session messages');
    }
};

module.exports = {
    getChatHistory,
    getChatSession
};
