import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { NavBar } from './components/common/NavBar';
import { Sidebar } from './components/common/Sidebar';

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
  return (
    <div className="min-h-screen p-8 bg-slate-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Login Page</h1>
      <Link to="/" className="text-indigo-400 hover:text-indigo-300">← Back Home</Link>
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
