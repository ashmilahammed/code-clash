import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { Plan } from "../../../../api/planApi";

interface PlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (plan: Partial<Plan>) => void;
    planToEdit: Plan | null;
}

const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose, onSave, planToEdit }) => {
    const [formData, setFormData] = useState<Partial<Plan>>({
        name: "",
        description: "",
        price: 0,
        duration: 30,
        features: [""],
        status: "Active",
    });

    useEffect(() => {
        if (planToEdit) {
            setFormData(planToEdit);
        } else {
            setFormData({
                name: "",
                description: "",
                price: 0,
                duration: 30,
                features: [""],
                status: "Active",
            });
        }
    }, [planToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "price" || name === "duration" ? Number(value) : value
        }));
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...(formData.features || [])];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        setFormData(prev => ({ ...prev, features: [...(prev.features || []), ""] }));
    };

    const removeFeature = (index: number) => {
        const newFeatures = [...(formData.features || [])];
        newFeatures.splice(index, 1);
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Filter out empty features
        const cleanedData = {
            ...formData,
            features: formData.features?.filter(f => f.trim() !== "") || []
        };
        onSave(cleanedData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">

                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">
                        {planToEdit ? "Edit Plan" : "Add New Plan"}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form id="plan-form" onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Plan Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name || ""}
                                onChange={handleChange}
                                className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                placeholder="e.g. Premium"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                            <textarea
                                name="description"
                                required
                                rows={2}
                                value={formData.description || ""}
                                onChange={handleChange}
                                className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                                placeholder="e.g. Access to all open domains"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    min="0"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Duration (Days)</label>
                                <input
                                    type="number"
                                    name="duration"
                                    required
                                    min="1"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-slate-300">Features</label>
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1"
                                >
                                    <Plus size={14} /> Add Feature
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formData.features?.map((feature, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            required
                                            value={feature}
                                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                                            className="flex-1 bg-[#1e293b] border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-hidden focus:border-indigo-500"
                                            placeholder={`Feature ${index + 1}`}
                                        />
                                        {formData.features!.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeFeature(index)}
                                                className="p-2 text-slate-500 hover:text-rose-400 transition-colors bg-slate-800 rounded-lg border border-slate-700"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </form>
                </div>

                <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-800/20">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="plan-form"
                        className="px-5 py-2.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        {planToEdit ? "Update Plan" : "Create Plan"}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PlanModal;
