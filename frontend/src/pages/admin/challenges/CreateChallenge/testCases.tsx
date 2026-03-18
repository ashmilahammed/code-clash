import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  addChallengeTestCasesApi,
  getAdminChallengeTestCasesApi
} from "../../../../api/challengeApi";


type TestCaseForm = {
  input: string;
  expectedOutput: string;
  isSample?: boolean;
};


const ChallengeTestCases = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [cases, setCases] = useState<TestCaseForm[]>([
    { input: "", expectedOutput: "", isSample: true },
  ]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getAdminChallengeTestCasesApi(id)
        .then((data) => {
          if (data && data.length > 0) {

            setCases(data.map((c: any) => ({
              input: c.input,
              expectedOutput: c.expectedOutput,
              isSample: c.isSample // casting as any to check if backend sends it
            })));
          }
        })
        .catch(err => console.error("Failed to load test cases", err));
    }
  }, [id]);


  const addCase = () => {
    setCases((prev) => [
      ...prev,
      { input: "", expectedOutput: "", isSample: false },
    ]);
  };

  const updateCase = (
    index: number,
    key: keyof TestCaseForm,
    value: string | boolean
  ) => {
    setCases((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [key]: value,
      };
      return copy;
    });
  };

  //
  const saveAndNext = async () => {
    if (!id) return;

    setError(null);

    if (!cases.length) {
      setError("Add at least one test case");
      return;
    }

    const hasSample = cases.some(c => c.isSample);
    if (!hasSample) {
      setError("At least one sample test case is required");
      return;
    }

    for (const c of cases) {
      if (!c.input.trim() || !c.expectedOutput.trim()) {
        setError("Input and output cannot be empty");
        return;
      }
    }

    await addChallengeTestCasesApi(id, cases);

    // next wizard step
    const isEditMode = window.location.pathname.includes("/edit/");
    const basePath = isEditMode ? "/admin/challenges/edit" : "/admin/challenges/create";
    navigate(`${basePath}/${id}/hints`);

  };



  const removeCase = (index: number) => {
    setCases((prev) => prev.filter((_, i) => i !== index));
  };




  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Create Challenge
        </h1>
        <p className="text-sm text-slate-400">
          Step 4 of 5 • Test Cases
        </p>
      </div>

      {/* Container */}
      <div className="bg-[#020617] border border-slate-800 rounded-xl p-6 space-y-6">

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {cases.map((c, i) => (
          <div
            key={i}
            className="border border-slate-800 rounded-lg p-4 space-y-3 bg-slate-950"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-slate-300">
                Test Case {i + 1}
              </p>

              {cases.length > 1 && (
                <button
                  onClick={() => removeCase(i)}
                  className="text-xs text-slate-500 hover:text-red-500"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Input */}
            <div className="space-y-1">
              <label className="text-xs text-slate-500">Input</label>
              <textarea
                value={c.input}
                onChange={(e) =>
                  updateCase(i, "input", e.target.value)
                }
                className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700
        text-sm text-white focus:ring-1 focus:ring-cyan-500 outline-none
        min-h-[60px] resize-y"
                placeholder="Enter input"
              />
            </div>

            {/* Output */}
            <div className="space-y-1">
              <label className="text-xs text-slate-500">
                Expected Output
              </label>
              <textarea
                value={c.expectedOutput}
                onChange={(e) =>
                  updateCase(i, "expectedOutput", e.target.value)
                }
                className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700
        text-sm text-white focus:ring-1 focus:ring-cyan-500 outline-none
        min-h-[60px] resize-y"
                placeholder="Enter expected output"
              />
            </div>

            {/* Sample */}
            <label className="flex items-center gap-2 text-xs text-slate-400">
              <input
                type="checkbox"
                checked={!!c.isSample}
                onChange={(e) =>
                  updateCase(i, "isSample", e.target.checked)
                }
                className="w-4 h-4 accent-cyan-500"
              />
              Show as sample
            </label>
          </div>
        ))}

        {/* Footer Buttons */}
        <div className="flex justify-between pt-4">

          <button
            onClick={addCase}
            className="px-4 py-2 rounded-lg border border-slate-700
          text-slate-300 hover:border-cyan-500 hover:text-white transition"
          >
            + Add Test Case
          </button>

          <button
            onClick={saveAndNext}
            className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700
          text-white font-medium transition"
          >
            Save & Continue →
          </button>

        </div>

      </div>

    </div>
  );


};

export default ChallengeTestCases;
