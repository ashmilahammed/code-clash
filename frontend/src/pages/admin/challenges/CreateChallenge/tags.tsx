import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { addChallengeTagsApi } from "../../../../api/challengeApi";


const ChallengeTags = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      // navigate(`/admin/challenges/${id}/languages`);
      navigate(`/admin/challenges/create/${id}/languages`);

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
          className="input flex-1"
          placeholder="Add tag (e.g. array)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTag()}
        />
        <button onClick={addTag} className="btn-secondary">
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="px-3 py-1 bg-slate-700 rounded-full text-sm"
          >
            {t}
          </span>
        ))}
      </div>

      {/* <button
        onClick={saveAndNext}
        disabled={loading}
        className="btn-primary"
      >
        {loading ? "Saving..." : "Save & Continue"}
      </button> */}
       <div className="flex justify-end">
        <button
          onClick={saveAndNext}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </div>
      
    </div>
  );
};

export default ChallengeTags;
