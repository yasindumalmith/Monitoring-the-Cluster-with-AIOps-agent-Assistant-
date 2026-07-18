import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader } from '../components/common/Loader';
import { loginUser } from '../api/auth';

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Clear any existing session when visiting the login page
  useEffect(() => {
    sessionStorage.removeItem('token');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await loginUser({ email, password });
      
      if (data.token) {
        sessionStorage.setItem('token', data.token);
      } else {
        sessionStorage.setItem('token', 'simulated-jwt-token');
      }
      
      // Redirect to dashboard (force reload to pick up sessionStorage change in App state)
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 w-full">
      <div className="p-8 bg-[#040d24]/50 border border-purple-900/50 rounded-2xl shadow-[0_0_30px_rgba(128,90,213,0.1)]">
        
        {isLoading ? (
          <Loader message="Authenticating with backend..." size="md" />
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-8 text-white text-center">Sign In</h1>
            
            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-purple-300 mb-2 text-sm font-medium">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 bg-slate-950/50 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="devops@aiops.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-purple-300 mb-2 text-sm font-medium">Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-3 bg-slate-950/50 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
