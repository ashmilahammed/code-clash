import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  createChallengeBasicApi,
  getAdminChallengeByIdApi,
  updateChallengeBasicApi
} from "../../../../api/challengeApi";

type Difficulty = "easy" | "medium" | "hard";

type Domain =
  | "arrays"
  | "strings"
  | "linked-list"
  | "stack"
  | "queue"
  | "tree"
  | "graph"
  | "dp"
  | "math"
  | "sql";




const BasicInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID if editing

  const [form, setForm] = useState<{
    title: string;
    description: string;
    difficulty: Difficulty;
    domain: Domain;
    xpReward: number;
    timeLimitMinutes?: number;
    isPremium: boolean;
  }>({
    title: "",
    description: "",
    difficulty: "easy",
    domain: "arrays",
    xpReward: 50,
    timeLimitMinutes: 30,
    isPremium: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data if editing
  useEffect(() => {
    if (id) {
      const fetchChallenge = async () => {
        try {
          setLoading(true);
          const data = await getAdminChallengeByIdApi(id);
          setForm({
            title: data.title,
            description: data.description,
            difficulty: data.difficulty,
            domain: data.domain,
            xpReward: data.xpReward,
            timeLimitMinutes: data.timeLimitMinutes,
            isPremium: data.isPremium,
          });
        } catch (err) {
          console.error("Failed to fetch challenge", err);
          setError("Failed to load challenge details");
        } finally {
          setLoading(false);
        }
      };
      fetchChallenge();
    }
  }, [id]);


  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError("Challenge title is required");
      return;
    }

    if (!form.description.trim()) {
      setError("Description is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let challengeId = id;

      if (id) {
        // Update existing
        await updateChallengeBasicApi(id, form);
      } else {
        // Create new
        const res = await createChallengeBasicApi(form);
        challengeId = res.id;
      }

      const basePath = id ? "/admin/challenges/edit" : "/admin/challenges/create";
      navigate(`${basePath}/${challengeId}/tags`);

    } catch (err: any) {
      console.error("SAVE CHALLENGE ERROR", err);

      setError(
        err?.response?.data?.message ||
        "Failed to save challenge"
      );
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-white">
          {id ? "Edit Challenge" : "Create Challenge"}
        </h1>
        <p className="text-sm text-slate-400">
          Step 1 of 5 • Basic Information
        </p>
      </div>


      {/* Card */}
      <div className="bg-[#020617] border border-slate-800 rounded-xl p-6 space-y-6 shadow-lg">

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm text-slate-300 font-medium">
            Challenge Title
          </label>

          <input
            className="w-full px-4 py-3 rounded-lg bg-[#020617] border border-slate-700 text-white
          focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
            placeholder="Example: Two Sum"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />
        </div>


        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm text-slate-300 font-medium">
            Description
          </label>

          <textarea
            className="w-full px-4 py-3 rounded-lg bg-[#020617] border border-slate-700 text-white
          min-h-[140px] focus:ring-2 focus:ring-cyan-500 outline-none"
            placeholder="Describe the challenge problem clearly..."
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>


        {/* Grid Section */}
        <div className="grid grid-cols-2 gap-6">

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300 font-medium">
              Difficulty
            </label>

            <select
              className="w-full px-4 py-3 rounded-lg bg-[#020617] border border-slate-700 text-white"
              value={form.difficulty}
              onChange={(e) =>
                setForm({
                  ...form,
                  difficulty: e.target.value as Difficulty,
                })
              }
            >
              <option value="easy">🟢 Easy</option>
              <option value="medium">🟡 Medium</option>
              <option value="hard">🔴 Hard</option>
            </select>
          </div>


          {/* Domain */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300 font-medium">
              Domain
            </label>

            <select
              className="w-full px-4 py-3 rounded-lg bg-[#020617] border border-slate-700 text-white"
              value={form.domain}
              onChange={(e) =>
                setForm({ ...form, domain: e.target.value as Domain })
              }
            >
              <option value="arrays">Arrays</option>
              <option value="strings">Strings</option>
              <option value="linked-list">Linked List</option>
              <option value="stack">Stack</option>
              <option value="queue">Queue</option>
              <option value="tree">Tree</option>
              <option value="graph">Graph</option>
              <option value="dp">Dynamic Programming</option>
              <option value="math">Math</option>
              <option value="sql">SQL</option>
            </select>
          </div>

        </div>



        {/* Grid 2 */}
        <div className="grid grid-cols-2 gap-6">

          {/* XP Reward */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300 font-medium">
              XP Reward
            </label>

            <input
              type="number"
              min={1}
              className="w-full px-4 py-3 rounded-lg bg-[#020617] border border-slate-700 text-white"
              value={form.xpReward}
              onChange={(e) =>
                setForm({
                  ...form,
                  xpReward: Number(e.target.value),
                })
              }
            />
          </div>


          {/* Time Limit */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300 font-medium">
              Time Limit (minutes)
            </label>

            <input
              type="number"
              min={1}
              className="w-full px-4 py-3 rounded-lg bg-[#020617] border border-slate-700 text-white"
              value={form.timeLimitMinutes}
              onChange={(e) =>
                setForm({
                  ...form,
                  timeLimitMinutes: Number(e.target.value),
                })
              }
            />
          </div>

        </div>


        {/* Premium Toggle */}
        <div className="flex items-center justify-between border border-slate-800 rounded-lg p-4">

          <div>
            <p className="text-sm text-white font-medium">
              Premium Challenge
            </p>
            <p className="text-xs text-slate-400">
              Only premium users can access this challenge
            </p>
          </div>

          <input
            type="checkbox"
            className="w-5 h-5 accent-cyan-500"
            checked={form.isPremium}
            onChange={(e) =>
              setForm({
                ...form,
                isPremium: e.target.checked,
              })
            }
          />

        </div>


        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-700
          transition text-white font-medium disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : id
                ? "Update & Continue →"
                : "Save & Continue →"}
          </button>
        </div>

      </div>

    </div>
  );

};

export default BasicInfo;
