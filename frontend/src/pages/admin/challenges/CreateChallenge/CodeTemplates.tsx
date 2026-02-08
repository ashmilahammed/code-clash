// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { saveCodeTemplatesApi } from "../../../../api/challengeApi";


// type CodeTemplateForm = {
//   language: string;
//   starterCode: string;
//   solutionCode: string;
// };

// const CodeTemplates = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [templates, setTemplates] = useState<CodeTemplateForm[]>([
//     {
//       language: "javascript",
//       starterCode: "",
//       solutionCode: "",
//     },
//   ]);

//   const updateTemplate = (
//     index: number,
//     field: keyof CodeTemplateForm,
//     value: string
//   ) => {
//     const copy = [...templates];
//     copy[index][field] = value;
//     setTemplates(copy);
//   };

//   const saveAndFinish = async () => {
//     if (!id) return;
//     await saveCodeTemplatesApi(id, templates);
//     navigate("/admin/challenges");
//   };

//   return (
//     <div className="max-w-4xl mx-auto space-y-8">
//       <h1 className="text-xl font-semibold text-white">
//         Create Challenge – Code Templates
//       </h1>

//       {templates.map((t, i) => (
//         <div
//           key={i}
//           className="bg-slate-900 rounded-lg p-5 space-y-4"
//         >
//           <input
//             className="input"
//             placeholder="Language (e.g. javascript)"
//             value={t.language}
//             onChange={(e) =>
//               updateTemplate(i, "language", e.target.value)
//             }
//           />

//           <textarea
//             className="w-full p-3 rounded bg-[#020617] font-mono text-sm"
//             rows={6}
//             placeholder="Starter Code"
//             value={t.starterCode}
//             onChange={(e) =>
//               updateTemplate(i, "starterCode", e.target.value)
//             }
//           />

//           <textarea
//             className="w-full p-3 rounded bg-[#020617] font-mono text-sm"
//             rows={6}
//             placeholder="Solution Code"
//             value={t.solutionCode}
//             onChange={(e) =>
//               updateTemplate(i, "solutionCode", e.target.value)
//             }
//           />
//         </div>
//       ))}

//       <button onClick={saveAndFinish} className="btn-primary">
//         Save & Finish
//       </button>
//     </div>
//   );
// };

// export default CodeTemplates;










import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  saveCodeTemplatesApi,
  getChallengeLanguagesApi,
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

    getChallengeLanguagesApi(id)
      .then((languages: string[]) => {
        setTemplates(
          languages.map((lang) => ({
            language: lang,
            starterCode: "",
            solutionCode: "",
          }))
        );
      })
      .catch(() => {
        setError("Failed to load challenge languages");
      });
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
          <textarea
            className="w-full p-3 rounded bg-[#020617] font-mono text-sm border border-slate-700 focus:ring-2 focus:ring-cyan-500"
            rows={6}
            placeholder="Starter Code (what user sees initially)"
            value={t.starterCode}
            onChange={(e) =>
              updateTemplate(i, "starterCode", e.target.value)
            }
          />

          {/* Solution Code */}
          <textarea
            className="w-full p-3 rounded bg-[#020617] font-mono text-sm border border-slate-700 focus:ring-2 focus:ring-cyan-500"
            rows={6}
            placeholder="Solution Code (used for validation)"
            value={t.solutionCode}
            onChange={(e) =>
              updateTemplate(i, "solutionCode", e.target.value)
            }
          />
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
