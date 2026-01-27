import { useNavigate } from "react-router-dom";
import { logoutApi } from "../../api/authApi";
import { useAuthStore } from "../../store/useAuthStore";

function Navbar() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logoutUser = useAuthStore((state) => state.logoutUser);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      // even if API fails, we still clear session locally
      console.error("Logout failed", err);
    } finally {
      logoutUser();
      navigate("/auth/login");
    }
  };

  return (
    <nav className="h-16 px-6 flex items-center justify-between bg-slate-900 text-white fixed top-0 left-0 right-0 z-50">

      {/* App name */}
      <div className="font-bold text-lg tracking-wide 
  bg-linear-to-r from-purple-400 via-pink-500 to-red-500 
  bg-clip-text text-transparent 
  transition duration-300 hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]">
        &lt;CODE-CLASH /&gt;
      </div>


      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* User name (temporary, avatar later) */}
        <span className="text-sm opacity-80">
          {user?.username}
        </span>


        {/* Logout (will move into profile menu later) */}
        <button
          onClick={handleLogout}
          className="text-sm px-3 py-1 rounded bg-red-600 hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;










// import { logoutApi } from "../../api/authApi";
// import { useAuthStore } from "../../store/useAuthStore";



// function Navbar() {
//   const logoutUser = useAuthStore((state) => state.logoutUser);

//   const handleLogout = async () => {
//     await logoutApi();
//     logoutUser();
//   };

//   return <button onClick={handleLogout}>Logout</button>;
// }

// export default Navbar;

