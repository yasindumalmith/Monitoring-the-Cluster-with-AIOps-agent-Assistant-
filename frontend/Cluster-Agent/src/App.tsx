import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { NavBar } from './components/common/NavBar';
import { Sidebar } from './components/common/Sidebar';
import { Loader } from './components/common/Loader';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ChatPage } from './pages/ChatPage';

function MainLayout({ mockUser }: { mockUser: any }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <NavBar incidentCount={3} />
      
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
          <Route path="/incidents" element={<ProtectedRoute><div className="text-white text-2xl font-bold">Incidents Placeholder</div></ProtectedRoute>} />
          <Route path="/metrics" element={<ProtectedRoute><div className="text-white text-2xl font-bold">Metrics Placeholder</div></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><div className="text-white text-2xl font-bold">Users Placeholder</div></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><div className="text-white text-2xl font-bold">Profile Placeholder</div></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
