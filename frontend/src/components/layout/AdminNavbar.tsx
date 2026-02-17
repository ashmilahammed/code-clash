import { useNavigate } from "react-router-dom";
import { logoutApi } from "../../api/authApi";
import { useAuthStore } from "../../store/useAuthStore";
import { LogOut } from "lucide-react";


const AdminNavbar = () => {
    const navigate = useNavigate();
    const logoutUser = useAuthStore((s) => s.logoutUser);


    const handleLogout = async () => {
        try {
            await logoutApi();
        } finally {
            logoutUser();
            navigate("/auth/login");
        }
    };



    return (
        <nav
            className="
        h-16 px-8
        flex items-center justify-end
        bg-[#0f172a]/90 backdrop-blur-md
        border-b border-slate-800
        text-white
        fixed top-0 left-64 right-0 z-40
      "
        >
            <div className="flex items-center gap-5">
                <span className="text-sm text-slate-400">
                    Admin
                </span>

                <button
                    onClick={handleLogout}
                    className="
            flex items-center gap-2
            px-4 py-1.5 rounded-lg
            bg-red-600/80 hover:bg-red-600
            transition
            text-sm font-medium
            shadow-md
          "
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </nav>
    );


};

export default AdminNavbar;
