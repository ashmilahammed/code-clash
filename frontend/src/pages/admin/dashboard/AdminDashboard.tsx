import { useEffect, useState } from "react";
import {
  Users,
  Trophy,
  ShieldAlert,
  TrendingUp,
  PlusCircle,
  Send,
  FileText,
  Crown
} from "lucide-react";
import { getAdminDashboardStatsApi } from "../../../api/adminApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";



interface QuickActionButtonProps {
  icon: React.ReactNode
  label: string
  color: string
  onClick?: () => void
}


const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [range, setRange] = useState("30days");

  const navigate = useNavigate();


  useEffect(() => {
    fetchStats();
  }, [range]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await getAdminDashboardStatsApi(range);
      setStats(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { stats: mainStats, signupsData, mostAttemptedChallenge } = stats;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back, Admin! Here's an overview of your platform.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">Filter Range:</span>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer transition hover:bg-slate-800"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Users"
          value={mainStats.totalUsers}
          trend="+12.4% vs last month"
          icon={<Users className="text-purple-400" />}
          bgColor="bg-purple-500/10"
        />
        <StatCard
          title="Premium Users"
          value={mainStats.premiumUsers}
          trend="+5 this month"
          icon={<Crown className="text-orange-400" />}
          bgColor="bg-orange-500/10"
        />
        <StatCard
          title="Total Challenges"
          value={mainStats.totalChallenges}
          icon={<Trophy className="text-blue-400" />}
          bgColor="bg-blue-500/10"
        />
        <StatCard
          title="Total Groups"
          value={mainStats.totalGroups}
          icon={<Users className="text-indigo-400" />}
          bgColor="bg-indigo-500/10"
        />
        <StatCard
          title="Pending Reports"
          value={mainStats.pendingReports}
          icon={<ShieldAlert className="text-red-400" />}
          bgColor="bg-red-500/10"
          valueColor="text-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signups Chart */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-white">User Signups ({getRangeLabel(range)})</h3>
          </div>
          <div className="h-[300px] w-full">
            <SignupChart data={signupsData} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Most Attempted Challenge */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-semibold text-white mb-4 text-sm">Most Attempted Challenge</h3>
            {mostAttemptedChallenge ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="text-yellow-500" size={16} />
                    <span className="font-bold text-white">{mostAttemptedChallenge.title}</span>
                  </div>
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                    {mostAttemptedChallenge.difficulty}
                  </span>
                  <div className="mt-4 space-y-1">
                    <p className="text-slate-400 text-xs">Attempts: <span className="text-white font-medium">{mostAttemptedChallenge.attempts}</span></p>
                    <p className="text-slate-400 text-xs">Completion Rate</p>
                  </div>
                </div>
                <div className="relative w-24 h-24">
                  <CircularProgress percentage={mostAttemptedChallenge.completionRate} />
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No data available</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-semibold text-white mb-4 text-sm">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">

              <QuickActionButton
                icon={<PlusCircle size={14} />}
                label="Create Challenge"
                color="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate("/admin/challenges/create")}
              />

              <QuickActionButton
                icon={<Send size={14} />}
                label="Send Notification"
                color="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => navigate("/admin/notifications")}
              />

              <QuickActionButton
                icon={<FileText size={14} />}
                label="View Reports"
                color="bg-orange-600 hover:bg-orange-700"
                onClick={() => navigate("/admin/reports")}
              />

              <QuickActionButton
                icon={<Users size={14} />}
                label="Manage Groups"
                color="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => navigate("/admin/groups")}
              />

            </div>
          </div>

          {/* Premium Revenue */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-semibold text-white mb-4 text-sm">Premium Revenue ({getRangeLabel(range)})</h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-400">₹{mainStats.revenue?.toLocaleString() || 0}</p>
                <p className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1">
                  <TrendingUp size={10} /> +18% vs last period
                </p>
              </div>
              <div className="h-12 flex items-end gap-1 pb-1">
                {[40, 60, 45, 70, 50, 90].map((h, i) => (
                  <div key={i} className="w-2 bg-emerald-500/40 rounded-t-sm" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>

  );
};

const StatCard = ({ title, value, trend, icon, bgColor, valueColor = "text-white" }: any) => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-lg group hover:border-slate-700 transition">
    <div className="flex justify-between items-start mb-4">
      <p className="text-xs text-slate-400 font-medium">{title}</p>
      <div className={`p-2 rounded-xl ${bgColor}`}>
        {icon}
      </div>
    </div>
    <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
    {trend && (
      <p className="text-[10px] text-emerald-500 mt-2 flex items-center gap-1">
        <TrendingUp size={10} /> {trend}
      </p>
    )}
  </div>
);


const QuickActionButton = ({ icon, label, color, onClick }: QuickActionButtonProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition text-white text-[11px] font-medium shadow-lg hover:scale-[1.02] active:scale-95 ${color}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const SignupChart = ({ data }: { data: any[] }) => {
  if (!data.length) return null;

  const max = Math.max(...data.map(d => d.count), 1);
  const height = 300;
  const width = 800; // arbitrary, responsive container handles scale
  const padding = 40;

  const points = data.map((d, i) => {
    const x = padding + (i * (width - 2 * padding) / (data.length - 1 || 1));
    const y = height - padding - (d.count / max * (height - 2 * padding));
    return `${x},${y}`;
  }).join(' ');




  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(v => (
        <line
          key={v}
          x1={padding}
          y1={height - padding - v * (height - 2 * padding)}
          x2={width - padding}
          y2={height - padding - v * (height - 2 * padding)}
          stroke="#1e293b"
          strokeWidth="1"
        />
      ))}
      <polyline
        fill="url(#gradient)"
        points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`}
      />
      <polyline
        fill="none"
        stroke="#3b82f6"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {/* Dates/Ticks */}
      {data.filter((_, i) => i % 5 === 0 || i === data.length - 1).map((d) => {
        const idx = data.indexOf(d);
        const x = padding + (idx * (width - 2 * padding) / (data.length - 1 || 1));
        return (
          <text
            key={idx}
            x={x}
            y={height - 10}
            fill="#64748b"
            fontSize="10"
            textAnchor="middle"
          >
            {new Date(d.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
          </text>
        );
      })}
    </svg>
  );
};

const CircularProgress = ({ percentage }: { percentage: number }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;



  return (
    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke="currentColor"
        strokeWidth="8"
        fill="transparent"
        className="text-slate-800"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke="currentColor"
        strokeWidth="8"
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-blue-500 transition-all duration-1000 ease-out"
      />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        className="text-white text-xl font-bold"
        transform="rotate(90 50 50)"
      >
        {percentage}%
      </text>
    </svg>
  );
};

const getRangeLabel = (range: string) => {
  switch (range) {
    case '7days': return 'Last 7 Days';
    case '3months': return 'Last 3 Months';
    case 'all': return 'All Time';
    case '30days':
    default: return 'Last 30 Days';
  }
};

export default AdminDashboard;
