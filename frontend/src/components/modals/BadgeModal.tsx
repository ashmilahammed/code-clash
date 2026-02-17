import { useState, useEffect } from "react";
import type { Badge } from "../../types/Level";

interface BadgeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    initialData?: Badge | null;
}

const BadgeModal = ({ isOpen, onClose, onSave, initialData }: BadgeModalProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("");
    const [minXpRequired, setMinXpRequired] = useState<number | "">("");
    const [category, setCategory] = useState("Achievement");
    const [requirementType, setRequirementType] = useState("Manual");
    const [requirementValue, setRequirementValue] = useState<number | "">("");
    const [isActive, setIsActive] = useState(true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description);
            setIcon(initialData.icon);
            setMinXpRequired(initialData.minXpRequired);
            setCategory(initialData.category || "Achievement");
            setRequirementType(initialData.requirementType || "Manual");
            setRequirementValue(initialData.requirementValue || 0);
            setIsActive(initialData.isActive !== undefined ? initialData.isActive : true);
        } else {
            setName("");
            setDescription("");
            setIcon("");
            setMinXpRequired("");
            setCategory("Achievement");
            setRequirementType("Manual");
            setRequirementValue("");
            setIsActive(true);
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
                name,
                description,
                icon,
                minXpRequired: Number(minXpRequired),
                category,
                requirementType,
                requirementValue: Number(requirementValue),
                isActive
            });
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to save badge");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-xl w-full max-w-2xl p-6 shadow-2xl border border-slate-800">
                <h2 className="text-xl font-bold text-white mb-6">
                    {initialData ? "Edit Badge" : "Create New Badge"}
                </h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white outline-none focus:border-blue-500 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white outline-none focus:border-blue-500 transition h-24 resize-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white outline-none focus:border-blue-500 transition"
                            >
                                <option value="Achievement">Achievement</option>
                                <option value="Challenge">Challenge</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Requirement Type</label>
                            <select
                                value={requirementType}
                                onChange={(e) => setRequirementType(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white outline-none focus:border-blue-500 transition"
                            >
                                <option value="Manual">Manual</option>
                                <option value="Level Reached">Level Reached</option>
                                <option value="Challenge Completion">Challenge Completion</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Min XP Required</label>
                            <input
                                type="number"
                                value={minXpRequired}
                                onChange={(e) => setMinXpRequired(Number(e.target.value))}
                                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white outline-none focus:border-blue-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Requirement Value</label>
                            <input
                                type="number"
                                value={requirementValue}
                                onChange={(e) => setRequirementValue(Number(e.target.value))}
                                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white outline-none focus:border-blue-500 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Icon (URL or Name)</label>
                        <input
                            type="text"
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white outline-none focus:border-blue-500 transition"
                            placeholder="e.g. trophy, star, https://..."
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="isActive" className="text-slate-300 text-sm select-none">Active</label>
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
                            {loading ? "Saving..." : initialData ? "Update Badge" : "Create Badge"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BadgeModal;
