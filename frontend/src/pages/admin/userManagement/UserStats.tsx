import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserSolvedCountAdminApi } from "../../../api/adminApi";
import { ArrowLeft, CheckCircle } from "lucide-react";

const UserStats = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<{ username: string; solvedCount: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getUserSolvedCountAdminApi(id);
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch user stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [id]);

  return (
    <div className="bg-slate-900 rounded-xl p-6 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8 border-b border-slate-700 pb-4">
        <button
          onClick={() => navigate("/admin/users")}
          className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-white">
            User Statistics
          </h1>
          <p className="text-slate-400 text-sm">
            {loading ? "Loading..." : data?.username ? `Viewing statistics for ${data.username}` : "User not found"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center transform transition-transform hover:scale-105 duration-300">
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-4xl font-bold text-white mb-2">{data.solvedCount}</h3>
            <p className="text-slate-400 font-medium text-center">Successfully Submitted<br/>Challenges</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400">
          Failed to load user statistics.
        </div>
      )}
    </div>
  );
};

export default UserStats;
