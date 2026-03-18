import { useEffect, useState } from "react";
import { getLeaderboardApi } from "../../api/userApi";
import type { User } from "../../types/User";
import { useDebounce } from "../../hooks/useDebounce";
import UserProfileCard from "../../components/chat/UserProfileCard";

const NewLeaderboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [search, setSearch] = useState("");
    const [timeframe, setTimeframe] = useState<"all-time" | "weekly" | "monthly">("weekly");
    const [selectedProfileUserId, setSelectedProfileUserId] = useState<string | null>(null);

    const debouncedSearch = useDebounce(search, 500);

    const LIMIT = 10;

    useEffect(() => {
        setLoading(true);
        getLeaderboardApi(page, LIMIT, debouncedSearch, timeframe)
            .then((res) => {
                setUsers(res.data);
                setTotalUsers(res.total);
                setTotalPages(Math.ceil(res.total / LIMIT));
            })
            .finally(() => setLoading(false));
    }, [page, debouncedSearch, timeframe]);

    // Reset pagination when search or timeframe changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, timeframe]);

    // Top Performers 
    const topXPGainer = users.length > 0 ? users[0] : null;
    const topSolver = users.length > 0 ? users.reduce((prev, current) =>
        ((prev.challengesSolved || 0) > (current.challengesSolved || 0)) ? prev : current, users[0]) : null;

    //longest streak
    const longestStreakUser = users.length > 0 ? users.reduce((prev, current) =>
        ((prev.longest_streak || prev.current_streak || 0) > (current.longest_streak || current.current_streak || 0)) ? prev : current, users[0]) : null;


    
    return (
        <div className="min-h-screen bg-[#0B1220] px-8 py-8 text-white font-sans">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-2xl">🏆</span> Leaderboard
                </h1>

                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search escapers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
                    />
                    {/* <button className="bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-800 transition">
                        <span>Filter</span>
                    </button> */}
                </div>
            </div>


            {/* Top Performers Cards */}
            <h2 className="text-lg font-semibold mb-4">Top Performers</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                {/* 1. XP Gainer - Dynamic */}
                <div className="bg-linear-to-br from-indigo-900 to-indigo-800 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-indigo-500/20 p-2 rounded-lg">
                        ⚡
                    </div>
                    <div className="text-sm text-indigo-200 mb-1">
                        {timeframe === "weekly" ? "Weekly" : timeframe === "monthly" ? "Monthly" : "All Time"} XP Gainer
                    </div>
                    <div className="text-2xl font-bold mb-4">
                        {topXPGainer ? `+${topXPGainer.xp.toLocaleString()} XP` : "0 XP"}
                    </div>
                    <div className="flex items-center gap-3">
                        {topXPGainer && (
                            <>
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold uppercase text-white">
                                    {topXPGainer.username[0]}
                                </div>
                                <span className="font-medium">{topXPGainer.username}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* 2. Top Solver - Replaces Fastest Solver */}
                <div className="bg-linear-to-br from-orange-900 to-orange-800/80 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-orange-500/20 p-2 rounded-lg">
                        🎯
                    </div>
                    <div className="text-sm text-orange-200 mb-1">Top Solver</div>
                    <div className="text-2xl font-bold mb-4">
                        {topSolver ? `${topSolver.challengesSolved || 0} Solved` : "0 Solved"}
                    </div>
                    <div className="flex items-center gap-3">
                        {topSolver && (
                            <>
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold uppercase text-white">
                                    {topSolver.username[0]}
                                </div>
                                <span className="font-medium">{topSolver.username}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* 3. Longest Streak - Dynamic */}
                <div className="bg-linear-to-br from-emerald-900 to-emerald-800/80 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-emerald-500/20 p-2 rounded-lg">
                        🔥
                    </div>
                    <div className="text-sm text-emerald-200 mb-1">Longest Streak</div>
                    <div className="text-2xl font-bold mb-4">
                        {longestStreakUser ? `${longestStreakUser.longest_streak || longestStreakUser.current_streak || 0} days` : "0 days"}
                    </div>
                    <div className="flex items-center gap-3">
                        {longestStreakUser && (
                            <>
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold uppercase text-white">
                                    {longestStreakUser.username[0]}
                                </div>
                                <span className="font-medium">{longestStreakUser.username}</span>
                            </>
                        )}
                    </div>
                </div>

            </div>


            {/* Tabs */}
            <div className="flex gap-8 border-b border-slate-800 text-sm text-slate-400 mb-6">
                <button
                    onClick={() => setTimeframe("weekly")}
                    className={`pb-3 ${timeframe === "weekly" ? "border-b-2 border-indigo-500 text-white font-medium" : "hover:text-slate-300"}`}
                >
                    Weekly
                </button>
                <button
                    onClick={() => setTimeframe("monthly")}
                    className={`pb-3 ${timeframe === "monthly" ? "border-b-2 border-indigo-500 text-white font-medium" : "hover:text-slate-300"}`}
                >
                    Monthly
                </button>
                <button
                    onClick={() => setTimeframe("all-time")}
                    className={`pb-3 ${timeframe === "all-time" ? "border-b-2 border-indigo-500 text-white font-medium" : "hover:text-slate-300"}`}
                >
                    All Time
                </button>
            </div>


            {/* Table */}
            <div className="bg-[#0f172a] rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#1e293b] text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <tr>
                            <th className="py-4 px-6">Rank</th>
                            <th className="py-4 px-6">Escaper</th>
                            <th className="py-4 px-6 text-center">Level</th>
                            <th className="py-4 px-6 text-center">XP</th>
                            <th className="py-4 px-6 text-center">Badges</th>
                            <th className="py-4 px-6 text-center">Challenges</th>
                            <th className="py-4 px-6 text-right">Streak</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                        {users.map((user, index) => (
                            <tr key={user.id} className={`hover:bg-slate-800/50 transition ${index < 3 ? 'bg-slate-800/20' : ''}`}>

                                {/* Rank */}
                                <td className="py-4 px-6 font-medium">
                                    {page === 1 && index === 0 && <span className="text-yellow-400 text-lg">🥇</span>}
                                    {page === 1 && index === 1 && <span className="text-slate-300 text-lg">🥈</span>}
                                    {page === 1 && index === 2 && <span className="text-amber-600 text-lg">🥉</span>}
                                    {(page > 1 || index > 2) && <span className="text-slate-500 ml-2">{(page - 1) * LIMIT + index + 1}</span>}
                                </td>

                                {/* Escaper */}
                                <td className="py-4 px-6">
                                    <div 
                                        className="flex items-center gap-3 cursor-pointer group/user"
                                        onClick={() => setSelectedProfileUserId(user.id)}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white uppercase group-hover/user:ring-2 group-hover/user:ring-indigo-400 transition-all">
                                            {user.username[0]}
                                        </div>
                                        <span className="font-medium text-white group-hover/user:text-indigo-300 transition-colors">{user.username}</span>
                                        {/* {user.is_premium && <span className="text-yellow-500 text-xs">⭐</span>} */}
                                    </div>
                                </td>

                                {/* Level */}
                                <td className="py-4 px-6 text-center">
                                    <span className="inline-block bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-xs font-bold">
                                        {user.levelNumber || user.level_id || 1}
                                    </span>
                                </td>

                                {/* XP */}
                                <td className="py-4 px-6 text-center font-mono font-medium text-white">
                                    {user.xp.toLocaleString()}
                                </td>

                                {/* Badges */}
                                <td className="py-4 px-6 text-center text-slate-400">
                                    {user.badgesCount || 0}
                                </td>

                                {/* Challenges */}
                                <td className="py-4 px-6 text-center text-slate-400">
                                    {user.challengesSolved || 0}
                                </td>

                                {/* Streak */}
                                <td className="py-4 px-6 text-right text-emerald-400 font-medium">
                                    ⚡ {user.current_streak} days
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {(!loading && users.length === 0) && (
                    <div className="text-center py-8 text-slate-400 text-sm border-t border-slate-800">
                        No escapers found for your search.
                    </div>
                )}

                {(loading && users.length === 0) && (
                    <div className="text-center py-8 text-slate-400 text-sm border-t border-slate-800">
                        Loading leaderboard...
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-end items-center gap-3 mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="px-3 py-1 bg-slate-800 text-slate-300 rounded disabled:opacity-40 hover:bg-slate-700 transition font-medium"
                    >
                        Prev
                    </button>

                    <span className="text-slate-400 text-sm">
                        Page {page} of {totalPages}
                    </span>

                    <button
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className="px-3 py-1 bg-slate-800 text-slate-300 rounded disabled:opacity-40 hover:bg-slate-700 transition font-medium"
                    >
                        Next
                    </button>
                </div>
            )}

            <div className="mt-4 text-xs text-slate-500 text-right">
                Showing {users.length} of {totalUsers} results
            </div>

            {/* User Profile Card */}
            {selectedProfileUserId && (
                <UserProfileCard 
                    userId={selectedProfileUserId} 
                    onClose={() => setSelectedProfileUserId(null)} 
                />
            )}

        </div>
    );
};

export default NewLeaderboard;
