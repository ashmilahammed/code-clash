import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { addChallengeTagsApi, getAdminChallengeByIdApi } from "../../../../api/challengeApi";
import type { ChallengeWithRelations } from "../../../../types/Challenge";


const ChallengeTags = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchTags = async () => {
        try {
          const data = await getAdminChallengeByIdApi(id);
          const challenge = data as unknown as ChallengeWithRelations;


          if (challenge.tags && Array.isArray(challenge.tags)) {
            // Check if tags are strings or objects
            const processedTags = challenge.tags.map((t: any) => typeof t === 'string' ? t : t.name || t.key || t._id);
            setTags(processedTags);
          }
        } catch (err) {
          console.error("Failed to fetch tags", err);
        }
      };
      fetchTags();
    }
  }, [id]);

  const addTag = () => {

    const value = input.trim().toLowerCase();
    if (!value) return;

    if (tags.includes(value)) {
      setError("Tag already added");
      return;
    }

    setTags([...tags, value]);
    setInput("");
    setError(null);
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };


  const saveAndNext = async () => {
    if (!id) {
      setError("Invalid challenge");
      return;
    }

    if (tags.length === 0) {
      setError("Add at least one tag");
      return;
    }


    try {
      setLoading(true);
      setError(null);

      await addChallengeTagsApi(id, tags);

      // check if we are in edit mode path
      const isEditMode = window.location.pathname.includes("/edit/");
      const basePath = isEditMode ? "/admin/challenges/edit" : "/admin/challenges/create";

      navigate(`${basePath}/${id}/languages`);

    } catch {
      setError("Failed to save tags");
    } finally {
      setLoading(false);
    }
  };



    return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Create Challenge
        </h1>
        <p className="text-sm text-slate-400">
          Step 2 of 5 • Tags
        </p>
      </div>


      {/* Card */}
      <div className="bg-[#020617] border border-slate-800 rounded-xl p-6 space-y-6 shadow-lg">

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {/* Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">
            Add Tags
          </label>

          <div className="flex gap-3">
            <input
              className="flex-1 px-4 py-3 rounded-lg bg-[#020617] border border-slate-700
              text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="Type tag and press Enter (e.g. array)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTag()}
            />

            <button
              onClick={addTag}
              className="px-5 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-medium transition"
            >
              Add
            </button>
          </div>
        </div>


        {/* Selected Tags */}
        <div className="space-y-2">
          <p className="text-sm text-slate-400">Selected Tags</p>

          {tags.length === 0 && (
            <p className="text-xs text-slate-500">
              No tags added yet
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {tags.map((t) => (
              <span
                key={t}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full
                text-sm text-slate-200 flex items-center gap-2 hover:border-cyan-500 transition"
              >
                {t}

                <button
                  onClick={() => removeTag(t)}
                  className="text-slate-400 hover:text-red-400 text-lg leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>


        {/* Footer */}
        <div className="flex justify-end pt-4">
          <button
            onClick={saveAndNext}
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-700
            text-white font-medium transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save & Continue →"}
          </button>
        </div>

      </div>

    </div>
  );

};

export default ChallengeTags;
