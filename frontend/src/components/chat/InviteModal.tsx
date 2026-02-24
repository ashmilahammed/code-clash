import React, { useState, useEffect } from 'react';
import { X, Search, CheckCircle2, UserPlus, Trophy } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { getSearchUsersApi } from '../../api/userApi';
import type { User } from '../../types/User';

interface InviteModalProps {
    onClose: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ onClose }) => {
    const { activeConversation, inviteToGroup } = useChatStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Fetch users when modal opens
    useEffect(() => {
        fetchUsers();
    }, []);

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

    const handleInvite = async () => {
        if (!activeConversation || selectedUsers.length === 0) return;

        setIsSubmitting(true);
        try {
            await inviteToGroup(activeConversation.id, selectedUsers);
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Failed to invite users', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleUser = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    // Filter out users who are already in the group
    const currentParticipantSet = new Set(activeConversation?.participants || []);
    const availableUsers = allUsers.filter(u => !currentParticipantSet.has(u.id));

    const filteredUsers = availableUsers.filter(u =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#141C2F] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-[#0F1626]">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        {success ? <><Trophy size={20} className="text-yellow-500" /> Success!</> : <><UserPlus size={20} className="text-blue-500" /> Invite Members</>}
                    </h2>
                    {!success && (
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 ring-4 ring-green-500/10">
                                <CheckCircle2 size={40} className="animate-in slide-in-from-bottom-2 fade-in" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Members Invited!</h3>
                            <p className="text-slate-400 text-center mb-8 px-4">
                                The selected users have been successfully added to the group.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full min-h-[400px]">
                            <div className="relative mb-4 shrink-0">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search users to invite..."
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
                                    <p className="text-center text-slate-500 py-8">
                                        {availableUsers.length === 0 ? "No new users available to invite." : "No users found based on search."}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                {!success && (
                    <div className="p-4 border-t border-slate-800 bg-[#0F1626] flex items-center justify-between shrink-0">
                        <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleInvite}
                            disabled={selectedUsers.length === 0 || isSubmitting}
                            className={`flex items-center justify-center px-6 py-2.5 rounded-xl font-medium transition-all ${selectedUsers.length === 0 ? 'bg-blue-600/50 text-white/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 active:scale-[0.98]'}`}
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : `Invite ${selectedUsers.length > 0 ? `(${selectedUsers.length})` : ''}`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InviteModal;
