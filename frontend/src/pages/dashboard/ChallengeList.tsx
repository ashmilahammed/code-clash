import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getChallengesApi } from "../../api/challengeApi";
import type { Challenge, ChallengeDifficulty } from "../../types/Challenge";
import { Lock } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useSearchStore } from "../../store/useSearchStore";


const difficultyColor: Record<ChallengeDifficulty, string> = {
  easy: "bg-green-500/10 text-green-400 border border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  hard: "bg-red-500/10 text-red-400 border border-red-500/20",
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

  const { searchQuery } = useSearchStore();

  const [selectedDomain, setSelectedDomain] = useState<string>("All");

  const domains = useMemo(() => {
    const uniqueDomains = Array.from(new Set(challenges.map((c) => c.domain)));
    return ["All", ...uniqueDomains];
  }, [challenges]);

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDomain =
      selectedDomain === "All" || challenge.domain === selectedDomain;

    return matchesSearch && matchesDomain;
  });

  const formatDomain = (d: string) => {
    if (d === "All") return "All";
    if (d === "javascript") return "JavaScript";
    if (d === "sql") return "SQL";
    if (d === "dp") return "DP";
    return d.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };


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
      {/* Domain Filters */}
      <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 custom-scrollbar">
        {domains.map((domain) => (
          <button
            key={domain}
            onClick={() => setSelectedDomain(domain)}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${selectedDomain === domain
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
              : "bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700/50"
              }`}
          >
            {formatDomain(domain)}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Available Challenges
          <span className="text-xs font-semibold bg-slate-800 text-slate-400 px-2 py-1 rounded-full">
            {filteredChallenges.length}
          </span>
        </h2>
      </div>

      {filteredChallenges.length === 0 && (
        <p className="text-slate-400 text-sm bg-[#020617] p-6 rounded-xl">
          {searchQuery ? "No challenges match your search or filter." : "No challenges available yet."}
        </p>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge) => (
          <div
            key={challenge.id}
            className="p-6 rounded-2xl bg-[#0f172a]/80 backdrop-blur-sm border border-slate-700/50 hover:border-indigo-500/50 hover:bg-[#1e293b]/80 transition-all duration-300 flex flex-col justify-between group shadow-lg"
          >
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors line-clamp-1 pr-2">
                  {challenge.title}
                </h3>

                <div className="flex items-center gap-2">
                  {challenge.isPremium && (
                    <span className="text-[10px] font-bold uppercase px-2 py-1 rounded shrink-0 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                      <Lock size={10} />
                      Premium
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-1 rounded shrink-0 ${difficultyColor[challenge.difficulty]}`}
                  >
                    {challenge.difficulty}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-400 mb-6 line-clamp-2 min-h-10">
                {challenge.description}
              </p>
            </div>

            {/* Footer Attributes */}
            <div className="flex flex-col gap-5 mt-auto">
              <div className="flex items-center justify-between text-xs font-medium text-slate-300 bg-black/20 px-3 py-2 rounded-lg border border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="text-indigo-400">✨</span>
                  <span>{challenge.xpReward} XP</span>
                </div>
                {challenge.timeLimitMinutes && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">⏱️</span>
                    <span>{challenge.timeLimitMinutes} min</span>
                  </div>
                )}
              </div>

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
                className={`w-full py-3 rounded-lg text-white transition-all flex items-center justify-center gap-2 font-bold text-sm ${challenge.isPremium && !user?.is_premium
                  ? "bg-linear-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 shadow-lg shadow-amber-500/20"
                  : "bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500"
                  }`}
              >
                {challenge.isPremium && !user?.is_premium ? (
                  <>
                    <Lock size={16} />
                    Unlock Premium
                  </>
                ) : (
                  <>
                    <span className="group-hover:translate-x-1 transition-transform">
                      Attempt Challenge &rarr;
                    </span>
                  </>
                )}
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



