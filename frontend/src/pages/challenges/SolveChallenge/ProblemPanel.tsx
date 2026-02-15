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

const ProblemPanel = ({ challenge }: any) => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="h-full flex flex-col">

      {/* Tabs */}
      <div className="flex gap-6 px-6 pt-4 border-b border-slate-800">
        {["description", "hints"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 capitalize ${
              activeTab === tab
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
          <p className="text-slate-300 whitespace-pre-line">
            {challenge.description}
          </p>
        )}

        {activeTab === "hints" && (
          <div className="text-slate-300">
            {challenge.hints?.length ? (
              challenge.hints.map((hint: any, i: number) => (
                <div key={i} className="mb-3">
                  💡 {hint.content}
                </div>
              ))
            ) : (
              <div>No hints available</div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default ProblemPanel;
