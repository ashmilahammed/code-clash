import EditorPanel from "./EditorPanel";
import TestCasePanel from "./TestCasePanel";
import ProblemPanel from "./ProblemPanel";
import HeaderBar from "./HeaderBar";

const SolveChallenge = () => {
  return (
    <div className="h-screen flex flex-col bg-[#020617] text-white">
      <HeaderBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: problem */}
        <div className="w-1/2 overflow-y-auto border-r border-slate-800">
          <ProblemPanel />
        </div>

        {/* Right: editor */}
        <div className="w-1/2 flex flex-col">
          <EditorPanel />
          <TestCasePanel />
        </div>
      </div>
    </div>
  );
};

export default SolveChallenge;