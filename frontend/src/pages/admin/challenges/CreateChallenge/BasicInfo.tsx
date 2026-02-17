import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  createChallengeBasicApi,
  getChallengeByIdApi,
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
          const data = await getChallengeByIdApi(id);
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

      // move to next wizard step (reuse same path structure, just need ID)
      // If we are in 'edit' mode, we might want to stay in 'edit' path, 
      // but 'create' path also works since it just needs ID.
      // However, to be consistent, if we started in edit, we should probably stay in edit.
      // But simpler is to always go to the wizard step path which relies on ID.

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
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-lg font-medium text-slate-200">
        {id ? "Edit Basic Information" : "Basic Information"}
      </h2>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* Title */}
      <input
        className="w-full p-3 rounded bg-[#020617] text-white border border-slate-700 focus:ring-2 focus:ring-cyan-500"
        placeholder="Challenge title"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      {/* Description */}
      <textarea
        className="w-full p-3 rounded bg-[#020617] text-white border border-slate-700 min-h-[120px] focus:ring-2 focus:ring-cyan-500"
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      {/* Difficulty */}
      <select
        className="w-full p-3 rounded bg-[#020617] text-white border border-slate-700"
        value={form.difficulty}
        onChange={(e) =>
          setForm({
            ...form,
            difficulty: e.target.value as Difficulty,
          })
        }
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      {/* Domain */}
      <select
        className="w-full p-3 rounded bg-[#020617] text-white border border-slate-700"
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

      {/* XP Reward */}
      <input
        type="number"
        min={1}
        className="w-full p-3 rounded bg-[#020617] text-white border border-slate-700"
        value={form.xpReward}
        onChange={(e) =>
          setForm({
            ...form,
            xpReward: Number(e.target.value),
          })
        }
      />

      {/* Time Limit */}
      <input
        type="number"
        min={1}
        className="w-full p-3 rounded bg-[#020617] text-white border border-slate-700"
        value={form.timeLimitMinutes}
        onChange={(e) =>
          setForm({
            ...form,
            timeLimitMinutes: Number(e.target.value),
          })
        }
      />

      {/* Premium */}
      <label className="flex items-center gap-2 text-slate-300">
        <input
          type="checkbox"
          checked={form.isPremium}
          onChange={(e) =>
            setForm({
              ...form,
              isPremium: e.target.checked,
            })
          }
        />
        Premium Challenge
      </label>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-5 py-2 rounded bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : (id ? "Update & Continue" : "Save & Continue")}
        </button>
      </div>
    </div>
  );
};

export default BasicInfo;
