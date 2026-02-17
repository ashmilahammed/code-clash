import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAvailableLanguagesApi,
  addChallengeLanguagesApi,
  getChallengeLanguagesApi,
} from "../../../../api/challengeApi";
import type { ProgrammingLanguage } from "../../../../types/ProgrammingLanguage";



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
      getChallengeLanguagesApi(id)
        .then(setSelected)
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
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-lg font-medium text-slate-200">
        Supported Languages
      </h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="space-y-3">
        {languages.map((l) => (
          <label
            key={l.key}
            className="flex gap-3 items-center text-slate-200"
          >
            <input
              type="checkbox"
              checked={selected.includes(l.key)}
              onChange={() => toggle(l.key)}
            />
            {l.name}
          </label>
        ))}
      </div>

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

export default ChallengeLanguages;







// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   getLanguagesApi,
//   addChallengeLanguagesApi,
// } from "../../../../api/challengeApi";
// import type { ProgrammingLanguage } from "../../../../types/ProgrammingLanguage";



// const ChallengeLanguages = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
//   const [selected, setSelected] = useState<string[]>([]);

//   useEffect(() => {
//     getLanguagesApi().then(setLanguages);
//   }, []);

//   const toggle = (key: string) => {
//     setSelected((prev) =>
//       prev.includes(key)
//         ? prev.filter((k) => k !== key)
//         : [...prev, key]
//     );
//   };

//   const saveAndNext = async () => {
//     if (!id) return;
//     await addChallengeLanguagesApi(id, selected);
//     // navigate(`/admin/challenges/${id}/templates`);
//     navigate(`/admin/challenges/create/${id}/test-cases`);

//   };



//   return (
//     <div className="max-w-2xl mx-auto space-y-6">
//       <h1 className="text-xl font-semibold text-white">
//         Create Challenge – Languages
//       </h1>

//       {languages.map((l) => (
//         <label key={l.key} className="flex gap-3 items-center">
//           <input
//             type="checkbox"
//             checked={selected.includes(l.key)}
//             onChange={() => toggle(l.key)}
//           />
//           {l.name}
//         </label>
//       ))}

//       <button onClick={saveAndNext} className="btn-primary">
//         Save & Continue
//       </button>
//     </div>
//   );
// };

// export default ChallengeLanguages;
