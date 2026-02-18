import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

function LandingNavbar() {
    const navigate = useNavigate();

    return (
        <nav
            className="
        h-16 px-6
        flex items-center justify-between
        bg-linear-to-r from-[#020617] via-[#020617]/90 to-[#020617]
        backdrop-blur
        text-white
        fixed top-0 left-0 right-0 z-50
      "
        >
            {/* Left: App name */}
            <div
                className="
          font-bold text-lg tracking-wide
          bg-linear-to-r from-purple-400 via-pink-500 to-red-500
          bg-clip-text text-transparent
          cursor-pointer
        "
                onClick={() => navigate("/")}
            >
                &lt;CODE-CLASH /&gt;
            </div>

            {/* Center: Search (Mock) */}
            <div className="hidden md:flex flex-1 justify-center px-6">
                <div className="relative w-full max-w-md">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        placeholder="Search domains..."
                        className="
              w-full pl-9 pr-4 py-2
              rounded-full
              bg-slate-800/70
              border border-slate-700
              text-sm text-white
              placeholder:text-slate-400
              focus:outline-none
              focus:ring-2 focus:ring-blue-500/40
            "
                        readOnly
                        onClick={() => navigate("/auth/login")}
                    />
                </div>
            </div>

            {/* Right: Login Button */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/auth/login")}
                    className="text-sm px-4 py-2 rounded-full bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-medium transition"
                >
                    Login
                </button>
            </div>
        </nav>
    );
}

export default LandingNavbar;
