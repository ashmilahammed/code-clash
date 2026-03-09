import { useState } from 'react';
import { Flag, X, Loader2 } from 'lucide-react';
import { reportMessage } from '../../api/reportApi';
import type { ReportData } from '../../api/reportApi';
import toast from 'react-hot-toast';

interface ReportModalProps {
    messageId: string;
    onClose: () => void;
}

const ReportModal = ({ messageId, onClose }: ReportModalProps) => {
    const [reason, setReason] = useState<ReportData['reason']>('Spam');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await reportMessage({ messageId, reason });
            toast.success("Message reported successfully");
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to report message");
        } finally {
            setIsSubmitting(false);
        }
    };

    const reasons: ReportData['reason'][] = ['Spam', 'Abuse', 'Harassment', 'Inappropriate', 'Other'];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#141C2F] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#1A2338]">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Flag size={18} className="text-yellow-500" />
                        Report Message
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <p className="text-slate-400 text-sm mb-4">Reason:</p>
                    <div className="space-y-3 mb-6">
                        {reasons.map((r) => (
                            <label key={r} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="radio"
                                        name="reason"
                                        value={r}
                                        checked={reason === r}
                                        onChange={() => setReason(r)}
                                        className="h-4 w-4 border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/20 checked:bg-blue-600 transition-all cursor-pointer appearance-none border-2 rounded-full"
                                    />
                                    {reason === r && (
                                        <div className="absolute w-2 h-2 bg-blue-500 rounded-full" />
                                    )}
                                </div>
                                <span className={`text-sm transition-colors ${reason === r ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                    {r}
                                </span>
                            </label>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Submitting
                                </>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;
