import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { addChallengeTagsApi, getChallengeByIdApi } from "../../../../api/challengeApi";
import type{ ChallengeWithRelations } from "../../../../types/Challenge";


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
          const data = await getChallengeByIdApi(id);
          const challenge = data as unknown as ChallengeWithRelations;
          // Assume challenge.tags is string[] or object[] with name/key?
          // Based on types/Challenge.ts: ChallengeWithRelations has tags: string[]
          // However, the backend populate might return objects if not handled by mapper.
          // Let's assume the API returns what we need or check the Mapper.
          // If it returns objects, we might need to map. 
          // For now assuming the DTO has been mapped to strings or simple objects.

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
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold text-white">
        Challenge – Tags
      </h1>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <div className="flex gap-2">
        <input
          className="input flex-1 p-3 rounded bg-slate-800 text-white border border-slate-700"
          placeholder="Add tag (e.g. array)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTag()}
        />
        <button onClick={addTag} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white">
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="px-3 py-1 bg-slate-700 rounded-full text-sm flex items-center gap-2 text-slate-200"
          >
            {t}
            <button
              onClick={() => removeTag(t)}
              className="hover:text-red-400 font-bold"
            >
              &times;
            </button>
          </span>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={saveAndNext}
          disabled={loading}
          className="px-5 py-2 rounded bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white"
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </div>

    </div>
  );
};

export default ChallengeTags;
