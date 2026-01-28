import { Outlet } from "react-router-dom";
import UserNavbar from "./UserNavbar";


const UserLayout = () => {
  return (
    <div className="min-h-screen bg-[#0B1220]">
      {/* Fixed navbar */}
      <UserNavbar />

      {/* Page content */}
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
