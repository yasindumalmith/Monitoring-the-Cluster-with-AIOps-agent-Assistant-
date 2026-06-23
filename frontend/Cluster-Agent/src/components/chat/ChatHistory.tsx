import { PlusCircle, MessageSquare } from 'lucide-react';

export interface ChatSessionPreview {
  chat_id: string;
  first_question: string;
  last_activity: string;
}

interface ChatHistoryProps {
  sessions: ChatSessionPreview[];
  currentChatId: string;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

export function ChatHistory({ sessions, currentChatId, onSelectChat, onNewChat }: ChatHistoryProps) {
  return (
    <div className="w-64 bg-[#0a1020] border-r border-purple-900/30 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-purple-900/30">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white py-2 px-4 rounded-lg transition-colors font-medium shadow-[0_0_15px_rgba(128,90,213,0.3)]"
        >
          <PlusCircle className="w-5 h-5" />
          New Chat
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sessions.length === 0 ? (
          <div className="text-slate-500 text-sm text-center mt-4">No previous chats</div>
        ) : (
          sessions.map((session) => (
            <button
              key={session.chat_id}
              onClick={() => onSelectChat(session.chat_id)}
              className={`w-full text-left p-3 rounded-lg transition-colors group relative flex flex-col gap-1 ${
                currentChatId === session.chat_id 
                  ? 'bg-purple-900/40 border border-purple-500/30 shadow-[0_0_10px_rgba(128,90,213,0.1)]' 
                  : 'hover:bg-slate-800/50 border border-transparent hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-2 overflow-hidden w-full">
                <MessageSquare className={`w-4 h-4 mt-0.5 shrink-0 ${currentChatId === session.chat_id ? 'text-purple-400' : 'text-slate-500 group-hover:text-purple-400'}`} />
                <div className="truncate flex-1">
                  <div className={`text-sm font-medium truncate ${currentChatId === session.chat_id ? 'text-purple-200' : 'text-slate-300 group-hover:text-purple-200'}`}>
                    {session.first_question || 'New Conversation'}
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-500 truncate w-full pl-6">
                {new Date(session.last_activity).toLocaleDateString()}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
