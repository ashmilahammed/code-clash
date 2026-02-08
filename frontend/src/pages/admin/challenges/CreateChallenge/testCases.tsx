import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addChallengeTestCasesApi } from "../../../../api/challengeApi";


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
    // navigate(`/admin/challenges/${id}/hints`);
    navigate(`/admin/challenges/create/${id}/hints`);

  };



  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold text-white">
        Create Challenge – Test Cases
      </h1>

      {cases.map((c, i) => (
        <div
          key={i}
          className="bg-slate-900 p-4 rounded space-y-3"
        >
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
