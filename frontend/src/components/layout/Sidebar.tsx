import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Trophy,
  Layers,
  Award,
  CreditCard,
  ShieldCheck,
  Bell,
} from "lucide-react";

const Sidebar = () => {

  const navigate = useNavigate();

  const linkBase =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group overflow-hidden";

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950/80 backdrop-blur-2xl border-r border-slate-800/50 p-5 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-50">

      {/* Logo Area */}
      {/* <div
        className="
          mb-8 px-2 py-4
          cursor-pointer transition-transform duration-300 hover:scale-[1.02]
        "
        onClick={() => navigate("/admin")}
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-linear-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <span className="text-white font-bold text-lg leading-none select-none">&lt;/&gt;</span>
          </div>
          <h2 className="font-bold text-xl tracking-wide bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm select-none">
            CODE-CLASH
          </h2>
        </div>
      </div> */}
      <div
        className="
          mb-13
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


      <nav className="space-y-1.5 flex-1 overflow-y-auto pr-1">

        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `${linkBase} ${isActive
              ? "bg-indigo-500/10 text-indigo-400 font-semibold shadow-[inset_3px_0_0_rgba(99,102,241,1)]"
              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 hover:translate-x-1"
            }`
          }
        >
          <LayoutDashboard size={18} className="shrink-0" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `${linkBase} ${isActive
              ? "bg-indigo-500/10 text-indigo-400 font-semibold shadow-[inset_3px_0_0_rgba(99,102,241,1)]"
              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 hover:translate-x-1"
            }`
          }
        >
          <Users size={18} className="shrink-0" />
          <span>Users</span>
        </NavLink>

        <NavLink
          to="/admin/challenges"
          className={({ isActive }) =>
            `${linkBase} ${isActive
              ? "bg-indigo-500/10 text-indigo-400 font-semibold shadow-[inset_3px_0_0_rgba(99,102,241,1)]"
              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 hover:translate-x-1"
            }`
          }
        >
          <Trophy size={18} className="shrink-0" />
          <span>Challenges</span>
        </NavLink>

        <NavLink
          to="/admin/levels"
          className={({ isActive }) =>
            `${linkBase} ${isActive
              ? "bg-indigo-500/10 text-indigo-400 font-semibold shadow-[inset_3px_0_0_rgba(99,102,241,1)]"
              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 hover:translate-x-1"
            }`
          }
        >
          <Layers size={18} className="shrink-0" />
          <span>Levels</span>
        </NavLink>

        <NavLink
          to="/admin/badges"
          className={({ isActive }) =>
            `${linkBase} ${isActive
              ? "bg-indigo-500/10 text-indigo-400 font-semibold shadow-[inset_3px_0_0_rgba(99,102,241,1)]"
              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 hover:translate-x-1"
            }`
          }
        >
          <Award size={18} className="shrink-0" />
          <span>Badges</span>
        </NavLink>

        <NavLink
          to="/admin/plans"
          className={({ isActive }) =>
            `${linkBase} ${isActive
              ? "bg-indigo-500/10 text-indigo-400 font-semibold shadow-[inset_3px_0_0_rgba(99,102,241,1)]"
              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 hover:translate-x-1"
            }`
          }
        >
          <CreditCard size={18} className="shrink-0" />
          <span>Plans Management</span>
        </NavLink>

        <NavLink
          to="/admin/groups"
          className={({ isActive }) =>
            `${linkBase} ${isActive
              ? "bg-indigo-500/10 text-indigo-400 font-semibold shadow-[inset_3px_0_0_rgba(99,102,241,1)]"
              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 hover:translate-x-1"
            }`
          }
        >
          <Users size={18} className="shrink-0" />
          <span>Group Management</span>
        </NavLink>
        <NavLink
          to="/admin/reports"
          className={({ isActive }) =>
            `${linkBase} ${isActive
              ? "bg-indigo-500/10 text-indigo-400 font-semibold shadow-[inset_3px_0_0_rgba(99,102,241,1)]"
              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 hover:translate-x-1"
            }`
          }
        >
          <ShieldCheck size={18} className="shrink-0" />
          <span>Report Management</span>
        </NavLink>

        <NavLink
          to="/admin/notifications"
          className={({ isActive }) =>
            `${linkBase} ${isActive
              ? "bg-indigo-500/10 text-indigo-400 font-semibold shadow-[inset_3px_0_0_rgba(99,102,241,1)]"
              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 hover:translate-x-1"
            }`
          }
        >
          <Bell size={18} className="shrink-0" />
          <span>Notify Management</span>
        </NavLink>
      </nav>

      {/* Footer Area */}
      <div className="pt-6 mt-4 border-t border-slate-800/50">
        <div className="bg-slate-900/50 rounded-xl p-4 flex flex-col gap-1 items-center justify-center text-center">
          <div className="h-1 w-8 bg-indigo-500/50 rounded-full mb-2"></div>
          {/* <span className="text-xs font-semibold text-slate-300 tracking-wider">CODE-CLASH PRO</span>
          <span className="text-[10px] text-slate-500">Admin Portal v2.0</span> */}
        </div>
      </div>

      
    </aside>
  );
};

export default Sidebar;
