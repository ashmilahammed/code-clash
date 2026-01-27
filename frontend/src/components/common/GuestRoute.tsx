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






// import { Navigate } from "react-router-dom";
// import { useAuthStore } from "../../store/useAuthStore";
// import type { ReactNode } from "react";


// const GuestRoute = ({ children }: { children: ReactNode }) => {
//     const { isAuthenticated, isLoading, user } = useAuthStore();

//     // wait for auth hydration
//     if (isLoading) return null;

//     // if already logged in,go to dashboard
//     // if (isAuthenticated) {
//     //     return <Navigate to="/dashboard" replace />;
//     // }
//     if (isAuthenticated && user) {
//         if (user.role === "admin") {
//             return <Navigate to="/admin" replace />;
//         }
//         return <Navigate to="/dashboard" replace />;
//     }

//     return <>{children}</>;
// };

// export default GuestRoute;


