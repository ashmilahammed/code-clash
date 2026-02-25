import React from "react";
import { Edit, Trash2 } from "lucide-react";
import type { Plan } from "../../../../api/planApi";

interface PlanTableProps {
    plans: Plan[];
    onEdit: (plan: Plan) => void;
    onDelete: (planId: string) => void;
}

const PlanTable: React.FC<PlanTableProps> = ({ plans, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-slate-700/50 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-800/20">
                        <th className="p-4">Plan</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Duration</th>
                        <th className="p-4">Features</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                    {plans.map((plan) => (
                        <tr key={plan.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-4">
                                <div className="font-semibold text-white">{plan.name}</div>
                                <div className="text-xs text-slate-400 mt-1 max-w-[200px] truncate">{plan.description}</div>
                            </td>
                            <td className="p-4 text-emerald-400 font-medium">
                                ₹{plan.price}
                            </td>
                            <td className="p-4 text-slate-300">
                                {plan.duration} days
                            </td>
                            <td className="p-4">
                                <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
                                    {plan.features.slice(0, 3).map((feature, i) => (
                                        <li key={i} className="truncate max-w-[250px]">{feature}</li>
                                    ))}
                                    {plan.features.length > 3 && (
                                        <li className="text-slate-500 italic">+{plan.features.length - 3} more</li>
                                    )}
                                </ul>
                            </td>
                            <td className="p-4">
                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${plan.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                    {plan.status}
                                </span>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => onEdit(plan)}
                                        className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(plan.id)}
                                        className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {plans.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-500">
                                No plans found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PlanTable;
