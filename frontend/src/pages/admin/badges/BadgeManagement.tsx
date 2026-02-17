import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { getAllBadges, createBadge, updateBadge, deleteBadge } from "../../../api/badgeApi";
import BadgeModal from "../../../components/modals/BadgeModal";
import ConfirmModal from "../../../components/modals/ConfirmModal";
import type { Badge } from "../../../types/Level";



const BadgeManagement = () => {

    const [badges, setBadges] = useState<Badge[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentBadge, setCurrentBadge] = useState<Badge | null>(null);
    const [badgeToDelete, setBadgeToDelete] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchData = async () => {
        try {
            const response = await getAllBadges();
            setBadges(response.data || []);
        } catch (error) {
            console.error("Failed to fetch badges:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async (data: any) => {
        if (currentBadge) {
            await updateBadge(currentBadge.id || currentBadge._id!, data);
        } else {
            await createBadge(data);
        }
        fetchData();
        setIsModalOpen(false);
        setCurrentBadge(null);
    };

    const handleEdit = (badge: Badge) => {
        setCurrentBadge(badge);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setBadgeToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (badgeToDelete) {
            try {
                await deleteBadge(badgeToDelete);
                fetchData();
            } catch (error) {
                console.error("Failed to delete badge", error);
            }
            setIsDeleteModalOpen(false);
            setBadgeToDelete(null);
        }
    };

    const filteredBadges = badges.filter(badge =>
        badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        badge.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search badges..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 transition"
                    />
                </div>
                <button
                    onClick={() => {
                        setCurrentBadge(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition ml-4"
                >
                    <Plus size={18} />
                    Create Badge
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBadges.map((badge) => (
                    <div key={badge.id || badge._id} className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-lg relative group hover:border-slate-700 transition">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(badge)}
                                className="text-slate-400 hover:text-blue-400 p-1"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => handleDeleteClick(badge.id || badge._id!)}
                                className="text-slate-400 hover:text-red-400 p-1"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-white shrink-0 flex items-center justify-center overflow-hidden">
                                {/* Placeholder for icon, assuming URL or generic icon */}
                                {badge.icon.startsWith("http") ? (
                                    <img src={badge.icon} alt={badge.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-slate-900 font-bold text-xs">{badge.icon.substring(0, 2).toUpperCase()}</span>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">{badge.name}</h3>
                                <p className="text-slate-400 text-sm mb-3 line-clamp-2">{badge.description}</p>

                                <div className="flex gap-2 flex-wrap">
                                    <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">
                                        {badge.category}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${badge.isActive ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                                        {badge.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredBadges.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        No badges found matching your search.
                    </div>
                )}
            </div>

            <BadgeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={currentBadge}
            />

            <ConfirmModal
                open={isDeleteModalOpen}
                title="Delete Badge"
                message="Are you sure you want to delete this badge? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
};

export default BadgeManagement;
