import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';

// Wraps a route. `adminOnly` gates admin-only pages so a customer never even
// renders them (the backend would 403 anyway, but this keeps the UX clean).
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullPage />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!adminOnly && isAdmin && location.pathname !== '/profile') {
    // Admins don't have customer accounts/transactions — send them to their own area.
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
