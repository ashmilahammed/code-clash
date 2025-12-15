import { useAuthStore } from "../../store/useAuthStore";
import { logoutApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);
  const logoutUser = useAuthStore((s) => s.logoutUser);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi();      
    } catch (err) {
      console.error("Logout failed:", err);
    }

    logoutUser();             // clear Zustand
    navigate("/auth/login");  
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome, {user?.username}</h1>
      <p>Your email: {user?.email}</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
