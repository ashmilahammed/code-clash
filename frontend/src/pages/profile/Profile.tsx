import React from "react";
import { useAuthStore } from "../../store/useAuthStore";
import {
    Settings,
    Zap,
    Clock,
    Bug,
    Award,
    Users,
    Github,
    Linkedin,
    Code2
} from "lucide-react";
import { useRef, useState } from "react";
import api from "../../api/axiosInstance";
import ConfirmModal from "../../components/modals/ConfirmModal";



const Profile = () => {
    const user = useAuthStore((state) => state.user);
    const updateUser = useAuthStore((state) => state.updateUser);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


    if (!user) return null;

    const handleAvatarChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("avatar", file);

            const response = await api.patch("/user/avatar", formData);

            // backend returns updated user snapshot
            updateUser(response.data.data);

        } catch (error) {
            console.error("Avatar upload failed", error);
        } finally {
            setLoading(false);
        }
    };




    return (
        <div className="min-h-screen bg-[#0B1221] text-white font-sans pb-12">
            {/* Static Header Background */}
            <div className="relative h-64 w-full bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent to-[#0B1221]/80"></div>

                {/* Settings Button */}
                <div className="absolute top-4 right-4 z-10">
                    <button className="p-2 bg-black/30 hover:bg-black/50 rounded-full transition text-white backdrop-blur-sm border border-white/10">
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6">
                {/* Profile Header */}
                <div className="relative -mt-20 mb-8 flex flex-col md:flex-row items-end md:items-center gap-6">

                    {/* Avatar */}
                    <div className="relative group">

                        <div className="w-40 h-40 rounded-full border-4 border-[#0B1221] overflow-hidden bg-slate-800 shadow-xl relative">
                            <img
                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                                alt="Profile"
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-105 group-hover:blur-[2px]"
                            />

                            {/* Loading Overlay */}
                            {loading && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
                                    <span className="text-sm text-white font-medium">Uploading...</span>
                                </div>
                            )}


                            {/* Edit overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/40 z-10 gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fileInputRef.current?.click();
                                    }}
                                    className="bg-black/60 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md hover:bg-black/80 transition"
                                >
                                    <span className="text-xs font-semibold text-white tracking-wide">
                                        Change
                                    </span>
                                </button>
                                
                                {user.avatar && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsDeleteModalOpen(true);
                                        }}
                                        className="bg-red-500/80 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md hover:bg-red-600/90 transition"
                                    >
                                        <span className="text-xs font-semibold text-white tracking-wide">
                                            Remove
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>


                        {/* Hidden File Input */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleAvatarChange}
                        />

                        {/* Level Badge */}
                        <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs font-bold w-9 h-9 flex items-center justify-center rounded-full border-4 border-[#0B1221] z-20 shadow-lg">
                            32
                        </div>
                    </div>


                    {/* Info */}
                    <div className="flex-1 mb-2">
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-4xl font-bold tracking-tight text-white">{user.username}</h1>
                            {user.is_premium && <Award className="text-yellow-400" size={28} fill="currentColor" />}
                        </div>

                        <div className="text-slate-400 text-sm flex flex-wrap gap-x-6 gap-y-2 mb-4 font-medium">
                            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Rank 24</span>
                            <span className="flex items-center gap-1.5"><Zap size={14} className="text-yellow-500" /> 7 day streak</span>
                            <span className="flex items-center gap-1.5"><Users size={14} className="text-red-400" /> 436 followers</span>
                        </div>

                        <div className="flex gap-4">
                            {user.github_url && (
                                <a href={user.github_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition p-1 hover:bg-slate-800 rounded"><Github size={20} /></a>
                            )}
                            {user.linkedin_url && (
                                <a href={user.linkedin_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition p-1 hover:bg-slate-800 rounded"><Linkedin size={20} /></a>
                            )}
                        </div>
                    </div>

                    {/* Action */}
                    <div className="mb-4">
                        <button className="px-6 py-2.5 bg-[#1E293B] hover:bg-[#283548] text-white rounded-lg font-medium transition border border-slate-700 shadow-sm hover:shadow-md active:transform active:scale-95">
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Level Progress */}
                        <div className="bg-[#131B2D] border border-slate-800/60 rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-bold text-lg text-white">Level 32</span>
                                <span className="text-blue-400 text-sm font-semibold bg-blue-400/10 px-2 py-0.5 rounded">12850 XP</span>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mb-3">
                                <div className="bg-linear-to-r from-blue-600 to-purple-600 h-full w-[70%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                            </div>
                            <div className="flex justify-between text-xs font-medium text-slate-500">
                                <span>Current Level</span>
                                <span>350 / 500 XP to Level 33</span>
                            </div>
                        </div>

                        {/* Domain Stats */}
                        <div className="bg-[#131B2D] border border-slate-800/60 rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-lg mb-5 text-white flex items-center gap-2">
                                <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                                Domain Stats
                            </h3>

                            <div className="flex justify-between py-3 border-b border-slate-800/50">
                                <span className="text-slate-400 text-sm font-medium">Challenges Completed</span>
                                <span className="font-bold text-white text-lg">247</span>
                            </div>
                            <div className="flex justify-between py-3 mb-5">
                                <span className="text-slate-400 text-sm font-medium">Acceptance Rate</span>
                                <span className="font-bold text-white text-lg">89.2%</span>
                            </div>

                            <div className="space-y-4">
                                {/* Easy */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-medium text-slate-400">
                                        <span>Easy</span>
                                        <span className="text-slate-300">142/177</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div className="bg-green-500 h-full w-[80%] rounded-full"></div>
                                    </div>
                                </div>
                                {/* Medium */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-medium text-slate-400">
                                        <span>Medium</span>
                                        <span className="text-slate-300">89/122</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div className="bg-orange-500 h-full w-[72%] rounded-full"></div>
                                    </div>
                                </div>
                                {/* Hard */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-medium text-slate-400">
                                        <span>Hard</span>
                                        <span className="text-slate-300">11/24</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div className="bg-red-500 h-full w-[45%] rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Badges */}
                        <div className="bg-[#131B2D] border border-slate-800/60 rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-lg mb-5 text-white flex items-center gap-2">
                                <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
                                Badges
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Badge 1 */}
                                <div className="bg-[#1E293B]/50 border border-slate-800 p-4 rounded-xl flex gap-4 items-center hover:bg-[#1E293B] transition group">
                                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg group-hover:scale-110 transition duration-300">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white">Fast Solver</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">Solved 10 challenges in under 5 mins</p>
                                    </div>
                                </div>
                                {/* Badge 2 */}
                                <div className="bg-[#1E293B]/50 border border-slate-800 p-4 rounded-xl flex gap-4 items-center hover:bg-[#1E293B] transition group">
                                    <div className="p-3 bg-green-500/10 text-green-400 rounded-lg group-hover:scale-110 transition duration-300">
                                        <Bug size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white">Debugging Master</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">Fixed 50 bugs</p>
                                    </div>
                                </div>
                                {/* Badge 3 */}
                                <div className="bg-[#1E293B]/50 border border-slate-800 p-4 rounded-xl flex gap-4 items-center hover:bg-[#1E293B] transition group">
                                    <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-lg group-hover:scale-110 transition duration-300">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white">Elite Coder</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">Solved 10+ challenges without hints</p>
                                    </div>
                                </div>
                                {/* Badge 4 */}
                                <div className="bg-[#1E293B]/50 border border-slate-800 p-4 rounded-xl flex gap-4 items-center hover:bg-[#1E293B] transition group">
                                    <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg group-hover:scale-110 transition duration-300">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white">Social Collaborator</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">Helped 20+ members</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Languages */}
                        <div className="bg-[#131B2D] border border-slate-800/60 rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-lg mb-5 text-white flex items-center gap-2">
                                <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                                Languages
                            </h3>
                            <div className="space-y-5">
                                {/* JS */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-slate-200">Javascript</span>
                                        <span className="text-slate-400 font-mono text-xs bg-slate-800 px-2 py-0.5 rounded">12 Solved</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-yellow-400 h-full w-[10%] rounded-full shadow-[0_0_8px_rgba(250,204,21,0.4)]"></div>
                                    </div>
                                </div>
                                {/* Python */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-slate-200">Python</span>
                                        <span className="text-slate-400 font-mono text-xs bg-slate-800 px-2 py-0.5 rounded">127 Solved</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full w-[70%] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]"></div>
                                    </div>
                                </div>
                                {/* Java */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-slate-200">Java</span>
                                        <span className="text-slate-400 font-mono text-xs bg-slate-800 px-2 py-0.5 rounded">44 Solved</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-orange-600 h-full w-[30%] rounded-full shadow-[0_0_8px_rgba(234,88,12,0.4)]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-[#131B2D] border border-slate-800/60 rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-lg mb-5 text-white flex items-center gap-2">
                                <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                                Recent Activity
                            </h3>
                            <div className="space-y-3">
                                <div className="p-4 bg-[#1E293B]/50 border border-slate-800/50 rounded-xl flex justify-between items-center hover:bg-[#283548] transition cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-500/10 text-green-400 rounded-lg group-hover:bg-green-500/20 transition">
                                            <Code2 size={18} />
                                        </div>
                                        <span className="text-sm font-medium text-slate-200">Longest SubString</span>
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">2 hours ago</span>
                                </div>
                                <div className="p-4 bg-[#1E293B]/50 border border-slate-800/50 rounded-xl flex justify-between items-center hover:bg-[#283548] transition cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500/20 transition">
                                            <Code2 size={18} />
                                        </div>
                                        <span className="text-sm font-medium text-slate-200">Two Sum</span>
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">1 day ago</span>
                                </div>
                                <div className="p-4 bg-[#1E293B]/50 border border-slate-800/50 rounded-xl flex justify-between items-center hover:bg-[#283548] transition cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg group-hover:bg-purple-500/20 transition">
                                            <Code2 size={18} />
                                        </div>
                                        <span className="text-sm font-medium text-slate-200">Remove nth node from linked list</span>
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">3 days ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            {/* Delete Confirmation Modal */}
            <ConfirmModal
                open={isDeleteModalOpen}
                title="Remove Avatar"
                message="Are you sure you want to remove your avatar? It will go back to the default avatar."
                confirmText="Remove"
                cancelText="Cancel"
                onConfirm={async () => {
                    try {
                        const response = await api.delete("/user/avatar");
                        updateUser(response.data.data);
                        setIsDeleteModalOpen(false);
                    } catch (error) {
                        console.error("Failed to remove avatar", error);
                    }
                }}
                onCancel={() => setIsDeleteModalOpen(false)}
            />

        </div>
    );
};

export default Profile;
