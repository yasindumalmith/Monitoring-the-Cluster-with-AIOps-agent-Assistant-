import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  
  // Check for JWT token in local storage
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    // Redirect to login if unauthenticated, saving the attempted URL in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the child components (the protected page)
  return <>{children}</>;
}
