import type { Message } from '../components/chat/ChatMessage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const sendChatMessage = async (chatId: string, messages: Message[], token: string) => {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ chat_id: chatId, messages }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || result.message || 'Failed to send message');
  }

  return result;
};
