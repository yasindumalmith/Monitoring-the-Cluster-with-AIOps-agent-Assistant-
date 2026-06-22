const podDB = require('../database/podDB');

/**
 * Fetches all conversation messages for a specific user and chat session.
 * @param {number} userId - The ID of the user
 * @param {string} chatId - The UUID of the chat session
 * @returns {Promise<Array>} List of conversation rows ordered by creation time
 */
const getConversationsByChatId = async (userId, chatId) => {
    const query = `
        SELECT * 
        FROM conversations
        WHERE user_id = $1 AND chat_id = $2
        ORDER BY created_at ASC;
    `;
    const values = [userId, chatId];
    
    try {
        const result = await podDB.query(query, values);
        return result.rows;
    } catch (error) {
        console.error('Error fetching conversations by chat ID:', error);
        throw error;
    }
};

/**
 * Fetches a list of unique chat sessions for a specific user (useful for a sidebar).
 * Includes the first question and its corresponding answer to display a rich preview.
 * @param {number} userId - The ID of the user
 * @returns {Promise<Array>} List of distinct chats ordered by most recent
 */
const getChatsByUserId = async (userId) => {
    const query = `
        WITH FirstMessages AS (
            SELECT DISTINCT ON (chat_id) chat_id, question
            FROM conversations
            WHERE user_id = $1 AND chat_id IS NOT NULL
            ORDER BY chat_id, created_at ASC
        ),
        LastActivity AS (
            SELECT chat_id, MAX(created_at) as last_activity
            FROM conversations
            WHERE user_id = $1 AND chat_id IS NOT NULL
            GROUP BY chat_id
        )
        SELECT 
            f.chat_id, 
            f.question as first_question, 
            l.last_activity
        FROM FirstMessages f
        JOIN LastActivity l ON f.chat_id = l.chat_id
        ORDER BY l.last_activity DESC;
    `;
    const values = [userId];
    
    try {
        const result = await podDB.query(query, values);
        return result.rows;
    } catch (error) {
        console.error('Error fetching user chats:', error);
        throw error;
    }
};

module.exports = {
    getConversationsByChatId,
    getChatsByUserId
};
