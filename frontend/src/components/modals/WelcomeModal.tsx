import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use"; 
import { Trophy, X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { claimWelcomeXpApi } from "../../api/userApi";

export const WelcomeModal = ({ onClaim }: { onClaim?: () => void }) => {
    const { user, updateUser } = useAuthStore();
    const [show, setShow] = useState(false);
    const { width, height } = useWindowSize();

    useEffect(() => {
        const checkFirstLogin = async () => {
            if (user && !localStorage.getItem(`welcome_shown_${user.id}`)) {
                if (user.xp === 0 || user.is_first_login) { 
                    setShow(true);
                    
                    try {
                        const res = await claimWelcomeXpApi();
                       
                        if (res.success) {
                            updateUser({ xp: user.xp + 50 });
                            if (onClaim) onClaim();
                        }
                    } catch (error) {
                        console.error("Failed to claim welcome XP", error);
                    }
                }
            }
        };
        
        checkFirstLogin();

    }, [user, updateUser]);

    const handleClose = async () => {
        setShow(false);
        if (user) {
            localStorage.setItem(`welcome_shown_${user.id}`, "true");
            updateUser({ is_first_login: false }); 
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <Confetti 
                width={width} 
                height={height} 
                recycle={false} 
                numberOfPieces={500}
                gravity={0.15}
            />
            
            <div className="bg-[#1A2235] border border-slate-700 w-full max-w-md rounded-2xl p-8 relative shadow-2xl animate-in zoom-in duration-300">
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
                
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 mb-6 bg-amber-500/20 rounded-full flex items-center justify-center relative">
                       <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping opacity-75"></div>
                       <Trophy size={40} className="text-amber-400 relative z-10" />
                       <div className="absolute -top-1 -right-1 text-amber-200 text-lg">✨</div>
                       <div className="absolute top-2 -left-2 text-amber-300 text-sm">✨</div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                        Welcome to CodeClash!
                    </h2>
                    
                    <p className="text-slate-300 text-base mb-6 leading-relaxed">
                        You've earned <span className="font-bold text-white">50 XP</span> as a welcome bonus.<br/>
                        Start solving challenges and climb the leaderboard.
                    </p>

                    <div className="text-4xl font-extrabold text-[#4ADE80] mb-8 drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]">
                        +50 XP
                    </div>

                    <button 
                        onClick={handleClose}
                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)]"
                    >
                        Start Coding
                    </button>
                </div>
            </div>
        </div>
    );
};
