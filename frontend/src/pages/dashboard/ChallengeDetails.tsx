import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getChallengeByIdApi } from "../../api/challengeApi";
import type { Challenge } from "../../types/Challenge";



const difficultyColor: Record<string, string> = {
  easy: "text-green-400",
  medium: "text-yellow-400",
  hard: "text-red-400",
};

const ChallengeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getChallengeByIdApi(id)
      .then(setChallenge)
      .catch(() => navigate("/dashboard"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="p-6 text-slate-400">
        Loading challenge…
      </div>
    );
  }

  if (!challenge) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6 text-white">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          {challenge.title}
        </h1>

        <div className="flex gap-4 text-sm mt-2">
          <span className={difficultyColor[challenge.difficulty]}>
            {challenge.difficulty.toUpperCase()}
          </span>
          <span className="text-slate-400">
            XP: {challenge.xpReward}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-[#020617] p-6 rounded-xl">
        <p className="text-slate-300 whitespace-pre-line">
          {challenge.description}
        </p>
      </div>

      {/* Actions (future-ready) */}
      <div className="flex justify-end">
        <button
          disabled
          className="px-6 py-2 rounded bg-slate-700 text-slate-300 cursor-not-allowed"
        >
          Solve (coming soon)
        </button>
      </div>
    </div>
  );
};

export default ChallengeDetails;
