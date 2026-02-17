import { useEffect, useState } from "react";
import { getLeaderboardApi } from "../../api/userApi";
import type { User } from "../../types/User";

const NewLeaderboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLeaderboardApi(50) // fetch top 50
            .then(setUsers)
            .finally(() => setLoading(false));
    }, []);

    // Mock stats for now
    // const topGainer = users[0]; 
    // const fastestSolver = users[1]; 
    // const longestStreak = users.reduce((prev, current) => (prev.current_streak > current.current_streak) ? prev : current, users[0]);

    // Use users in list if available, or placeholder
    const longestStreakUser = users.length > 0 ? users.reduce((prev, current) => (prev.current_streak > current.current_streak) ? prev : current, users[0]) : null;


    if (loading) return <div className="p-8 text-white">Loading leaderboard...</div>;

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
                        className="bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
                    />
                    <button className="bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-800 transition">
                        <span>Filter</span>
                    </button>
                </div>
            </div>


            {/* Top Performers Cards */}
            <h2 className="text-lg font-semibold mb-4">Top Performers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                {/* 1. Weekly XP Gainer - Mocked */}
                <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-indigo-500/20 p-2 rounded-lg">
                        ⚡
                    </div>
                    <div className="text-sm text-indigo-200 mb-1">Weekly XP Gainer</div>
                    <div className="text-2xl font-bold mb-4">+5,423 XP</div>
                    <div className="flex items-center gap-3">
                        {/* Avatar Placeholder */}
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                            🧙‍♂️
                        </div>
                        <span className="font-medium">Ashmil</span>
                        {/* (Mock Name) */}
                    </div>
                </div>

                {/* 2. Fastest Solver - Mocked */}
                <div className="bg-gradient-to-br from-orange-900 to-orange-800/80 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-orange-500/20 p-2 rounded-lg">
                        ⏱️
                    </div>
                    <div className="text-sm text-orange-200 mb-1">Fastest Solver</div>
                    <div className="text-2xl font-bold mb-4">3m 42s avg</div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                            🧙‍♂️
                        </div>
                        <span className="font-medium">Ahammed</span>
                    </div>
                </div>

                {/* 3. Longest Streak - Real Data */}
                <div className="bg-gradient-to-br from-emerald-900 to-emerald-800/80 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-emerald-500/20 p-2 rounded-lg">
                        🔥
                    </div>
                    <div className="text-sm text-emerald-200 mb-1">Longest Streak</div>
                    <div className="text-2xl font-bold mb-4">
                        {longestStreakUser ? `${longestStreakUser.current_streak} days` : "0 days"}
                    </div>
                    <div className="flex items-center gap-3">
                        {longestStreakUser && (
                            <>
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                                    🧙‍♂️
                                </div>
                                <span className="font-medium">{longestStreakUser.username}</span>
                            </>
                        )}
                    </div>
                </div>

            </div>


            {/* Tabs */}
            <div className="flex gap-8 border-b border-slate-800 text-sm text-slate-400 mb-6">
                <button className="pb-3 border-b-2 border-indigo-500 text-white font-medium">Weekly</button>
                <button className="pb-3 hover:text-slate-300">Monthly</button>
                <button className="pb-3 hover:text-slate-300">All Time</button>
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
                                    {index === 0 && <span className="text-yellow-400 text-lg">🥇</span>}
                                    {index === 1 && <span className="text-slate-300 text-lg">🥈</span>}
                                    {index === 2 && <span className="text-amber-600 text-lg">🥉</span>}
                                    {index > 2 && <span className="text-slate-500 ml-2">{index + 1}</span>}
                                </td>

                                {/* Escaper */}
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white uppercase">
                                            {user.username[0]}
                                        </div>
                                        <span className="font-medium text-white">{user.username}</span>
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
            </div>

            <div className="mt-4 text-xs text-slate-500 text-right">
                Showing {users.length} results
            </div>

        </div>
    );
};

export default NewLeaderboard;
