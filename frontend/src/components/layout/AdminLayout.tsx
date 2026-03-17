import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30">
      <Sidebar />

      <div className="ml-64 h-full flex flex-col relative z-0">
        <AdminNavbar />

        <main className="flex-1 mt-16 p-6 md:p-8 overflow-y-auto overflow-x-hidden scroll-smooth">
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>

        {/* Decorative ambient background glow */}
        <div className="fixed top-0 left-1/2 -translate-x-1/3 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="fixed bottom-0 right-10 w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      </div>
    </div>
  );
};

export default AdminLayout;

