import { useState, useEffect } from "react";
import type { Badge, Level } from "../../types/Level";

interface LevelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    initialData?: Level | null;
    badges: Badge[];
}

const LevelModal = ({ isOpen, onClose, onSave, initialData, badges }: LevelModalProps) => {
    const [levelNumber, setLevelNumber] = useState<number | "">("");
    const [minXp, setMinXp] = useState<number | "">("");
    const [maxXp, setMaxXp] = useState<number | "">("");
    const [badgeId, setBadgeId] = useState<string>("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setLevelNumber(initialData.levelNumber);
            setMinXp(initialData.minXp);
            setMaxXp(initialData.maxXp);
            setBadgeId(initialData.badgeId || "");
            setTitle(initialData.title || "");
        } else {
            // Reset form
            setLevelNumber("");
            setMinXp("");
            setMaxXp("");
            setBadgeId("");
            setTitle("");
        }
        setError(null);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await onSave({
                levelNumber: Number(levelNumber),
                minXp: Number(minXp),
                maxXp: Number(maxXp),
                badgeId: badgeId || undefined,
                title,
            });
            onClose();
        } catch (err: any) {
            // extract error message safely
            setError(err.response?.data?.message || err.message || "Failed to save level");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-xl w-full max-w-2xl p-6 shadow-2xl border border-slate-800">
                <h2 className="text-xl font-bold text-white mb-6">
                    {initialData ? "Edit Level" : "Add New Level"}
                </h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Level</label>
                            <input
                                type="number"
                                value={levelNumber}
                                onChange={(e) => setLevelNumber(Number(e.target.value))}
                                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white outline-none focus:border-blue-500 transition"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Min XP</label>
                            <input
                                type="number"
                                value={minXp}
                                onChange={(e) => setMinXp(Number(e.target.value))}
                                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white outline-none focus:border-blue-500 transition"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Max XP</label>
                            <input
                                type="number"
                                value={maxXp}
                                onChange={(e) => setMaxXp(Number(e.target.value))}
                                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white outline-none focus:border-blue-500 transition"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Title (Optional)</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white outline-none focus:border-blue-500 transition"
                            placeholder="e.g. Master"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Badge</label>
                        <select
                            value={badgeId}
                            onChange={(e) => setBadgeId(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white outline-none focus:border-blue-500 transition"
                        >
                            <option value="">Select a Badge</option>
                            {badges.map((badge) => (
                                <option key={badge.id || badge._id} value={badge.id || badge._id}>
                                    {badge.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : initialData ? "Update Level" : "Add Level"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LevelModal;
