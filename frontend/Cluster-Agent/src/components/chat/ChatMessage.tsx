import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAI = message.role === 'assistant';

  return (
    <div className={`flex gap-4 p-6 transition-colors ${isAI ? 'bg-purple-900/10 border-y border-purple-900/30' : 'hover:bg-slate-900/30'}`}>
      <div className={`flex-shrink-0 h-10 w-10 mt-1 rounded-xl flex items-center justify-center shadow-lg ${
        isAI ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white' : 'bg-slate-800 border border-slate-700 text-slate-300'
      }`}>
        {isAI ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className={`font-semibold text-sm tracking-wide mb-2 ${isAI ? 'text-purple-400' : 'text-slate-400'}`}>
          {isAI ? 'AIOps Assistant' : 'You'}
        </p>
        <div className="prose prose-invert prose-purple max-w-none text-slate-200 leading-relaxed">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
