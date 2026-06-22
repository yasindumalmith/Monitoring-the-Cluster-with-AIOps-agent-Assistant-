import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader } from '../components/common/Loader';

export function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate backend delay and successful registration
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('token', 'simulated-jwt-token');
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto mt-20 w-full">
      <div className="p-8 bg-[#040d24]/50 border border-purple-900/50 rounded-2xl shadow-[0_0_30px_rgba(128,90,213,0.1)]">
        
        {isLoading ? (
          <Loader message="Creating your account..." size="md" />
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-8 text-white text-center">Create Account</h1>
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-purple-300 mb-2 text-sm font-medium">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-950/50 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-purple-300 mb-2 text-sm font-medium">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 bg-slate-950/50 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="devops@aiops.com"
                  required
                />
              </div>
              <div>
                <label className="block text-purple-300 mb-2 text-sm font-medium">Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-3 bg-slate-950/50 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 mt-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-purple-600/20"
              >
                Sign Up
              </button>
            </form>
          </>
        )}
        
        {!isLoading && (
          <div className="mt-8 text-center border-t border-purple-900/30 pt-6">
            <span className="text-slate-400 text-sm">Already have an account? </span>
            <Link to="/login" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
