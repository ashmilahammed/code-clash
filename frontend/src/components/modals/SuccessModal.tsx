import { useNavigate } from "react-router-dom";

interface SuccessModalProps {
    onClose: () => void;
    xpEarned: number;
    challengeTitle?: string;
    difficulty?: string;
    timeTaken?: string;
    attempts?: number;
    nextChallengeId?: string;
}

const SuccessModal = ({
    onClose,
    xpEarned,
    challengeTitle = "Unknown Challenge",
    difficulty = "Medium",
    timeTaken = "0:00",
    attempts = 1,
    nextChallengeId
}: SuccessModalProps) => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl bg-[#0f172a] rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white z-10 hover:bg-slate-800 rounded-full p-1 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Left Panel - Summary */}
                <div className="md:w-5/12 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
                    {/* Background Decorations */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10"></div>
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-900/50 ring-4 ring-blue-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">Challenge Completed!</h2>
                        <p className="text-slate-300 text-lg mb-8 px-4">{challengeTitle}</p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 w-full mb-6">
                            <div className="bg-slate-900/40 backdrop-blur p-3 rounded-lg border border-white/5">
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Time</p>
                                <p className="text-xl font-bold text-white font-mono">{timeTaken}</p>
                            </div>
                            <div className="bg-slate-900/40 backdrop-blur p-3 rounded-lg border border-white/5">
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Attempts</p>
                                <p className="text-xl font-bold text-white">{attempts}</p>
                            </div>
                        </div>

                        <div className="w-full bg-slate-900/40 backdrop-blur p-3 rounded-lg border border-white/5">
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Difficulty</p>
                            <p className={`text-lg font-bold ${difficulty === 'Easy' ? 'text-green-400' :
                                    difficulty === 'Medium' ? 'text-yellow-400' :
                                        'text-red-400'
                                }`}>{difficulty}</p>
                        </div>

                        {/* Progress Bar (Mock) */}
                        <div className="w-full mt-8">
                            <div className="flex justify-between text-xs text-slate-400 mb-2">
                                <span>Lvl 4</span>
                                <span>68%</span>
                            </div>
                            <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full animate-pulse" style={{ width: '68%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Rewards & Actions */}
                <div className="md:w-7/12 p-8 bg-[#0f172a] flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Rewards Earned</h3>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {/* XP Reward */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-lg shadow-blue-900/20 transform hover:-translate-y-1 transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mb-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <p className="text-xs text-blue-100 uppercase font-semibold mb-1">XP Points</p>
                            <p className="text-3xl font-bold text-white">+{xpEarned}</p>
                        </div>

                        {/* Badge Reward (Mock) */}
                        <div className="bg-linear-to-br from-purple-600 to-purple-700 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-lg shadow-purple-900/20 transform hover:-translate-y-1 transition-all duration-300 delay-75">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mb-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.633-.241l-.262.524a1 1 0 01-1.787-.898l.262-.524a1 1 0 01-.633.241A3.989 3.989 0 018 14c-1.255 0-2.43.51-3.278 1.424a1 1 0 01-1.388-1.465A5.992 5.992 0 0110 12a5.992 5.992 0 011.05-.092L8.769 7.429l-1.233-.616a1 1 0 01.894-1.79l1.599.8L14 4.323V3a1 1 0 011-1h-5z" clipRule="evenodd" />
                            </svg>
                            <p className="text-xs text-purple-100 uppercase font-semibold mb-1">New Badge</p>
                            <p className="text-sm font-bold text-white leading-tight">Code Master</p>
                        </div>

                        {/* Special Reward (Mock) */}
                        <div className="bg-linear-to-br from-amber-600 to-amber-700 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-lg shadow-amber-900/20 transform hover:-translate-y-1 transition-all duration-300 delay-150">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mb-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-5v5z" clipRule="evenodd" />
                            </svg>
                            <p className="text-xs text-amber-100 uppercase font-semibold mb-1">Special</p>
                            <p className="text-sm font-bold text-white leading-tight">Avatar</p>
                        </div>
                    </div>

                    {/* Next Challenge Section */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 flex items-center justify-between mb-8 hover:bg-slate-800 transition-colors cursor-pointer group" onClick={() => nextChallengeId && navigate(`/challenges/${nextChallengeId}`)}>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-slate-700 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-medium text-lg">Next Challenge</p>
                                <p className="text-sm text-slate-400">Complete next challenge to earn more XP</p>
                            </div>
                        </div>
                        <div className="text-slate-500 group-hover:text-blue-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="mt-auto flex gap-3">
                        <button
                            onClick={() => navigate('/leaderboard')}
                            className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Leaderboard
                        </button>

                        <button
                            onClick={() => nextChallengeId ? navigate(`/challenges/${nextChallengeId}`) : onClose()}
                            className="flex-[1.5] px-4 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
                        >
                            Next Challenge
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SuccessModal;
