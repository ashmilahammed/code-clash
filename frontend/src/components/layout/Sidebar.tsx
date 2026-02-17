import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Trophy,
  Layers,
  Award,
} from "lucide-react";

const Sidebar = () => {

  const navigate = useNavigate();

  const linkBase =
    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200";


  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0b1221] border-r border-slate-800 p-5 flex flex-col">

      {/* Logo */}
      {/* <div className="mb-8">
        <h2 className="text-xl font-bold tracking-wide text-white">
          Admin Panel
        </h2>
        <div className="h-1 w-10 mt-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-full" />
      </div> */}
      <div
        className="
          mb-10
          font-bold text-xl tracking-wide
          bg-linear-to-r from-purple-400 via-pink-500 to-red-500
          bg-clip-text text-transparent
          hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]
          cursor-pointer transition
        "
        onClick={() => navigate("/admin")}
      >
        &lt;CODE-CLASH /&gt;
      </div>


      <nav className="space-y-2 flex-1">
        
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `${linkBase} ${isActive
              ? "bg-slate-800 text-white shadow-md"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `${linkBase} ${isActive
              ? "bg-slate-800 text-white shadow-md"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <Users size={18} />
          Users
        </NavLink>

        <NavLink
          to="/admin/challenges"
          className={({ isActive }) =>
            `${linkBase} ${isActive
              ? "bg-slate-800 text-white shadow-md"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <Trophy size={18} />
          Challenges
        </NavLink>

        <NavLink
          to="/admin/levels"
          className={({ isActive }) =>
            `${linkBase} ${isActive
              ? "bg-slate-800 text-white shadow-md"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <Layers size={18} />
          Levels
        </NavLink>

        <NavLink
          to="/admin/badges"
          className={({ isActive }) =>
            `${linkBase} ${isActive
              ? "bg-slate-800 text-white shadow-md"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <Award size={18} />
          Badges
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="pt-6 border-t border-slate-800 text-xs text-slate-500">
        Code-Clash Admin © 2026
      </div>
    </aside>
  );
};

export default Sidebar;
