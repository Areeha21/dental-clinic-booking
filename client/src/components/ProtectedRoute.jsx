import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap any page that requires login with this.
// If not logged in, it redirects to /login instead of showing the page.
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // wait until we've checked localStorage
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
