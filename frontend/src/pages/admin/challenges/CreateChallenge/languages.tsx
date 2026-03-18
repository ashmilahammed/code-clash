import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAvailableLanguagesApi,
  addChallengeLanguagesApi,
  getAdminChallengeByIdApi,
} from "../../../../api/challengeApi";
import type { ProgrammingLanguage } from "../../../../types/ProgrammingLanguage";
import type { ChallengeWithRelations } from "../../../../types/Challenge";



const ChallengeLanguages = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load available languages
    getAvailableLanguagesApi()
      .then(setLanguages)
      .catch(() => setError("Failed to load languages"));

    // If editing, load selected languages
    if (id) {
      getAdminChallengeByIdApi(id)
        .then(data => {
          const challenge = data as unknown as ChallengeWithRelations;
          if (challenge.languages && Array.isArray(challenge.languages)) {
            setSelected(challenge.languages.map((l: any) => typeof l === 'string' ? l : (l.key || l._id)));
          }
        })
        .catch(err => console.error("Failed to load challenge languages", err));
    }
  }, [id]);

  const toggle = (key: string) => {
    setSelected((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };

  const saveAndNext = async () => {
    if (!id) {
      setError("Invalid challenge");
      return;
    }

    if (selected.length === 0) {
      setError("Select at least one language");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await addChallengeLanguagesApi(id, selected);

      //  correct wizard flow
      navigate(`/admin/challenges/create/${id}/test-cases`);
    } catch {
      setError("Failed to save languages");
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
          Step 3 of 5 • Supported Languages
        </p>
      </div>

      {/* Card */}
      <div className="bg-[#020617] border border-slate-800 rounded-xl p-6 space-y-6">

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {/* Info */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-slate-400">
            Select languages allowed for this challenge
          </p>

          <p className="text-sm text-cyan-400">
            {selected.length} Selected
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

          {languages.map((l) => {
            const isSelected = selected.includes(l.key);

            return (
              <div
                key={l.key}
                onClick={() => toggle(l.key)}
                className={`
                cursor-pointer flex items-center gap-3
                px-4 py-3 rounded-lg border transition
                ${isSelected
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-slate-700 bg-slate-900 hover:border-cyan-500"}
              `}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(l.key)}
                  className="w-4 h-4 accent-cyan-500"
                />

                <span className="text-sm font-medium text-white">
                  {l.name}
                </span>
              </div>
            );
          })}

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

export default ChallengeLanguages;



