import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChatWindow } from '../components/chat/ChatWindow';
import { ChatInput } from '../components/chat/ChatInput';
import type { Message } from '../components/chat/ChatMessage';
import { ChatService } from '../services/ChatService';
export function ChatPage() {
  const [searchParams] = useSearchParams();
  const queryChatId = searchParams.get('id');

  const [chatId, setChatId] = useState(() => queryChatId || crypto.randomUUID());
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hello! I am your AIOps Assistant. How can I help you diagnose the cluster today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      if (!queryChatId) {
        setChatId(crypto.randomUUID());
        setMessages([{ id: '1', role: 'assistant', content: 'Hello! I am your AIOps Assistant. How can I help you diagnose the cluster today?' }]);
        return;
      }

      setChatId(queryChatId);
      setIsTyping(true);
      try {
        const token = sessionStorage.getItem('token');
        if (token) {
          const loadedMessages = await ChatService.loadChatSession(queryChatId, token);
          if (loadedMessages.length > 0) {
            setMessages(loadedMessages);
          } else {
            setMessages([{ id: '1', role: 'assistant', content: 'Hello! I am your AIOps Assistant. How can I help you diagnose the cluster today?' }]);
          }
        }
      } catch (err) {
        console.error("Failed to load chat", err);
      } finally {
        setIsTyping(false);
      }
    };
    
    loadSession();
  }, [queryChatId]);

  const handleSendMessage = async (text: string) => {
    // 1. Add user message instantly
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      // 2. Call the ChatService to handle all the complex payload mapping
      const aiResponse = await ChatService.sendMessage(chatId, updatedMessages, token);
      
      // 3. Receive and add the clean AI response directly to state
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      // Optionally add an error message to the chat
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: '**Error:** Failed to communicate with the AIOps agent.' 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full max-h-[calc(100vh-8rem)] flex flex-col bg-[#040d24]/30 border border-purple-900/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(128,90,213,0.05)]">
      <div className="px-6 py-4 border-b border-purple-900/30 bg-purple-950/20 flex items-center justify-between">
        <h1 className="text-lg font-bold text-white tracking-wide">AIOps Diagnostic Chat</h1>
      </div>
      <ChatWindow messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isTyping} />
    </div>
  );
}
