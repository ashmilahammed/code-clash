import { NavLink } from "react-router-dom";


const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#020617] p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <nav className="space-y-2">
        <NavLink to="/admin" className="block p-2 rounded hover:bg-slate-700">
          Dashboard
        </NavLink>

        <NavLink to="/admin/users" className="block p-2 rounded hover:bg-slate-700">
          Users Management
        </NavLink>

        {/* <NavLink to="/admin/challenges" className="block p-2 rounded hover:bg-slate-700">
          Challenge Management
        </NavLink> */}
      </nav>
    </aside>
  );
};

export default Sidebar;

