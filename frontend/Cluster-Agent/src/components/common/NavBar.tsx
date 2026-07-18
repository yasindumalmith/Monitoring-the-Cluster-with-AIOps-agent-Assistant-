import { useState, useEffect } from 'react';
import { Bell, LogOut, User, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUserProfile } from '../../api/auth';

interface NavBarProps {
  incidentCount: number;
}

export function NavBar({ incidentCount }: NavBarProps) {
  const [user, setUser] = useState<{name: string, role: string} | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      getUserProfile(token)
        .then(data => {
          // data structure as described: { id, name, email, role, created_at }
          setUser(data);
        })
        .catch(err => {
          console.error('Failed to fetch user profile:', err);
        });
    }
  }, []);

  return (
    <nav className="border-b border-purple-900/50 bg-[#040d24]/80 backdrop-blur-md sticky top-0 z-50 shadow-[0_4px_30px_rgba(128,90,213,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Shield className="h-6 w-6 text-purple-400" />
            <Link to="/" className="font-bold text-xl tracking-tight text-white hover:text-purple-300 transition-colors">
              AIOps Assistant
            </Link>
          </div>

          {/* Right side navigation items */}
          <div className="flex items-center gap-6">
            
            {user ? (
              <>
                {/* Role Badge */}
                <div className="hidden sm:flex items-center text-sm font-medium text-purple-200">
                  <span className="text-purple-400 mr-2">Role:</span>
                  <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                    {user.role}
                  </span>
                </div>

                {/* Notification Bell */}
                <button className="relative p-2 text-purple-300 hover:text-white transition-colors group">
                  <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  {incidentCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-[#040d24]">
                      {incidentCount}
                    </span>
                  )}
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-2 text-sm font-medium text-white border-l border-purple-800/50 pl-6">
                  <div className="bg-purple-900/60 p-1.5 rounded-full border border-purple-800/50">
                    <User className="h-4 w-4 text-purple-200" />
                  </div>
                  <span className="tracking-wide">{user.name}</span>
                </div>

                {/* Logout Button */}
                <button 
                  onClick={() => {
                    sessionStorage.removeItem('token');
                    window.location.href = '/login';
                  }}
                  className="flex items-center gap-2 ml-4 text-sm font-medium text-purple-300 hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="text-purple-200 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg shadow-purple-600/20">
                  Get Started
                </Link>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </nav>
  );
}
