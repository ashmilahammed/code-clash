import { useNavigate } from "react-router-dom";
import LevelProgress from "./dashboard/LevelProgress";
import StreakCalendar from "./dashboard/StreakCalendar";
import PremiumBanner from "./dashboard/PremiumBanner";
import LandingChallengeList from "./landing/LandingChallengeList";
import { Users, Activity } from "lucide-react";

// Mock Data for Landing Page
const MOCK_DATA = {
    level: {
        level: 1,
        currentXp: 120,
        nextLevelXp: 500,
    },
    streak: {
        current: 0,
        longest: 0,
        dates: [],
    },
};

const LandingActiveGroups = () => {
    const navigate = useNavigate();
    return (
        <div className="mt-10 bg-linear-to-br from-[#0F172A] to-[#020617] rounded-2xl p-6 shadow-lg border border-slate-800">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                    <Users size={20} />
                    Active Groups
                </h3>
                <span className="text-xs text-slate-400">3 groups</span>
            </div>
            <div className="space-y-3">
                {/* Reusing same mock content styling for consistency */}
                {[
                    { id: "1", name: "DSA Warriors", members: 24, active: true },
                    { id: "2", name: "React Ninjas", members: 18, active: true },
                    { id: "3", name: "Backend Masters", members: 12, active: false }
                ].map((group) => (
                    <div
                        key={group.id}
                        className="flex items-center justify-between bg-slate-900/60 rounded-lg px-4 py-3 hover:bg-slate-900 transition"
                    >
                        <div>
                            <p className="text-white font-medium">{group.name}</p>
                            <p className="text-xs text-slate-400">{group.members} members</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {group.active ? (
                                <span className="flex items-center gap-1 text-xs text-green-400">
                                    <Activity size={14} /> Active
                                </span>
                            ) : (
                                <span className="text-xs text-slate-500">Inactive</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 text-right">
                <button
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition"
                    onClick={() => navigate("/auth/login")}
                >
                    View all groups →
                </button>
            </div>
        </div>
    );
};


const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0B1220] px-6 py-6 space-y-8">
            {/* Level / XP */}
            <div onClick={() => navigate("/auth/login")} className="cursor-pointer">
                <LevelProgress
                    level={MOCK_DATA.level.level}
                    currentXp={MOCK_DATA.level.currentXp}
                    nextLevelXp={MOCK_DATA.level.nextLevelXp}
                />
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Challenges */}
                <div className="lg:col-span-2 space-y-6">
                    <LandingChallengeList />
                </div>

                {/* Streak */}
                <div onClick={() => navigate("/auth/login")} className="cursor-pointer">
                    <StreakCalendar
                        currentStreak={MOCK_DATA.streak.current}
                        longestStreak={MOCK_DATA.streak.longest}
                        activeDates={MOCK_DATA.streak.dates}
                    />
                </div>
            </div>

            {/* Premium */}
            <div onClick={() => navigate("/auth/login")} className="cursor-pointer">
                <PremiumBanner />
            </div>

            {/* Groups */}
            <LandingActiveGroups />
        </div>
    );
};

export default LandingPage;
