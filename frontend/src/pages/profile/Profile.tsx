import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import {
    Settings,
    Zap,
    Award,
    Users,
    Github,
    Linkedin,
    Code2,
    // Trophy
} from "lucide-react";
import api from "../../api/axiosInstance";
import { getUserProfileStatsApi, updateUserProfileApi } from "../../api/userApi";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";





const Profile = () => {
    const currentUser = useAuthStore((state) => state.user);
    const updateUser = useAuthStore((state) => state.updateUser);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [profileData, setProfileData] = useState<any>(null);
    const [activityPage, setActivityPage] = useState(1);
    const [view, setView] = useState<"stats" | "info">("stats");
    const [searchParams, setSearchParams] = useSearchParams();

    const targetUserId = searchParams.get("id");
    const isOwnProfile = !targetUserId || targetUserId === currentUser?.id;
    const user = isOwnProfile ? currentUser : profileData?.user;

    // Form states
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [githubUrl, setGithubUrl] = useState("");
    const [linkedinUrl, setLinkedinUrl] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const activityLimit = 5;

    useEffect(() => {
        if (user) {
            setDisplayName(user.username || "");
            setBio(user.about || "");
            setGithubUrl(user.github_url || "");
            setLinkedinUrl(user.linkedin_url || "");
        }
    }, [user]);

    useEffect(() => {
        const viewParam = searchParams.get("view");
        if (!isOwnProfile || viewParam === "info") {
            setView("info");
        } else {
            setView("stats");
        }
    }, [searchParams, isOwnProfile]);

    useEffect(() => {
        let mounted = true;
        setPageLoading(true);
        getUserProfileStatsApi(targetUserId || undefined)
            .then((data) => {
                if (mounted) {
                    setProfileData(data);
                    if (isOwnProfile && data.user) {
                        updateUser(data.user);
                    }
                    setPageLoading(false);
                }
            })
            .catch((err) => {
                console.error("Failed to load profile stats", err);
                if (mounted) setPageLoading(false);
            });
        return () => { mounted = false; };
    }, [targetUserId]);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("avatar", file);
            const response = await api.patch("/user/avatar", formData);
            updateUser(response.data.data);
        } catch (error) {
            console.error("Avatar upload failed", error);
            toast.error("Failed to upload avatar");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveChanges = async () => {
        if (!isOwnProfile) return;
        try {
            setIsSaving(true);
            const updatedUser = await updateUserProfileApi({
                username: displayName,
                about: bio,
                github_url: githubUrl,
                linkedin_url: linkedinUrl
            });
            updateUser(updatedUser);
            toast.success("Profile updated successfully");
            setIsEditing(false);
            setView("stats");

            // Keep the ID if we are somehow editing someone else's profile (should not happen UI-wise)
            const newParams: any = {};
            if (targetUserId) newParams.id = targetUserId;
            setSearchParams(newParams);
        } catch (error) {
            console.error("Profile update failed", error);
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        if (currentUser) {
            setDisplayName(currentUser.username || "");
            setBio(currentUser.about || "");
            setGithubUrl(currentUser.github_url || "");
            setLinkedinUrl(currentUser.linkedin_url || "");
        }
        setIsEditing(false);
    };

    if (!user || pageLoading || !profileData) return (
        <div className="min-h-screen bg-[#0B1221] flex items-center justify-center">
            <p className="text-slate-400 animate-pulse text-sm">Loading profile...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0B1221] text-white font-sans pb-12">
            {/* Static Header Background */}
            <div className="relative h-64 w-full bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent to-[#0B1221]/80"></div>

                {/* Settings Button */}
                {isOwnProfile && (
                    <div className="absolute top-4 right-50 z-10">
                        <button
                            onClick={() => window.location.href = '/settings'}
                            className="p-2 bg-black/30 hover:bg-black/50 rounded-full transition transform hover:scale-110 hover:rotate-45 text-white hover:text-indigo-400 backdrop-blur-sm border border-white/10"
                        >
                            <Settings size={20} />
                        </button>
                    </div>
                )}
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
                            {loading && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
                                    <span className="text-sm text-white font-medium">Uploading...</span>
                                </div>
                            )}
                            {isOwnProfile && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/40 z-10 gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fileInputRef.current?.click();
                                        }}
                                        className="bg-black/60 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md hover:bg-black/80 transition"
                                    >
                                        <span className="text-xs font-semibold text-white tracking-wide">Change</span>
                                    </button>

                                    {user.avatar && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsDeleteModalOpen(true);
                                            }}
                                            className="bg-red-500/80 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md hover:bg-red-600/90 transition"
                                        >
                                            <span className="text-xs font-semibold text-white tracking-wide">Remove</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleAvatarChange}
                        />

                        <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs font-bold w-9 h-9 flex items-center justify-center rounded-full border-4 border-[#0B1221] z-20 shadow-lg">
                            {profileData.level.level}
                        </div>
                    </div>

                    <div className="flex-1 mb-2">
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-4xl font-bold tracking-tight text-white">{user.username}</h1>
                            {user.is_premium && <Award className="text-yellow-400" size={28} fill="currentColor" />}
                        </div>

                        <div className="text-slate-400 text-sm flex flex-wrap gap-x-6 gap-y-2 mb-4 font-medium">
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                Rank {user.role === 'admin' ? 'Admin' : 'User'}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Zap size={14} className="text-yellow-500" /> {profileData.streak.current} day streak
                            </span>
                        </div>
                        {/* 
                        <div className="flex gap-4">
                            {user.github_url && (
                                <a href={user.github_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition p-1 hover:bg-slate-800 rounded">
                                    <Github size={20} />
                                </a>
                            )}
                            {user.linkedin_url && (
                                <a href={user.linkedin_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition p-1 hover:bg-slate-800 rounded">
                                    <Linkedin size={20} />
                                </a>
                            )}
                        </div> */}
                    </div>

                    {isOwnProfile && (
                        <div className="mb-4">
                            <button
                                onClick={() => {
                                    const newParams: any = {};
                                    if (targetUserId) newParams.id = targetUserId;
                                    if (view === 'stats') {
                                        newParams.view = 'info';
                                    }
                                    setSearchParams(newParams);
                                }}
                                className={`px-6 py-2.5 rounded-lg font-medium transition border shadow-sm hover:shadow-md active:transform active:scale-95 ${view === 'info'
                                    ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-700'
                                    : 'bg-[#1E293B] border-slate-700 text-white hover:bg-[#283548]'
                                    }`}
                            >
                                {view === 'info' ? 'Back to Stats' : 'Profile'}
                            </button>
                        </div>
                    )}
                </div>

                {view === 'stats' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div className="bg-[#131B2D] border border-slate-800/60 rounded-xl p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-bold text-lg text-white">Level {profileData.level.level}</span>
                                    <span className="text-blue-400 text-sm font-semibold bg-blue-400/10 px-2 py-0.5 rounded">{profileData.level.currentXp - profileData.level.minXp} XP</span>
                                </div>
                                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mb-3">
                                    <div
                                        className="bg-linear-to-r from-blue-600 to-purple-600 h-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                        style={{ width: `${Math.min(((profileData.level.currentXp - profileData.level.minXp) / (profileData.level.maxXp - profileData.level.minXp + 1)) * 100, 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs font-medium text-slate-500">
                                    <span>Current Level</span>
                                    <span>{Math.max(profileData.level.maxXp - profileData.level.currentXp + 1, 0)} XP to Level {profileData.level.level + 1}</span>
                                </div>
                            </div>

                            <div className="bg-[#131B2D] border border-slate-800/60 rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-lg mb-5 text-white flex items-center gap-2">
                                    <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                                    Domain Stats
                                </h3>
                                <div className="flex justify-between py-3 border-b border-slate-800/50">
                                    <span className="text-slate-400 text-sm font-medium">Challenges Completed</span>
                                    <span className="font-bold text-white text-lg">{profileData.stats.stats.passedSubmissions}</span>
                                </div>
                                <div className="flex justify-between py-3 mb-5">
                                    <span className="text-slate-400 text-sm font-medium">Acceptance Rate</span>
                                    <span className="font-bold text-white text-lg">{profileData.stats.stats.acceptanceRate.toFixed(1)}%</span>
                                </div>
                                <div className="space-y-4">
                                    {/* Difficulty levels */}
                                    {['easy', 'medium', 'hard'].map((diff) => {
                                        const count = profileData.stats.byDifficulty.find((d: any) => d.difficulty === diff)?.count || 0;
                                        const color = diff === 'easy' ? 'bg-green-500' : diff === 'medium' ? 'bg-orange-500' : 'bg-red-500';
                                        return (
                                            <div key={diff} className="space-y-1.5">
                                                <div className="flex justify-between text-xs font-medium text-slate-400">
                                                    <span className="capitalize">{diff}</span>
                                                    <span className="text-slate-300">{count} Solved</span>
                                                </div>
                                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                                    <div className={`${color} h-full rounded-full`} style={{ width: `${Math.min((count / Math.max(profileData.stats.stats.passedSubmissions, 1)) * 100, 100)}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-[#131B2D] border border-slate-800/60 rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-lg mb-5 text-white flex items-center gap-2">
                                    <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
                                    Badges
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {profileData.user.badges && profileData.user.badges.length > 0 ? (
                                        profileData.user.badges.map((badge: any, idx: number) => (
                                            <div key={badge.id || idx} className="bg-[#1E293B]/50 border border-slate-800 p-4 rounded-xl flex gap-4 items-center hover:bg-[#1E293B] transition group">
                                                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg group-hover:scale-110 transition duration-300">
                                                    {badge.icon ? (
                                                        badge.icon.startsWith('http') ? (
                                                            <img src={badge.icon} alt={badge.name} className="w-6 h-6 object-contain" />
                                                        ) : (
                                                            <Award size={24} />
                                                        )
                                                    ) : (
                                                        <Award size={24} />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-white">{badge.name}</h4>
                                                    <p className="text-xs text-slate-400 mt-0.5">{badge.description}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-8 text-center bg-[#1E293B]/30 rounded-xl border border-dashed border-slate-800">
                                            <p className="text-slate-500 text-sm">No badges achieved yet. Keep coding!</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-[#131B2D] border border-slate-800/60 rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-lg mb-5 text-white flex items-center gap-2">
                                    <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                                    Languages
                                </h3>
                                <div className="space-y-5">
                                    {profileData.stats.byLanguage.length === 0 && <p className="text-sm text-slate-400">No challenges solved yet.</p>}
                                    {profileData.stats.byLanguage.map((lang: any, idx: number) => {
                                        const colors = ["bg-yellow-400", "bg-blue-500", "bg-orange-600", "bg-purple-500", "bg-green-500"];
                                        return (
                                            <div key={lang.language} className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-medium text-slate-200 capitalize">{lang.language}</span>
                                                    <span className="text-slate-400 font-mono text-xs bg-slate-800 px-2 py-0.5 rounded">{lang.count} Solved</span>
                                                </div>
                                                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`${colors[idx % colors.length]} h-full rounded-full`}
                                                        style={{ width: `${Math.min((lang.count / Math.max(profileData.stats.stats.passedSubmissions, 1)) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-[#131B2D] border border-slate-800/60 rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-lg mb-5 text-white flex items-center gap-2">
                                    <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                                    Recent Activity
                                </h3>
                                <div className="space-y-3">
                                    {profileData.recentActivity.length === 0 && <p className="text-sm text-slate-400">No recent activity.</p>}
                                    {profileData.recentActivity.slice((activityPage - 1) * activityLimit, activityPage * activityLimit).map((activity: any) => (
                                        <div key={activity._id.toString()} className="p-4 bg-[#1E293B]/50 border border-slate-800/50 rounded-xl flex justify-between items-center hover:bg-[#283548] transition cursor-pointer group">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg transition ${activity.status === 'PASSED' ? 'bg-green-500/10 text-green-400 group-hover:bg-green-500/20' : 'bg-red-500/10 text-red-400 group-hover:bg-red-500/20'}`}>
                                                    <Code2 size={18} />
                                                </div>
                                                <span className="text-sm font-medium text-slate-200 line-clamp-1">{activity.challengeName}</span>
                                            </div>
                                            <span className="text-xs text-slate-400 font-medium whitespace-nowrap ml-2">{new Date(activity.submittedAt).toLocaleDateString()}</span>
                                        </div>
                                    ))}

                                    {Math.ceil(profileData.recentActivity.length / activityLimit) > 1 && (
                                        <div className="flex justify-between items-center pt-2">
                                            <button
                                                disabled={activityPage === 1}
                                                onClick={() => setActivityPage(prev => Math.max(prev - 1, 1))}
                                                className="text-xs px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition"
                                            >
                                                Previous
                                            </button>
                                            <span className="text-xs text-slate-500 font-medium">Page {activityPage} of {Math.ceil(profileData.recentActivity.length / activityLimit)}</span>
                                            <button
                                                disabled={activityPage === Math.ceil(profileData.recentActivity.length / activityLimit)}
                                                onClick={() => setActivityPage(prev => Math.min(prev + 1, Math.ceil(profileData.recentActivity.length / activityLimit)))}
                                                className="text-xs px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-[#131B2D] border border-slate-800/60 rounded-2xl p-8 shadow-xl">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">User Info</h3>
                                    {isOwnProfile && !isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            // className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition border border-green-500 active:scale-95"
                                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition border border-indigo-500 active:scale-95"
                                        >
                                            {/* <Pencil size={16} /> */}
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400 ml-1">Display Name</label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                readOnly={!isOwnProfile || !isEditing}
                                                className={`w-full bg-[#1E293B]/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium ${(!isOwnProfile || !isEditing) ? 'cursor-default' : ''}`}
                                                placeholder="Enter your name"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500">
                                                <Users size={18} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400 ml-1">Bio</label>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            readOnly={!isOwnProfile || !isEditing}
                                            rows={4}
                                            className={`w-full bg-[#1E293B]/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium resize-none ${(!isOwnProfile || !isEditing) ? 'cursor-default' : ''}`}
                                            placeholder={isOwnProfile ? (isEditing ? "Tell us about yourself..." : "You haven't added a bio yet.") : "This user hasn't added a bio yet."}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-400 ml-1 flex items-center gap-2">
                                                <Github size={14} /> GitHub
                                            </label>
                                            <input
                                                type="text"
                                                value={githubUrl}
                                                onChange={(e) => setGithubUrl(e.target.value)}
                                                readOnly={!isOwnProfile || !isEditing}
                                                className={`w-full bg-[#1E293B]/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm font-medium ${(!isOwnProfile || !isEditing) ? 'cursor-default' : ''}`}
                                                placeholder="github.com/username"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-400 ml-1 flex items-center gap-2">
                                                <Linkedin size={14} /> LinkedIn
                                            </label>
                                            <input
                                                type="text"
                                                value={linkedinUrl}
                                                onChange={(e) => setLinkedinUrl(e.target.value)}
                                                readOnly={!isOwnProfile || !isEditing}
                                                className={`w-full bg-[#1E293B]/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm font-medium ${(!isOwnProfile || !isEditing) ? 'cursor-default' : ''}`}
                                                placeholder="linkedin.com/in/username"
                                            />
                                        </div>
                                    </div>

                                    {isOwnProfile && isEditing && (
                                        <div className="pt-4 flex items-center gap-4">
                                            <button
                                                onClick={handleSaveChanges}
                                                disabled={isSaving}
                                                className="flex-1 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    "Save Changes"
                                                )}
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                disabled={isSaving}
                                                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all active:scale-95"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-[#131B2D] border border-slate-800/60 rounded-2xl p-6 shadow-xl space-y-6">
                                <div className="flex items-center gap-4 text-slate-300">
                                    <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-xl">
                                        <Award size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-400">Badges</p>
                                        <p className="text-xl font-bold text-white">{profileData.user.badgesCount || 0}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-slate-300">
                                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                                        <Code2 size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-400">Challenges Solved</p>
                                        <p className="text-xl font-bold text-white">{profileData.stats.stats.passedSubmissions}</p>
                                    </div>
                                </div>

                                {/* <div className="flex items-center gap-4 text-slate-300">
                                    <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                                        <Trophy size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-400">Rank</p>
                                        <p className="text-xl font-bold text-white">#24</p>
                                    </div>
                                </div> */}

                                <div className="pt-4 border-t border-slate-800/50">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium text-slate-400">Next Level</span>
                                        <span className="text-xs font-bold text-blue-400">{profileData.level.currentXp - profileData.level.minXp} / {profileData.level.maxXp - profileData.level.minXp + 1}</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-linear-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                                            style={{ width: `${Math.min(((profileData.level.currentXp - profileData.level.minXp) / (profileData.level.maxXp - profileData.level.minXp + 1)) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

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
