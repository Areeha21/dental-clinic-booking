import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Like ProtectedRoute, but also checks role === 'admin'.
// A logged-in patient trying to visit an admin page gets sent home instead.
function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  return children;
}

export default AdminRoute;
