import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import React from "react";



const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  //wait for auth hydration
  if (isLoading) return null;

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;


// const AdminRoute = ({ children }: { children: React.ReactNode }) => {
//   const { user, isAuthenticated } = useAuthStore();

//   if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  
//   if (user.role !== "admin") return <Navigate to="/403" replace />;

//   return <>{children}</>;
// };


// export default AdminRoute;

