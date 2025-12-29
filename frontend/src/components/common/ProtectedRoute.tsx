import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";



interface Props {
  children: ReactElement;
}

const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  
  // wait until refresh check finishes
  if (isLoading) return null;

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
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
