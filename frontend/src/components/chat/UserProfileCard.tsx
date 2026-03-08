import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trophy, Zap, User, MessageSquare, Flame, Loader2 } from 'lucide-react';
import { getUserProfileStatsApi } from '../../api/userApi';
import { useChatStore } from '../../store/useChatStore';

interface UserProfileCardProps {
    userId: string;
    onClose: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ userId, onClose }) => {
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { startDirectMessage } = useChatStore();
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const stats = await getUserProfileStatsApi(userId);
                setData(stats);
            } catch (error) {
                console.error('Failed to fetch user profile stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleSendMessage = async () => {
        try {
            await startDirectMessage(userId);
            onClose();
            navigate('/messages');
        } catch (error) {
            console.error('Failed to start direct message:', error);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <div ref={cardRef} className="bg-[#141C2F] border border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center shadow-2xl min-w-[300px]">
                    <Loader2 size={32} className="text-blue-500 animate-spin mb-4" />
                    <p className="text-slate-400 text-sm">Loading profile stats...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { user, level, streak, stats } = data;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                ref={cardRef}
                className="bg-[#141C2F] border border-slate-700 rounded-3xl p-8 shadow-2xl max-w-sm w-full relative overflow-hidden animate-in zoom-in-95 duration-300"
            >
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-blue-600/10 to-transparent pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors p-1"
                >
                    <X size={20} />
                </button>

                {/* Profile Header */}
                <div className="flex items-center gap-6 mb-8 relative">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full p-1 bg-linear-to-br from-yellow-500 via-orange-500 to-red-500">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden border-2 border-slate-900/50">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={40} className="text-slate-600" />
                                )}
                            </div>
                        </div>
                        {user.is_premium && (
                            <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-slate-900 p-1.5 rounded-full shadow-lg border-2 border-[#141C2F]">
                                <Trophy size={12} fill="currentColor" />
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{user.username}</h2>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="flex items-center gap-1.5 text-yellow-500 font-semibold bg-yellow-500/10 px-2 py-0.5 rounded-lg border border-yellow-500/20">
                                <Trophy size={14} fill="currentColor" />
                                Level {level.level}
                            </span>
                            <span className="flex items-center gap-1.5 text-blue-400 font-semibold bg-blue-400/10 px-2 py-0.5 rounded-lg border border-blue-400/20">
                                <Zap size={14} fill="currentColor" />
                                {user.xp.toLocaleString()} XP
                            </span>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-orange-500 font-bold text-sm">
                            <Flame size={18} fill="currentColor" />
                            Streak: {streak.current}
                        </div>
                    </div>
                </div>

                {/* Badges Box */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 mb-8 flex items-center gap-4 group hover:bg-slate-800/60 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-500 shrink-0">
                        <Trophy size={20} />
                    </div>
                    <div>
                        <p className="text-lg font-bold text-slate-200">Badges: {user.badgesCount || 0}</p>
                        <p className="text-xs text-slate-400">Solved: {stats?.stats?.passedSubmissions || 0} Challenges</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={handleSendMessage}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/40 active:scale-[0.98]"
                    >
                        <MessageSquare size={20} fill="currentColor" />
                        Send Message
                    </button>
                    <button
                        onClick={() => {
                            onClose();
                            // navigate(`/profile?id=${userId}`);
                            navigate(`/profile?id=${userId}&view=info`);
                        }}
                        className="w-full py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all border border-slate-700/50 active:scale-[0.98]"
                    >
                        <User size={20} />
                        View Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfileCard;
