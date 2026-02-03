import { useNavigate } from "react-router-dom";
import { logoutApi } from "../../api/authApi";
import { useAuthStore } from "../../store/useAuthStore";



const AdminNavbar = () => {
    const navigate = useNavigate();
    // const user = useAuthStore((s) => s.user);
    const logoutUser = useAuthStore((s) => s.logoutUser);

    const handleLogout = async () => {
        try {
            await logoutApi();
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            logoutUser();
            navigate("/auth/login");
        }
    };

    return (
        <nav
            className="
        h-16 px-6
        flex items-center justify-between
        bg-slate-900
        text-white
        fixed top-0 left-0 right-0 z-50
      "
        >
            {/* App name */}
            <div
                className="
        font-bold text-lg tracking-wide
        bg-linear-to-r from-purple-400 via-pink-500 to-red-500
        bg-clip-text text-transparent
        transition duration-300
        hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]
        cursor-pointer
      "
                onClick={() => navigate("/admin")}
            >
                &lt;CODE-CLASH /&gt;
            </div>


            {/* Right side */}
            <div className="flex items-center gap-4">
                <span className="text-sm opacity-80">
                    {/* Admin: {user?.username} */}
                    Admin
                </span>

                <button
                    onClick={handleLogout}
                    className="text-sm px-3 py-1 rounded bg-red-600 hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default AdminNavbar;
