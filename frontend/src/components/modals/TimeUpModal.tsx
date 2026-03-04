import { useNavigate } from "react-router-dom";

interface TimeUpModalProps {
    onRetry: () => void;
}

const TimeUpModal = ({ onRetry }: TimeUpModalProps) => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-[#0f172a] rounded-xl overflow-hidden shadow-2xl border border-red-500/30 flex flex-col animate-in fade-in zoom-in duration-300">
                <div className="p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
                    {/* Background Decorations */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10"></div>
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-500 rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>

                    <div className="relative z-10 flex flex-col items-center w-full">
                        <div className="w-20 h-20 bg-red-600/20 border border-red-500/50 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-red-900/50">
                            <span className="text-4xl text-red-500 animate-pulse">⏱️</span>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">Time's Up!</h2>
                        <p className="text-slate-300 text-sm mb-8 px-4">
                            Your challenge time has expired.
                        </p>

                        <div className="flex flex-col gap-3 w-full">
                            <button
                                onClick={onRetry}
                                className="w-full px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold text-black transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20"
                            >
                                Retry
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>

                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2"
                            >
                                Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeUpModal;
