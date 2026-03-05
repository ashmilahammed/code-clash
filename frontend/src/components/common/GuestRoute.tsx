import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";



const GuestRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  // wait for auth hydration
  if (isLoading) return null;

  if (isAuthenticated && user) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;




