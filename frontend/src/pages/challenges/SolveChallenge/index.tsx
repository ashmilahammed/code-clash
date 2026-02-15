import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getChallengeByIdApi, getChallengeTemplatesApi } from "../../../api/challengeApi";

import EditorPanel from "./EditorPanel";
import TestCasePanel from "./TestCasePanel";
import ProblemPanel from "./ProblemPanel";
import HeaderBar from "./HeaderBar";

const SolveChallenge = () => {
  const { id } = useParams();

  const [challenge, setChallenge] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [executionResult, setExecutionResult] = useState<any>(null);


  useEffect(() => {
    if (!id) return;

    Promise.all([
      getChallengeByIdApi(id),
      getChallengeTemplatesApi(id),
    ])
      .then(([challengeRes, templateRes]) => {
        setChallenge(challengeRes);
        setTemplates(templateRes);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!challenge) return <div>Challenge not found</div>;

  return (

    <div className="h-screen flex flex-col bg-[#020617] text-white">
      <HeaderBar challenge={challenge} />

      <div className="flex flex-1 overflow-hidden">

        {/* <div className="w-1/2 overflow-y-auto border-r border-slate-800">
          <ProblemPanel challenge={challenge} />
        </div> */}

        {/* LEFT PANEL */}
        <div className="flex-[1.1] min-w-[420px] overflow-y-auto border-r border-slate-800">
          <ProblemPanel challenge={challenge} />
        </div>

        {/* <div className="w-1/2 flex flex-col">
          <EditorPanel
            templates={templates}
            challengeId={id!}
            setResult={setExecutionResult}
          />
          <TestCasePanel result={executionResult} />
        </div> */}

        {/* RIGHT PANEL */}
        <div className="flex-1 flex flex-col min-w-[450px]">
          <EditorPanel
            templates={templates}
            challengeId={id!}
            setResult={setExecutionResult}
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