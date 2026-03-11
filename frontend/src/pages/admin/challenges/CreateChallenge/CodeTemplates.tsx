
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  saveCodeTemplatesApi,
  getChallengeLanguagesApi,
  getAdminChallengeTemplatesApi
} from "../../../../api/challengeApi";

type CodeTemplateForm = {
  language: string;
  starterCode: string;
  solutionCode: string;
};

const CodeTemplates = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [templates, setTemplates] = useState<CodeTemplateForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Load selected languages (Step 3 output)
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setLoading(true);
        // First try to fetch existing templates (edit mode)
        // If none exist, we might be creating new, so fetch languages and init defaults

        // Actually, best approach: fetch existing templates headers.
        const existingTemplates = await getAdminChallengeTemplatesApi(id).catch(() => []);

        if (existingTemplates && existingTemplates.length > 0) {
          setTemplates(existingTemplates);
          return;
        }

        // Fallback: if no templates found, load from languages
        const languages = await getChallengeLanguagesApi(id);
        setTemplates(
          languages.map((lang) => ({
            language: lang,
            starterCode: "",
            solutionCode: "",
          }))
        );

      } catch (err) {
        console.error(err);
        setError("Failed to load templates");
      } finally {
        setLoading(false);
      }
    };

    loadData();

  }, [id]);


  //Update template code
  const updateTemplate = (
    index: number,
    field: "starterCode" | "solutionCode",
    value: string
  ) => {
    setTemplates((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value,
      };
      return copy;
    });
  };


  // save template
  const saveAndFinish = async () => {
    if (!id) return;

    // 
    for (const t of templates) {
      if (!t.starterCode.trim() || !t.solutionCode.trim()) {
        setError(
          "Starter code and solution code are required for all languages"
        );
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      await saveCodeTemplatesApi(id, templates);

      // Back to challenge management
      navigate("/admin/challenges");
    } catch {
      setError("Failed to save code templates");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-lg font-medium text-slate-200">
        Code Templates
      </h2>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {templates.map((t, i) => (
        <div
          key={t.language}
          className="bg-slate-900 rounded-lg p-5 space-y-4"
        >
          {/* Language label (NOT editable) */}
          <div className="text-slate-300 font-semibold capitalize">
            {t.language}
          </div>

          {/* Starter Code */}
          <div className="space-y-1">
            <p className="text-sm text-slate-400">
              Starter Code 
            </p>

            <textarea
              className="w-full p-3 rounded bg-[#020617] font-mono text-sm border border-slate-700 focus:ring-2 focus:ring-cyan-500"
              rows={6}
              placeholder="Starter Code"
              value={t.starterCode}
              onChange={(e) =>
                updateTemplate(i, "starterCode", e.target.value)
              }
            />
          </div>

          {/* Solution Code */}
          <div className="space-y-1">
            <p className="text-sm text-slate-400">
              Solution Code 
            </p>

            <textarea
              className="w-full p-3 rounded bg-[#020617] font-mono text-sm border border-slate-700 focus:ring-2 focus:ring-cyan-500"
              rows={6}
              placeholder="Solution Code"
              value={t.solutionCode}
              onChange={(e) =>
                updateTemplate(i, "solutionCode", e.target.value)
              }
            />
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          onClick={saveAndFinish}
          disabled={loading}
          className="px-5 py-2 rounded bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save & Finish"}
        </button>
      </div>
    </div>
  );
};

export default CodeTemplates;
