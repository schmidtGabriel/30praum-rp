import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();
  if (!isAuthenticated || !currentUser || currentUser.role !== "admin") {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
