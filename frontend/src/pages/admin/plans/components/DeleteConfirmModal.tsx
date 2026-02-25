import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    planName: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    planName,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-md shadow-2xl flex flex-col">
                <div className="flex justify-between items-center p-5 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-rose-500">
                        <AlertTriangle size={24} />
                        <h2 className="text-xl font-bold text-white">Confirm Deletion</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-slate-300">
                        Are you sure you want to delete the plan <span className="font-semibold text-white">"{planName}"</span>?
                        This action cannot be undone.
                    </p>
                </div>

                <div className="p-5 border-t border-slate-800 flex justify-end gap-3 bg-slate-800/20">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium bg-rose-600 text-white hover:bg-rose-500 transition-colors shadow-lg shadow-rose-600/20"
                    >
                        Delete Plan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
