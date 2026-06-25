import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useIncidentStream } from './hooks/useIncidentStream';
import { NavBar } from './components/common/NavBar';
import { Sidebar } from './components/common/Sidebar';
import { Loader } from './components/common/Loader';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ChatPage } from './pages/ChatPage';
import { IncidentsPage } from './pages/IncidentsPage';

function MainLayout({ mockUser }: { mockUser: any }) {
  const { incidentCount, toast } = useIncidentStream();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
      <NavBar incidentCount={incidentCount} />
      
      {/* Sliding Toast Notification */}
      <div className={`fixed top-20 right-6 z-50 transition-all duration-500 transform ${toast?.visible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}`}>
        <div className="bg-red-900/90 border border-red-500/50 backdrop-blur-xl text-white px-6 py-4 rounded-lg shadow-[0_0_30px_rgba(239,68,68,0.4)] flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-red-400 shrink-0 animate-pulse" />
          <span className="font-semibold tracking-wide">{toast?.message}</span>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {mockUser && <Sidebar userRole={mockUser.role} />}
        
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
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
      <Routes>
        {/* Landing Page without Navbar/Sidebar */}
        <Route path="/" element={<LandingPage />} />
        
        {/* All other pages wrapped in MainLayout */}
        <Route element={<MainLayout mockUser={mockUser} />}>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><div className="text-white text-2xl font-bold">Dashboard Placeholder</div></ProtectedRoute>} />
          <Route path="/incidents" element={<ProtectedRoute><IncidentsPage /></ProtectedRoute>} />
          <Route path="/metrics" element={<ProtectedRoute><div className="text-white text-2xl font-bold">Metrics Placeholder</div></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><div className="text-white text-2xl font-bold">Users Placeholder</div></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><div className="text-white text-2xl font-bold">Profile Placeholder</div></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
