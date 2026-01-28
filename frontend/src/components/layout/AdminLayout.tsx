import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import AdminNavbar from "./AdminNavbar";



const AdminLayout = () => {
  return (
    <div className="h-screen bg-[#0f172a] text-white overflow-hidden">
      {/* Sidebar (fixed) */}
      <Sidebar />

      {/* Main column */}
      <div className="ml-64 h-full flex flex-col">
        {/* Navbar (fixed height) */}
        <AdminNavbar/>

        {/* ONLY this scrolls */}
        <main className="flex-1 mt-16 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

