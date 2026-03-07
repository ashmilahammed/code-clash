import { useNavigate, useLocation } from "react-router-dom";
import { logoutApi } from "../../api/authApi";
import { useAuthStore } from "../../store/useAuthStore";
import { useSearchStore } from "../../store/useSearchStore";

import {
  Search,
  MessageSquare,
  Award,
  Bell,
} from "lucide-react";



function UserNavbar() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logoutUser = useAuthStore((state) => state.logoutUser);
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useSearchStore();

  const isDashboard = location.pathname === "/dashboard";



  const handleLogout = async () => {
    try {
      await logoutApi();

    } catch (err) {
      // even if API fails, we still clear session locally
      console.error("Logout failed", err);
    } finally {
      logoutUser();
      navigate("/auth/login", { replace: true });
    }
  };


  return (
    <nav
      className="
        h-16 px-6
        flex items-center justify-between
        bg-linear-to-r from-[#020617] via-[#020617]/90 to-[#020617]
        backdrop-blur
        text-white
        fixed top-0 left-0 right-0 z-50
      "
    >
      {/* Left: App name */}
      <div
        className="
          font-bold text-lg tracking-wide
          bg-linear-to-r from-purple-400 via-pink-500 to-red-500
          bg-clip-text text-transparent
          transition duration-300
          hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]
          cursor-pointer
        "
        onClick={() => navigate("/dashboard")}
      >
        &lt;CODE-CLASH /&gt;
      </div>

      {/* Center: Search */}
      {isDashboard && (
        <div className="hidden md:flex flex-1 justify-center px-6">
          <div className="relative w-full max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-9 pr-4 py-2
                rounded-full
                bg-slate-800/70
                border border-slate-700
                text-sm text-white
                placeholder:text-slate-400
                focus:outline-none
                focus:ring-2 focus:ring-blue-500/40
              "
            />
          </div>
        </div>
      )}

      {/* Right: Icons + user */}
      <div className="flex items-center gap-4">
        {/* Chat */}
        <button
          className="p-2 rounded-full hover:bg-slate-800 transition"
          title="Chat"
          onClick={() => navigate("/messages")}
        >
          <MessageSquare size={18} />
        </button>

        {/* Badges */}
        <button
          className="p-2 rounded-full hover:bg-slate-800 transition"
          title="Leaderboard"
          onClick={() => navigate("/leaderboard")}
        >
          <Award size={18} />
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-full hover:bg-slate-800 transition"
          title="Notifications"
        >
          <Bell size={18} />
          {/* red dot */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Info */}
        <div
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
          onClick={() => navigate("/profile")}
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
              <img 
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=random`}
                alt={user?.username || "User"} 
                className="w-full h-full object-cover"
              />
          </div>
          
          {/* User Name & Rank */}
          <div className="flex flex-col leading-tight text-right">
            <span className="text-sm font-medium">
              {user?.username}
            </span>
            <span className="text-xs text-slate-400">
              Rank -
            </span>
          </div>
        </div>

        {/* Logout */}
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

export default UserNavbar;










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

