import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, requiredRole = 'teacher' }) {
  const { user, role, loading } = useAuth();

  if (loading) return <LoadingSpinner text="Checking access..." />;

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && role !== requiredRole) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="text-4xl">🔒</div>
        <h2 className="text-xl font-semibold text-text-primary">Access Denied</h2>
        <p className="text-sm text-text-secondary">
          You need <span className="text-lpu-orange font-semibold">{requiredRole}</span> access to view this page.
        </p>
      </div>
    );
  }

  return children;
}
