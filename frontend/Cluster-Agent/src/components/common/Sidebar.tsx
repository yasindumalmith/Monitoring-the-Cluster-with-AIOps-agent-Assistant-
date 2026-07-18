import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, AlertTriangle, BarChart2, Users, UserCircle } from 'lucide-react';
import { ChatHistory } from '../chat/ChatHistory';
import { fetchChatHistory, type ChatSessionPreview } from '../../api/chat';

interface SidebarProps {
  userRole: string; // 'admin' | 'devops' | 'developer'
}

type MenuItem = {
  name: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
};

const MENU_ITEMS: MenuItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'devops', 'developer'] },
  { name: 'AI Chat', path: '/chat', icon: MessageSquare, roles: ['admin', 'devops', 'developer'] },
  { name: 'Incidents', path: '/incidents', icon: AlertTriangle, roles: ['admin', 'devops', 'developer'] },
  { name: 'Metrics', path: '/metrics', icon: BarChart2, roles: ['admin', 'devops'] },
  { name: 'Users', path: '/users', icon: Users, roles: ['admin'] },
  { name: 'Profile', path: '/profile', icon: UserCircle, roles: ['admin', 'devops', 'developer'] },
];

export function Sidebar({ userRole }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ChatSessionPreview[]>([]);
  
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (token) {
          const data = await fetchChatHistory(token);
          setSessions(data);
        }
      } catch (err) {
        console.error("Failed to load history in sidebar", err);
      }
    };
    
    // Only fetch if they navigate to /chat or if we just want it globally available
    // Here we load it whenever Sidebar mounts or token changes.
    loadHistory();
  }, []);
  
  // Normalize role to lowercase to easily match the roles array
  const roleLower = userRole.toLowerCase();

  // Filter menu items based on the user's current role
  const allowedItems = MENU_ITEMS.filter(item => item.roles.includes(roleLower));

  return (
    <aside className="w-64 bg-[#040d24]/30 border-r border-purple-900/30 min-h-[calc(100vh-4rem)] shadow-[4px_0_24px_rgba(128,90,213,0.05)] flex flex-col">
      <div className="p-4 space-y-2 shrink-0">
        {allowedItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(128,90,213,0.1)]' 
                  : 'text-slate-400 hover:text-purple-200 hover:bg-purple-900/30 border border-transparent hover:border-purple-800/30'
              }`}
            >
              <Icon 
                className={`h-5 w-5 transition-colors ${
                  isActive ? 'text-purple-400' : 'text-slate-500 group-hover:text-purple-400'
                }`} 
              />
              <span className="tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex-1 overflow-hidden mt-2 flex flex-col">
        <ChatHistory 
          sessions={sessions}
          currentChatId={new URLSearchParams(location.search).get('id') || ""}
          onSelectChat={(id) => navigate(`/chat?id=${id}`)}
          onNewChat={() => navigate(`/chat`)}
        />
      </div>
    </aside>
  );
}
