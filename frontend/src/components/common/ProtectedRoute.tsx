import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";


const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  // wait until refresh check finishes
  if (isLoading) return null;

  // not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // logged in but admin trying to access user routes
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // user authenticated → render nested routes
  return <Outlet />;
};

export default ProtectedRoute;





// const ProtectedRoute = ({ children }: Props) => {
//   const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
//   const accessToken = useAuthStore((s) => s.accessToken);

//   if (!isAuthenticated || !accessToken) {
//     return <Navigate to="/auth/login" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
