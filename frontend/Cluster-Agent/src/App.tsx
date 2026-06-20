import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { NavBar } from './components/common/NavBar';
import { Sidebar } from './components/common/Sidebar';
import { Loader } from './components/common/Loader';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { ChatWindow } from './components/chat/ChatWindow';

function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">AIOps Agent Assistant</h1>
        <div className="flex justify-center gap-6">
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4">Login</Link>
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4">Register</Link>
          <Link to="/chat" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4">Chat Interface</Link>
        </div>
      </div>
    </div>
  );
}

function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate backend delay and successful JWT verification
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('token', 'simulated-jwt-token');
      // Redirect to dashboard (force reload to pick up localStorage change in App state)
      window.location.href = '/dashboard';
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto mt-20 w-full">
      <div className="p-8 bg-[#1a0b2e]/50 border border-purple-900/50 rounded-2xl shadow-[0_0_30px_rgba(128,90,213,0.1)]">
        
        {isLoading ? (
          <Loader message="Authenticating with backend..." size="md" />
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-8 text-white text-center">Sign In</h1>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-purple-300 mb-2 text-sm font-medium">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 bg-slate-950/50 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="devops@aiops.com"
                />
              </div>
              <div>
                <label className="block text-purple-300 mb-2 text-sm font-medium">Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-3 bg-slate-950/50 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 mt-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-purple-600/20"
              >
                Sign In
              </button>
            </form>
          </>
        )}
        
        {!isLoading && (
          <div className="mt-8 text-center border-t border-purple-900/30 pt-6">
            <Link to="/" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Register() {
  return (
    <div className="min-h-screen p-8 bg-slate-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Register Page</h1>
      <Link to="/" className="text-indigo-400 hover:text-indigo-300">← Back Home</Link>
    </div>
  );
}

function Chat() {
  const sampleMessages = [
    { id: '1', role: 'user' as const, content: 'Check failing pods' },
    { id: '2', role: 'assistant' as const, content: 'Found a CrashLoopBackOff pod in the default namespace:\n\n### Problem Pod\n- **Name:** `frontend-deployment-85b8f6...`\n- **Restart count:** 96\n- **Status:** CrashLoopBackOff\n\nWould you like me to fetch the logs?' },
    { id: '3', role: 'user' as const, content: 'Show logs' },
    { id: '4', role: 'assistant' as const, content: 'Here are the recent logs for that pod:\n\n```text\nError: ENOSPC: no space left on device, write\n    at Object.writeSync (fs.js:738:20)\n```\n\nI recommend expanding the persistent volume claim.' },
  ];

  return (
    <div className="h-full max-h-[calc(100vh-8rem)] flex flex-col bg-[#1a0b2e]/30 border border-purple-900/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(128,90,213,0.05)]">
      <div className="px-6 py-4 border-b border-purple-900/30 bg-purple-950/20 flex items-center justify-between">
        <h1 className="text-lg font-bold text-white tracking-wide">AIOps Diagnostic Chat</h1>
      </div>
      <ChatWindow messages={sampleMessages} />
    </div>
  );
}

function App() {
  // Check if user is authenticated via JWT in localStorage
  const isAuthenticated = !!localStorage.getItem('token');
  
  // If authenticated, populate mockUser. Otherwise, keep it null.
  const mockUser = isAuthenticated ? {
    name: 'Yasindu',
    role: 'DevOps'
  } : null;

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <NavBar user={mockUser} incidentCount={3} />
        
        <div className="flex flex-1 overflow-hidden">
          {mockUser && <Sidebar userRole={mockUser.role} />}
          
          <main className="flex-1 overflow-y-auto p-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><div className="text-white text-2xl font-bold">Dashboard Placeholder</div></ProtectedRoute>} />
              <Route path="/incidents" element={<ProtectedRoute><div className="text-white text-2xl font-bold">Incidents Placeholder</div></ProtectedRoute>} />
              <Route path="/metrics" element={<ProtectedRoute><div className="text-white text-2xl font-bold">Metrics Placeholder</div></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute><div className="text-white text-2xl font-bold">Users Placeholder</div></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><div className="text-white text-2xl font-bold">Profile Placeholder</div></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
