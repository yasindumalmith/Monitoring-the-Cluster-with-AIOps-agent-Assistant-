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

export interface ChatSessionPreview {
  chat_id: string;
  first_question: string;
  last_activity: string;
}

export const fetchChatHistory = async (token: string): Promise<ChatSessionPreview[]> => {
  const response = await fetch(`${API_URL}/chat/history`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch chat history');
  }

  return response.json();
};
