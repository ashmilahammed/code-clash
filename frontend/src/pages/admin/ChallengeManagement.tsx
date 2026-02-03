import { useEffect, useState } from "react";
import { getChallengesApi } from "../../api/challengeApi";
import { createChallengeApi } from "../../api/adminApi";
import type { Challenge, ChallengeDifficulty } from "../../types/Challenge";

const ChallengeManagement = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);

  // create form state
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] =
    useState<ChallengeDifficulty>("easy");
  const [xpReward, setXpReward] = useState(50);

  // fetch challenges
  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const data = await getChallengesApi();
      setChallenges(data);
    } catch (err) {
      console.error("Failed to fetch challenges", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  // create challenge
  const handleCreate = async () => {
    try {
      await createChallengeApi({
        title,
        description,
        difficulty,
        xpReward,
      });

      // reset form
      setTitle("");
      setDescription("");
      setDifficulty("easy");
      setXpReward(50);
      setShowCreate(false);

      // reload list
      fetchChallenges();
    } catch (err) {
      console.error("Failed to create challenge", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">
          Challenge Management
        </h1>

        <button
          onClick={() => setShowCreate((v) => !v)}
          className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-700 transition"
        >
          + Create Challenge
        </button>
      </div>

      {/* Create Challenge */}
      {showCreate && (
        <div className="bg-slate-900 rounded-xl p-6 space-y-4">
          <input
            className="w-full p-3 rounded bg-[#020617] text-white border border-slate-700"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full p-3 rounded bg-[#020617] text-white border border-slate-700"
            placeholder="Description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex gap-4">
            <select
              className="flex-1 p-3 rounded bg-[#020617] text-white border border-slate-700"
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as ChallengeDifficulty)
              }
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <input
              type="number"
              className="w-32 p-3 rounded bg-[#020617] text-white border border-slate-700"
              value={xpReward}
              onChange={(e) => setXpReward(Number(e.target.value))}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              className="px-5 py-2 rounded bg-green-600 hover:bg-green-700"
            >
              Create
            </button>

            <button
              onClick={() => setShowCreate(false)}
              className="px-5 py-2 rounded bg-slate-700 hover:bg-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Challenge List */}
      <div className="bg-slate-900 rounded-xl p-6">
        {loading ? (
          <p className="text-slate-400">Loading challenges…</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-700">
                <th className="pb-3">Title</th>
                <th className="pb-3">Difficulty</th>
                <th className="pb-3">XP</th>
              </tr>
            </thead>

            <tbody>
              {challenges.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-slate-800"
                >
                  <td className="py-3 text-white">
                    <div className="font-medium">{c.title}</div>
                    <div className="text-xs text-slate-400 truncate">
                      {c.description}
                    </div>
                  </td>

                  <td className="py-3 text-slate-300 capitalize">
                    {c.difficulty}
                  </td>

                  <td className="py-3 text-slate-300">
                    {c.xpReward} XP
                  </td>
                </tr>
              ))}

              {challenges.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-6 text-center text-slate-400"
                  >
                    No challenges found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ChallengeManagement;
