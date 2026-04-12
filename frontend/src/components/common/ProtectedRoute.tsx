import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";


const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  // wait until refresh check finishes
  if (isLoading) return null;

  // 
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  //
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // 
  return <Outlet />;
};

export default ProtectedRoute;



