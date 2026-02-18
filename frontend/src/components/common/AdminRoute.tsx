import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";


const AdminRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return null;

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;






// import { Navigate } from "react-router-dom";
// import { useAuthStore } from "../../store/useAuthStore";
// import React from "react";


// const AdminRoute = ({ children }: { children: React.ReactNode }) => {
//   const { user, isAuthenticated, isLoading } = useAuthStore();

//   //wait for auth hydration
//   if (isLoading) return null;

//   if (!isAuthenticated || !user) {
//     return <Navigate to="/auth/login" replace />;
//   }

//   // if (user.role !== "admin") {
//   //   return <Navigate to="/403" replace />;
//   // }
//   if (user.role !== "admin") {
//   return <Navigate to="/dashboard" replace />;
//   }


//   return <>{children}</>;
// };

// export default AdminRoute;



