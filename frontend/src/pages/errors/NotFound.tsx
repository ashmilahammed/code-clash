import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const NotFound = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl font-bold text-blue-500 mb-4">404</h1>
      <p className="text-slate-300 mb-6">
        The page you're looking for doesn’t exist.
      </p>

      <button
        onClick={() =>
          navigate(user ? "/dashboard" : "/", { replace: true })
        }
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
      >
        {user ? "Go to Dashboard" : "Go to Home"}
      </button>
    </div>
  );
};

export default NotFound;
