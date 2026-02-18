import { Outlet } from "react-router-dom";
import LandingNavbar from "./LandingNavbar";

const LandingLayout = () => {
    return (
        <div className="min-h-screen bg-[#0B1220]">
            {/* Fixed navbar */}
            <LandingNavbar />

            {/* Page content */}
            <main className="pt-16">
                <Outlet />
            </main>
        </div>
    );
};

export default LandingLayout;
