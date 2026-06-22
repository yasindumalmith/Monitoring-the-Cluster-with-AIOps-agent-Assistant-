import { useState } from 'react';
import { ChatWindow } from '../components/chat/ChatWindow';
import { ChatInput } from '../components/chat/ChatInput';
import type { Message } from '../components/chat/ChatMessage';

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hello! I am your AIOps Assistant. How can I help you diagnose the cluster today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (text: string) => {
    // 1. Add user message instantly
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // 2. Simulate POST /chat API call
    setTimeout(() => {
      // 3. Receive and add AI response
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: `I've analyzed the cluster for: **"${text}"**.\n\nAll systems appear nominal, but I found some warnings in the \`kube-system\` namespace.\n\nWould you like me to fetch the detailed logs?`,
        tool_calls: [
          { id: 't1', name: 'get_pods', result: { namespace: 'kube-system', count: 14, unhealthy: 2 } },
          { id: 't2', name: 'describe_resource', result: { kind: 'Pod', name: 'coredns-6d4b75cb6d-8bz9v', status: 'CrashLoopBackOff', restartCount: 96 } },
          { id: 't3', name: 'log_cluster_incident', result: { success: true, incidentId: 'INC-9042' } }
        ]
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 2500); // 2.5 second delay
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
