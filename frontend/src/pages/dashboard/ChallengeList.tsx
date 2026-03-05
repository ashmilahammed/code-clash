




import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChallengesApi } from "../../api/challengeApi";
import type { Challenge, ChallengeDifficulty } from "../../types/Challenge";
import { Lock } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";


const difficultyColor: Record<ChallengeDifficulty, string> = {
  easy: "text-green-400",
  medium: "text-yellow-400",
  hard: "text-red-400",
};

const ChallengeList = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  // Active Challenge Modal States
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingChallenge, setPendingChallenge] = useState<Challenge | null>(null);
  const [activeChallengeData, setActiveChallengeData] = useState<{ challengeId: string, expiryTime: number } | null>(null);


  useEffect(() => {
    let mounted = true;

    getChallengesApi()
      .then((res) => {
        if (mounted) {
          setChallenges(res);
        }
      })
      .catch((err) => {
        console.error("Failed to load challenges", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);


  if (loading) {
    return (
      <div className="bg-[#020617] rounded-xl p-6 text-slate-400">
        Loading challenges…
      </div>
    );
  }



  return (
    <>
      <div className="bg-[#020617] rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Available Challenges
        </h2>

        {challenges.length === 0 && (
          <p className="text-slate-400 text-sm">
            No challenges available yet.
          </p>
        )}

        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="p-4 rounded-lg bg-[#0F172A] border border-slate-800 hover:border-slate-700 transition"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-white">
                {challenge.title}
              </h3>

              <span
                className={`text-xs font-semibold uppercase ${difficultyColor[challenge.difficulty]
                  }`}
              >
                {challenge.difficulty}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-400 mb-3 line-clamp-2">
              {challenge.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>XP: {challenge.xpReward}</span>
              {challenge.timeLimitMinutes && (
                <span>Time: {challenge.timeLimitMinutes} min</span>
              )}

              <button
                onClick={() => {
                  if (challenge.isPremium && !user?.is_premium) {
                    navigate(`/premium`);
                    return;
                  }

                  // Check for global active challenge
                  // @ts-ignore
                  if (user?.id || user?._id) {
                    // @ts-ignore
                    const userId = user.id || user._id;
                    const globalActiveKey = `active_challenge_${userId}`;
                    const activeData = localStorage.getItem(globalActiveKey);
                    if (activeData) {
                      try {
                        const parsedData = JSON.parse(activeData);
                        // Make sure timer hasn't expired organically yet
                        if (parsedData.expiryTime > Date.now()) {
                          // If they click the exact same one they are already active in, just let them in
                          if (parsedData.challengeId === challenge.id) {
                            navigate(`/challenges/${challenge.id}`);
                            return;
                          }

                          // Otherwise block and warn them
                          setActiveChallengeData(parsedData);
                          setPendingChallenge(challenge);
                          setShowWarningModal(true);
                          return;
                        } else {
                          // Timer naturally expired but wasn't cleared yet, clear it
                          localStorage.removeItem(globalActiveKey);
                          localStorage.removeItem(`challenge_timer_${userId}_${parsedData.challengeId}`);
                        }
                      } catch (e) {
                        localStorage.removeItem(globalActiveKey);
                      }
                    }
                  }

                  navigate(`/challenges/${challenge.id}`);
                }}
                className="px-3 py-1 rounded bg-cyan-600 text-black hover:bg-cyan-500 transition flex items-center justify-center gap-1 font-medium"
              >
                {challenge.isPremium ? (
                  <>
                    <Lock size={12} />
                    Premium
                  </>
                ) : "Open"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Warning Modal */}
      {showWarningModal && pendingChallenge && activeChallengeData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0F172A] border border-slate-700 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-yellow-500">⚠️</span> Active Challenge
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                You already have an active challenge in progress. Finish or quit it before starting <strong className="text-white">{pendingChallenge.title}</strong>.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => {
                  navigate(`/challenges/${activeChallengeData.challengeId}`);
                }}
                className="w-full bg-cyan-600 text-black font-semibold py-2.5 rounded-lg hover:bg-cyan-500 transition shadow-lg shadow-cyan-900/20"
              >
                Resume Active Challenge
              </button>

              <button
                onClick={() => {
                  // Forcibly clear old trackers explicitly
                  // @ts-ignore
                  if (user?.id || user?._id) {
                    // @ts-ignore
                    const userId = user.id || user._id;
                    localStorage.removeItem(`active_challenge_${userId}`);
                    localStorage.removeItem(`challenge_timer_${userId}_${activeChallengeData.challengeId}`);
                  }
                  navigate(`/challenges/${pendingChallenge.id}`);
                }}
                className="w-full bg-red-500/10 text-red-500 font-semibold py-2.5 rounded-lg hover:bg-red-500/20 transition border border-red-500/20"
              >
                Quit Ongoing Challenge
              </button>

              <button
                onClick={() => setShowWarningModal(false)}
                className="w-full bg-slate-800 text-slate-300 font-semibold py-2.5 rounded-lg hover:bg-slate-700 transition mt-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChallengeList;



