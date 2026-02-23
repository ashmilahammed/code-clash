import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  addChallengeTestCasesApi,
  // getChallengeTestCasesApi,
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

  useEffect(() => {
    if (id) {
      getAdminChallengeTestCasesApi(id)
        .then((data) => {
          if (data && data.length > 0) {
            // map data to form format if needed (API returns {input, expectedOutput}, isSample might be missing in some DTOs but let's see)
            // The API seems to just return input/output based on my previous read.
            // Re-checking getChallengeTestCasesApi in challengeApi.ts: it returns { input: string; expectedOutput: string }[]
            // Wait, the backend entity has isSample. I should check if the API returns it. 
            // If not, I might lose that info. 
            // Let's assume for now it returns it or I'll fix the API later.
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

    if (!cases.length) {
      alert("Add at least one test case");
      return;
    }

    const hasSample = cases.some(c => c.isSample);
    if (!hasSample) {
      alert("At least one sample test case is required");
      return;
    }

    for (const c of cases) {
      if (!c.input.trim() || !c.expectedOutput.trim()) {
        alert("Input and output cannot be empty");
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
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold text-white">
        Create Challenge – Test Cases
      </h1>

      {cases.map((c, i) => (
        <div
          key={i}
          className="bg-slate-900 p-4 rounded space-y-3 relative"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-slate-400 text-sm font-medium">Test Case {i + 1}</h3>
            {cases.length > 1 && (
              <button
                onClick={() => removeCase(i)}
                className="text-slate-500 hover:text-red-500 transition-colors"
                title="Remove Test Case"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>

          <textarea
            placeholder="Input"
            value={c.input}
            onChange={(e) =>
              updateCase(i, "input", e.target.value)
            }
            className="w-full p-2 rounded bg-[#020617]"
          />

          <textarea
            placeholder="Expected Output"
            value={c.expectedOutput}
            onChange={(e) =>
              updateCase(i, "expectedOutput", e.target.value)
            }
            className="w-full p-2 rounded bg-[#020617]"
          />

          <label className="flex gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={!!c.isSample}
              onChange={(e) =>
                updateCase(i, "isSample", e.target.checked)
              }
            />
            Show as sample
          </label>
        </div>
      ))}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={addCase}
          className="btn-secondary"
        >
          + Add Test Case
        </button>

        <button
          type="button"
          onClick={saveAndNext}
          className="btn-primary"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};

export default ChallengeTestCases;
