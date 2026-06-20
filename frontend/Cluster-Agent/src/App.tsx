import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Bot, Activity, ShieldAlert, Terminal, ArrowRight } from 'lucide-react';

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-500 p-1.5 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">AIOps Agent</span>
            </div>
            <div className="flex gap-4">
              <Link to="/login" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="relative pt-24 pb-32 overflow-hidden">
          {/* Background glow effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none">
            <div className="absolute inset-0 rounded-full bg-indigo-500 blur-[100px] mix-blend-screen"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              <span className="block text-white">Autonomous Kubernetes</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                Monitoring & Diagnostics
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400">
              Your intelligent cluster assistant. Diagnose CrashLoopBackOffs, monitor pod health, and resolve incidents in real-time using AI.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link to="/register" className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg font-semibold transition-all">
                Start Monitoring
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                View Source
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-slate-900 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Feature 1 */}
              <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-colors group">
                <div className="bg-slate-800 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                  <Activity className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Real-time Observability</h3>
                <p className="text-slate-400">
                  Instantly fetch pod statuses, metrics, and logs across your entire Kubernetes cluster using natural language.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-colors group">
                <div className="bg-slate-800 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
                  <ShieldAlert className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Incident Management</h3>
                <p className="text-slate-400">
                  Autonomously detects and logs critical incidents directly to your PostgreSQL database with severity tracking.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-colors group">
                <div className="bg-slate-800 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                  <Terminal className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">AI Diagnostics</h3>
                <p className="text-slate-400">
                  Leverages Anthropic Claude to instantly analyze CrashLoopBackOff logs and suggest exact fixes.
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} AIOps Agent Assistant. Designed for Kubernetes.</p>
        </div>
      </footer>
    </div>
  );
}

function Login() {
  return <div className="p-8 text-white"><h1 className="text-2xl">Login Page (Coming Soon)</h1><Link to="/" className="text-indigo-400">Back Home</Link></div>;
}

function Register() {
  return <div className="p-8 text-white"><h1 className="text-2xl">Register Page (Coming Soon)</h1><Link to="/" className="text-indigo-400">Back Home</Link></div>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
