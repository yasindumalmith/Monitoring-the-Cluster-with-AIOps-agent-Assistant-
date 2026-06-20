import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { NavBar } from './components/common/NavBar';
import { Sidebar } from './components/common/Sidebar';
import { Loader } from './components/common/Loader';

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
    // Simulate backend delay
    setTimeout(() => {
      setIsLoading(false);
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
  return (
    <div className="min-h-screen p-8 bg-slate-950 text-white">
      <h1 className="text-2xl font-bold mb-4">AIOps Chat Interface</h1>
      <Link to="/" className="text-indigo-400 hover:text-indigo-300">← Back Home</Link>
    </div>
  );
}

function App() {
  const mockUser = {
    name: 'Yasindu',
    role: 'DevOps'
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <NavBar user={mockUser} incidentCount={3} />
        
        <div className="flex flex-1 overflow-hidden">
          {mockUser && <Sidebar userRole={mockUser.role} />}
          
          <main className="flex-1 overflow-y-auto p-8">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/chat" element={<Chat />} />
              
              {/* Sidebar Placeholder Routes */}
              <Route path="/dashboard" element={<div className="text-white text-2xl font-bold">Dashboard Placeholder</div>} />
              <Route path="/incidents" element={<div className="text-white text-2xl font-bold">Incidents Placeholder</div>} />
              <Route path="/metrics" element={<div className="text-white text-2xl font-bold">Metrics Placeholder</div>} />
              <Route path="/users" element={<div className="text-white text-2xl font-bold">Users Placeholder</div>} />
              <Route path="/profile" element={<div className="text-white text-2xl font-bold">Profile Placeholder</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
