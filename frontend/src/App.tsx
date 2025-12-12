import { Routes, Route } from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/common/protectedRoute";
// import Dashboard from "./pages/dashboard/Dashboard";


function App() {
  return (
    <Routes>

      {/* Default route */}
      <Route path="/" element={<Login />} />

      {/* Auth routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />


      {/* Protected Route */}
      {/* <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      /> */}
      
    </Routes>

  );
}

export default App;




