// const ProblemPanel = ({ challenge }: any) => {
//   return (
//     <div className="p-6 space-y-4">
//       <p className="text-slate-300 whitespace-pre-line">
//         {challenge.description}
//       </p>
//     </div>
//   );
// };

// export default ProblemPanel;



import { useState } from "react";

const ProblemPanel = ({ challenge, hints, testCases }: any) => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="h-full flex flex-col">

      {/* Tabs */}
      <div className="flex gap-6 px-6 pt-4 border-b border-slate-800">
        {["description", "hints"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 capitalize ${activeTab === tab
              ? "text-white border-b-2 border-indigo-500"
              : "text-slate-400"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "description" && (
          <div className="space-y-6">
            <p className="text-slate-300 whitespace-pre-line">
              {challenge.description}
            </p>

            {/* Examples */}
            {testCases.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Examples</h3>
                {testCases.map((tc: any, i: number) => (
                  <div key={i} className="bg-slate-900 p-4 rounded-lg space-y-2">
                    <div>
                      <span className="text-slate-500 text-sm">Input:</span>
                      <code className="block text-slate-300 bg-slate-800 p-2 rounded mt-1">
                        {tc.input}
                      </code>
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm">Output:</span>
                      <code className="block text-slate-300 bg-slate-800 p-2 rounded mt-1">
                        {tc.expectedOutput}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "hints" && (
          <div className="text-slate-300 text-base space-y-4">
            {hints?.length ? (
              hints.map((hint: any, i: number) => (
                <div key={i} className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                  <div className="text-indigo-400 font-medium mb-1">Hint {i + 1}</div>
                  {hint.content}
                </div>
              ))
            ) : (
              <div className="text-slate-500 italic">No hints available for this challenge.</div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default ProblemPanel;
