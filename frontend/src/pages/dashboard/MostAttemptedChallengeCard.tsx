import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

interface MostAttemptedChallengeProps {
  challenge: {
    id: string;
    title: string;
    description: string;
    difficulty: "easy" | "medium" | "hard";
    attempts: number;
    completionRate: number;
    timeLimitMinutes?: number;
    isPremium?: boolean;
  };
  userPremium: boolean;
}

const difficultyColor: Record<"easy" | "medium" | "hard", string> = {
  easy: "bg-green-500/20 text-green-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  hard: "bg-red-500/20 text-red-400",
};

const MostAttemptedChallengeCard = ({ challenge, userPremium }: MostAttemptedChallengeProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-linear-to-br from-[#020617] to-[#0a0f1d] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-full border border-slate-700/50 shadow-xl group">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700"></div>

      <div>
        {/* Header Tags */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex gap-2">
            <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2.5 py-1 rounded border border-indigo-500/30 uppercase tracking-widest">
              Popular
            </span>
            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-current/20 ${difficultyColor[challenge.difficulty]}`}>
              {challenge.difficulty}
            </span>
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-white transition-colors">
            🔥
          </div>
        </div>

        {/* Title & Description */}
        <h2 className="text-2xl font-extrabold text-white mb-2 relative z-10 group-hover:text-indigo-300 transition-colors">
          {challenge.title}
        </h2>
        <p className="text-slate-400 text-sm mb-6 max-w-xl relative z-10 line-clamp-2">
          {challenge.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-300 mb-8 relative z-10 bg-black/20 p-3 rounded-lg border border-white/5 w-fit">
          {challenge.timeLimitMinutes && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">⏱️</span>
              <span>{challenge.timeLimitMinutes} min</span>
            </div>
          )}
          {challenge.timeLimitMinutes && <div className="w-1 h-1 rounded-full bg-slate-600"></div>}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">📈</span>
            <span>{challenge.completionRate}% completion rate</span>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-end relative z-10">
        <button
          onClick={() => {
            if (challenge.isPremium && !userPremium) {
              navigate("/premium");
              return;
            }
            navigate(`/challenges/${challenge.id}`);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 group-hover:gap-3"
        >
          {challenge.isPremium ? (
            <>
              <Lock size={16} />
              Unlock Premium
            </>
          ) : (
            <>
              Attempt Challenge <span className="text-indigo-200 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MostAttemptedChallengeCard;
