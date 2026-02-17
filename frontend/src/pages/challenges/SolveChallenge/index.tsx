import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getChallengeByIdApi, getChallengeTemplatesApi, getChallengeHintsApi, getChallengeTestCasesApi } from "../../../api/challengeApi";

import EditorPanel from "./EditorPanel";
import TestCasePanel from "./TestCasePanel";
import ProblemPanel from "./ProblemPanel";
import HeaderBar from "./HeaderBar";
import SuccessModal from "../../../components/modals/SuccessModal";

const SolveChallenge = () => {
  const { id } = useParams();

  const [challenge, setChallenge] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [hints, setHints] = useState<any[]>([]);
  const [testCases, setTestCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [executionResult, setExecutionResult] = useState<any>(null);

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      getChallengeByIdApi(id),
      getChallengeTemplatesApi(id),
      getChallengeHintsApi(id),
      getChallengeTestCasesApi(id)
    ])
      .then(([challengeRes, templateRes, hintsRes, testCasesRes]) => {
        setChallenge(challengeRes);
        setTemplates(templateRes);
        setHints(hintsRes);
        setTestCases(testCasesRes);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSuccess = (xp: number) => {
    setEarnedXp(xp);
    setShowSuccessModal(true);
  };

  if (loading) return <div>Loading...</div>;
  if (!challenge) return <div>Challenge not found</div>;

  return (
    <div className="h-screen flex flex-col bg-[#020617] text-white relative">

      {showSuccessModal && (
        <SuccessModal
          onClose={() => setShowSuccessModal(false)}
          xpEarned={earnedXp}
          challengeTitle={challenge.title}
          difficulty={challenge.difficulty}
          // Mock data for now, can be passed from result if available
          timeTaken="5:24"
          attempts={1}
        // nextChallengeId="next-id-here" // todo: implement fetch next challenge
        />
      )}

      <HeaderBar challenge={challenge} />

      <div className="flex flex-1 overflow-hidden">

        {/* LEFT PANEL */}
        <div className="flex-[1.1] min-w-[420px] overflow-y-auto border-r border-slate-800">
          <ProblemPanel
            challenge={challenge}
            hints={hints}
            testCases={testCases}
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 flex flex-col min-w-[450px]">
          <EditorPanel
            templates={templates}
            challengeId={id!}
            testCases={testCases}
            setResult={setExecutionResult}
            onSuccess={handleSuccess}
          />
          <TestCasePanel result={executionResult} />
        </div>

      </div>
    </div>
  );
};

export default SolveChallenge;








// import EditorPanel from "./EditorPanel";
// import TestCasePanel from "./TestCasePanel";
// import ProblemPanel from "./ProblemPanel";
// import HeaderBar from "./HeaderBar";

// const SolveChallenge = () => {
//   return (
//     <div className="h-screen flex flex-col bg-[#020617] text-white">
//       <HeaderBar />

//       <div className="flex flex-1 overflow-hidden">
//         {/* Left: problem */}
//         <div className="w-1/2 overflow-y-auto border-r border-slate-800">
//           <ProblemPanel />
//         </div>

//         {/* Right: editor */}
//         <div className="w-1/2 flex flex-col">
//           <EditorPanel />
//           <TestCasePanel />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SolveChallenge;