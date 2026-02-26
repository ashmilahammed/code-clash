import { useState, useEffect } from "react";
import { Users, User, Search, Trash2 } from "lucide-react";
import {
    getAdminGroupsApi,
    updateAdminGroupStatusApi,
    deleteAdminGroupApi
} from "../../api/adminApi";
import type { AdminGroup } from "../../api/adminApi";
import toast from "react-hot-toast";

const GroupManagement = () => {
    const [groups, setGroups] = useState<AdminGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalGroups, setTotalGroups] = useState(0);

    const LIMIT = 10;

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const res = await getAdminGroupsApi({ page: currentPage, limit: LIMIT, search: searchQuery });
            setGroups(res.data);
            setTotalPages(res.totalPages);
            setTotalGroups(res.total);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to load groups");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, [currentPage, searchQuery]);

    const handleToggleStatus = async (groupId: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            await updateAdminGroupStatusApi(groupId, newStatus);
            toast.success(`Group ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
            fetchGroups();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    const handleDelete = (groupId: string) => {
        setGroupToDelete(groupId);
    };

    const confirmDeleteGroup = async () => {
        if (!groupToDelete) return;

        try {
            await deleteAdminGroupApi(groupToDelete);
            toast.success("Group deleted successfully");
            fetchGroups();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete group");
        } finally {
            setGroupToDelete(null);
        }
    };

    // Calculate totals for summary cards from current view (approximate unless we make dedicated summarize API)
    // If backend provided these specifically, we'd use those. Working with fetched list for now.
    const activeGroupsCount = groups.filter(g => g.status === 'active').length;
    const totalMembersInPage = groups.reduce((acc, g) => acc + g.memberCount, 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#141C2F] rounded-2xl p-6 border border-slate-800 flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">Total Groups</p>
                        <h3 className="text-3xl font-bold text-white">{totalGroups}</h3>
                    </div>
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                        <Users size={24} />
                    </div>
                </div>

                <div className="bg-[#141C2F] rounded-2xl p-6 border border-slate-800 flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">Active Groups (Page)</p>
                        <h3 className="text-3xl font-bold text-emerald-400">{activeGroupsCount}</h3>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                        <Users size={24} />
                    </div>
                </div>

                <div className="bg-[#141C2F] rounded-2xl p-6 border border-slate-800 flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">Members (Page)</p>
                        <h3 className="text-3xl font-bold text-white">{totalMembersInPage}</h3>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                        <User size={24} />
                    </div>
                </div>
            </div>

            {/* List Table Container */}
            <div className="bg-[#141C2F] rounded-2xl border border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search groups by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0B1120] border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500 font-semibold bg-slate-900/50">
                                <th className="px-6 py-4">Group Name</th>
                                <th className="px-6 py-4 text-center">Members</th>
                                <th className="px-6 py-4 text-center">Join Policy</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                        Loading groups...
                                    </td>
                                </tr>
                            ) : groups.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                        No groups found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                groups.map((group) => (
                                    <tr key={group.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-700 font-mono flex items-center justify-center text-slate-300 font-bold border border-slate-600 uppercase">
                                                    {group.name.slice(0, 1)}
                                                </div>
                                                <span className="font-medium text-white">{group.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-slate-300 font-medium">
                                            {group.memberCount}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${group.isPrivate
                                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                }`}>
                                                {group.isPrivate ? 'Private' : 'Public'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${group.status === 'active'
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                }`}>
                                                {group.status === 'active' ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleToggleStatus(group.id, group.status)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${group.status === 'active'
                                                    ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                                                    : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                                    }`}
                                            >
                                                {group.status === 'active' ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(group.id)}
                                                className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-xs font-semibold transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-slate-800 flex items-center justify-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-50 hover:bg-slate-700 transition"
                        >
                            Previous
                        </button>
                        <span className="text-slate-400 text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-50 hover:bg-slate-700 transition"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Group Modal */}
            {groupToDelete && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#141C2F] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete Group?</h3>
                            <p className="text-slate-400 text-sm mb-6 pb-2">
                                Are you sure you want to completely delete this group? All user messages within it will be permanently lost. This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setGroupToDelete(null)}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeleteGroup}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-lg shadow-red-900/20"
                                >
                                    Delete Group
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupManagement;
