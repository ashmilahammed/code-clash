import { logoutApi } from "../../api/authApi";
import { useAuthStore } from "../../store/useAuthStore";



function Navbar() {
  const logoutUser = useAuthStore((state) => state.logoutUser);

  const handleLogout = async () => {
    await logoutApi();
    logoutUser();
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default Navbar;

