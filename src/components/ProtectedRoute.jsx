import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen bg-ivory flex items-center justify-center text-taupe text-sm">Loading…</div>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  return children;
};

export default ProtectedRoute;
