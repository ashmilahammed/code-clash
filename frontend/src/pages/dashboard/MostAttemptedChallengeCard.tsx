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
    <div className="bg-[#020617] rounded-xl p-6 relative overflow-hidden flex flex-col justify-between h-full border border-slate-800">
      
      {/* Background decoration (optional similar to the image) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div>
        {/* Header Tags */}
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
            Popular
          </span>
          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${difficultyColor[challenge.difficulty]}`}>
            {challenge.difficulty}
          </span>
        </div>

        {/* Title & Description */}
        <h2 className="text-2xl font-bold text-white mb-2 relative z-10">
          {challenge.title}
        </h2>
        <p className="text-slate-400 text-sm mb-6 max-w-xl relative z-10">
          {challenge.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-6 text-xs text-slate-400 mb-6 relative z-10">
          {challenge.timeLimitMinutes && (
            <span>{challenge.timeLimitMinutes} min</span>
          )}
          <span>{challenge.completionRate}% success rate</span>
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
          className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2"
        >
          {challenge.isPremium ? (
            <>
              <Lock size={14} />
              Unlock Premium
            </>
          ) : (
            <>
              Enter Domain &rarr;
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MostAttemptedChallengeCard;
