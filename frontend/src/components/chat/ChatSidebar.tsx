import React, { useState } from 'react';
import { Search, Plus, Hash, Lock, User as UserIcon } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';

const ChatSidebar = () => {
    const { conversations, activeConversation, setActiveConversation, createGroup } = useChatStore();
    const { user } = useAuthStore();
    const [search, setSearch] = useState('');
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');

    const groups = conversations.filter(c => c.type === 'group');
    const dms = conversations.filter(c => c.type === 'direct');

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGroupName.trim()) return;
        try {
            await createGroup(newGroupName);
            setNewGroupName('');
            setShowCreateGroup(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-64 bg-[#141C2F] flex flex-col border-r border-slate-800 shrink-0 h-full">
            {/* Search Bar */}
            <div className="p-4 border-b border-slate-800">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search channels..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#0B1220] border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Group Creation (if expanded) */}
            {showCreateGroup && (
                <form onSubmit={handleCreateGroup} className="p-4 border-b border-slate-800 bg-[#1A2338]">
                    <input
                        type="text"
                        placeholder="Group Name"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        className="w-full bg-[#0B1220] border border-slate-700 rounded-lg px-3 py-2 mb-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                    />
                    <div className="flex gap-2 text-sm">
                        <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 rounded py-1">Create</button>
                        <button type="button" onClick={() => setShowCreateGroup(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 rounded py-1">Cancel</button>
                    </div>
                </form>
            )}

            {/* Lists */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                {/* GROUPS */}
                <div className="mb-6">
                    <div className="flex items-center justify-between px-2 mb-2">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Groups</h3>
                        <button
                            onClick={() => setShowCreateGroup(!showCreateGroup)}
                            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                    <div className="space-y-1">
                        {groups.map((group) => (
                            <button
                                key={group.id}
                                onClick={() => setActiveConversation(group)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors ${activeConversation?.id === group.id
                                    ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                                    : 'text-slate-300 hover:bg-[#1A2338]'
                                    }`}
                            >
                                {group.adminId ? <Lock size={16} /> : <Hash size={16} />}
                                <div className="flex-1 truncate">
                                    <span className="font-medium">{group.name}</span>
                                    <p className="text-xs text-slate-500 truncate">{group.participants.length} members</p>
                                </div>
                            </button>
                        ))}
                        {groups.length === 0 && <p className="px-3 text-xs text-slate-500">No groups joined</p>}
                    </div>
                </div>

                {/* DIRECT MESSAGES */}
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">Direct Messages</h3>
                    <div className="space-y-1">
                        {dms.map((dm) => {
                            // Very simple fallback logic: we don't have user profiles populated here right now 
                            // except standard user IDs. Ideally, we need participant profiles to show names.
                            const otherUserId = dm.participants.find(p => p !== user?.id) || 'Unknown User';

                            return (
                                <button
                                    key={dm.id}
                                    onClick={() => setActiveConversation(dm)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors ${activeConversation?.id === dm.id
                                        ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                                        : 'text-slate-300 hover:bg-[#1A2338]'
                                        }`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex shrink-0 items-center justify-center">
                                        <UserIcon size={16} className="text-slate-400" />
                                    </div>
                                    <div className="flex-1 truncate">
                                        <span className="font-medium">User {otherUserId.slice(0, 4)}</span>
                                    </div>
                                </button>
                            );
                        })}
                        {dms.length === 0 && <p className="px-3 text-xs text-slate-500">No direct messages</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatSidebar;
