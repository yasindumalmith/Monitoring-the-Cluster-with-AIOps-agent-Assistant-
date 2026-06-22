import { sendChatMessage } from '../api/chat';
import type { Message, ToolCall } from '../components/chat/ChatMessage';
import { marked } from 'marked';

export class ChatService {
  /**
   * Sends a chat message to the AIOps backend and parses the complex Python 
   * response format into the streamlined Message interface required by the React UI.
   */
  static async sendMessage(chatId: string, messages: Message[], token: string): Promise<Message> {
    try {
      // 1. Call the raw API which proxies to the Python AI Agent
      const rawResponse = await sendChatMessage(chatId, messages, token);

      // 2. Safely parse and map tool_calls from Python format to UI format
      const toolCalls: ToolCall[] = (rawResponse.tool_calls || []).map((tc: any, index: number) => ({
        id: `tool-${rawResponse.request_id || Date.now()}-${index}`,
        name: tc.tool || 'unknown_tool',
        result: tc.result
      }));

      // Convert Markdown content to HTML
      const htmlContent = rawResponse.content 
        ? await marked.parse(rawResponse.content) 
        : 'I encountered an issue processing your request. The response was empty.';

      // 3. Construct and return the clean Message object for the UI
      return {
        id: rawResponse.request_id || Date.now().toString(),
        role: 'assistant',
        content: htmlContent,
        tool_calls: toolCalls.length > 0 ? toolCalls : undefined
      };
    } catch (error) {
      console.error('ChatService failed to process message:', error);
      throw error;
    }
  }
}
