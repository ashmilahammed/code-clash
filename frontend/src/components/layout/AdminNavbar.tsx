import { useNavigate, useLocation } from "react-router-dom";
import { logoutApi } from "../../api/authApi";
import { useAuthStore } from "../../store/useAuthStore";
import { LogOut } from "lucide-react";

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const logoutUser = useAuthStore((s) => s.logoutUser);

    const handleLogout = async () => {
        try {
            await logoutApi();
        } finally {
            logoutUser();
            navigate("/auth/login");
        }
    };

    // Breadcrumb logic
    const pathnames = location.pathname.split("/").filter((x) => x);
    const currentPage = pathnames.length > 1 ? pathnames[1] : "Dashboard";
    const formattedPage = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

    return (
        <nav
            className="
                h-16 px-6 md:px-8
                flex items-center justify-between
                bg-slate-950/70 backdrop-blur-xl
                border-b border-slate-800/50
                text-slate-200
                fixed top-0 left-64 right-0 z-40
                shadow-[0_4px_30px_rgba(0,0,0,0.1)]
            "
        >
            {/* Left side: Breadcrumb / Title */}
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center text-sm font-medium text-slate-400">
                    <span className="hover:text-slate-200 transition-colors cursor-pointer">Admin</span>
                    <span className="mx-2 text-slate-700">/</span>
                    <span className="text-indigo-400 font-semibold">{formattedPage}</span>
                </div>
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center gap-4 md:gap-6">

                <div className="h-6 w-px bg-slate-800"></div>

                {/* Profile section */}
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">Admin </span>
                        <span className="text-xs text-slate-400 font-medium">Workspace Owner</span>
                    </div>

                    {/* <div className="h-9 w-9 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                        <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                            <User size={16} className="text-indigo-300" />
                        </div>
                    </div> */}
                </div>

                <div className="h-6 w-px bg-slate-800"></div>

                <button
                    onClick={handleLogout}
                    className="
                        flex items-center gap-2
                        px-3 py-1.5 rounded-lg
                        text-sm font-medium text-slate-400
                        hover:text-red-400 hover:bg-red-500/10
                        transition-all duration-200
                    "
                >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default AdminNavbar;
