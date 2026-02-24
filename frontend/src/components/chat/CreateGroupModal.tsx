import React, { useState, useEffect } from 'react';
import { X, Search, CheckCircle2, Shield, Lock, Globe, Users, Trophy } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { getSearchUsersApi } from '../../api/userApi';
import type { User } from '../../types/User';

interface CreateGroupModalProps {
    onClose: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose }) => {
    const { createGroup } = useChatStore();
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [memberLimit, setMemberLimit] = useState(50);
    const [isPrivate, setIsPrivate] = useState(false);

    // Step 2 state
    const [searchQuery, setSearchQuery] = useState('');
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    // Step 3 state
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (step === 2 && allUsers.length === 0) {
            fetchUsers();
        }
    }, [step]);

    const fetchUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const users = await getSearchUsersApi();
            setAllUsers(users);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const handleNext = async () => {
        if (step === 1) {
            if (!name.trim()) return;
            setStep(2);
        } else if (step === 2) {
            setIsSubmitting(true);
            try {
                await createGroup(
                    name.trim(),
                    description.trim() || undefined,
                    memberLimit,
                    isPrivate,
                    selectedUsers
                );
                setStep(3);
            } catch (error) {
                console.error(error);
                // Handle error
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const toggleUser = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const filteredUsers = allUsers.filter(u =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#141C2F] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-[#0F1626]">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        {step === 1 && <><Shield size={20} className="text-blue-500" /> Group Details</>}
                        {step === 2 && <><Users size={20} className="text-blue-500" /> Invite Members</>}
                        {step === 3 && <><Trophy size={20} className="text-yellow-500" /> Success!</>}
                    </h2>
                    {step !== 3 && (
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                    {/* Step 1: Details */}
                    {step === 1 && (
                        <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Group Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="E.g., Algorithms Study Group"
                                    className="w-full bg-[#0B1220] border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium placeholder:text-slate-600"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Description (Optional)</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What is this group about?"
                                    rows={3}
                                    className="w-full bg-[#0B1220] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none placeholder:text-slate-600"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Member Limit</label>
                                    <select
                                        value={memberLimit}
                                        onChange={(e) => setMemberLimit(Number(e.target.value))}
                                        className="w-full bg-[#0B1220] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 appearance-none"
                                    >
                                        <option value={10}>10 Members</option>
                                        <option value={50}>50 Members</option>
                                        <option value={100}>100 Members</option>
                                        <option value={500}>500 Members</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="block text-sm font-medium text-slate-300 mb-3">Privacy Setting</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsPrivate(false)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border ${!isPrivate ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-slate-700 bg-[#0B1220] text-slate-400 hover:border-slate-500'} transition-all`}
                                    >
                                        <Globe size={24} className="mb-2" />
                                        <span className="font-semibold text-sm">Public</span>
                                        <span className="text-xs text-center mt-1 opacity-80">Anyone can discover and join</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsPrivate(true)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border ${isPrivate ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-slate-700 bg-[#0B1220] text-slate-400 hover:border-slate-500'} transition-all`}
                                    >
                                        <Lock size={24} className="mb-2" />
                                        <span className="font-semibold text-sm">Private</span>
                                        <span className="text-xs text-center mt-1 opacity-80">Invite only</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Invite */}
                    {step === 2 && (
                        <div className="flex flex-col h-full min-h-[400px] animate-in slide-in-from-right-4 duration-300">
                            <div className="relative mb-4 shrink-0">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#0B1220] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                                {isLoadingUsers ? (
                                    <div className="flex justify-center p-4">
                                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => {
                                        const isSelected = selectedUsers.includes(user.id);
                                        return (
                                            <button
                                                key={user.id}
                                                onClick={() => toggleUser(user.id)}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-[#0B1220] hover:border-slate-500'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                                                        <span className="font-bold text-slate-300">{user.username.charAt(0).toUpperCase()}</span>
                                                    </div>
                                                    <div className="text-left leading-tight">
                                                        <p className="font-semibold text-slate-200">{user.username}</p>
                                                        {selectedUsers.includes(user.id) && <p className="text-xs text-blue-400 mt-0.5">Selected</p>}
                                                    </div>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-600 text-transparent'}`}>
                                                    <CheckCircle2 size={16} />
                                                </div>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <p className="text-center text-slate-500 py-8">No users found.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && (
                        <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 ring-4 ring-green-500/10">
                                <CheckCircle2 size={40} className="animate-in slide-in-from-bottom-2 fade-in" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Group Created!</h3>
                            <p className="text-slate-400 text-center mb-8 px-4">
                                "{name}" is ready. You can now start chatting with your community.
                            </p>
                            <button
                                onClick={onClose}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                            >
                                Enter Group Chat
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                {step !== 3 && (
                    <div className="p-4 border-t border-slate-800 bg-[#0F1626] flex items-center justify-between shrink-0">
                        {step === 1 ? (
                            <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                                Cancel
                            </button>
                        ) : (
                            <button onClick={() => setStep(1)} className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                                Back
                            </button>
                        )}

                        <button
                            onClick={handleNext}
                            disabled={step === 1 && !name.trim() || isSubmitting}
                            className={`flex items-center justify-center px-6 py-2.5 rounded-xl font-medium transition-all ${step === 1 && !name.trim() ? 'bg-blue-600/50 text-white/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 active:scale-[0.98]'}`}
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : step === 1 ? 'Next' : 'Create Group'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateGroupModal;
