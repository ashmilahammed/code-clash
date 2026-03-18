
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
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Create Challenge
        </h1>
        <p className="text-sm text-slate-400">
          Final Step • Code Templates
        </p>
      </div>

      {/* Container */}
      <div className="bg-[#020617] border border-slate-800 rounded-xl p-6 space-y-6">

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {templates.map((t, i) => (
          <div
            key={t.language}
            className="border border-slate-800 rounded-lg p-5 space-y-4 bg-slate-950"
          >

            {/* Language Header */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 text-xs rounded-md bg-slate-800 text-slate-300 font-medium capitalize">
                {t.language}
              </span>
            </div>

            {/* Starter Code */}
            <div className="space-y-1">
              <label className="text-xs text-slate-500">
                Starter Code
              </label>

              <textarea
                className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700
              font-mono text-sm text-white focus:ring-1 focus:ring-cyan-500 outline-none
              min-h-[120px] resize-y"
                placeholder="Starter code template..."
                value={t.starterCode}
                onChange={(e) =>
                  updateTemplate(i, "starterCode", e.target.value)
                }
              />
            </div>

            {/* Solution Code */}
            <div className="space-y-1">
              <label className="text-xs text-slate-500">
                Official Solution
              </label>

              <textarea
                className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700
              font-mono text-sm text-white focus:ring-1 focus:ring-cyan-500 outline-none
              min-h-[120px] resize-y"
                placeholder="Official solution..."
                value={t.solutionCode}
                onChange={(e) =>
                  updateTemplate(i, "solutionCode", e.target.value)
                }
              />
            </div>

          </div>
        ))}

        {/* Footer */}
        <div className="flex justify-end pt-4">
          <button
            onClick={saveAndFinish}
            disabled={loading}
            className="px-7 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-700
          text-white font-semibold transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save & Publish Challenge "}
          </button>
        </div>

      </div>

    </div>
  );

};

export default CodeTemplates;
