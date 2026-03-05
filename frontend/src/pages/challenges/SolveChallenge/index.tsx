import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getChallengeByIdApi, getChallengeTemplatesApi, getChallengeHintsApi, getChallengeTestCasesApi } from "../../../api/challengeApi";
import { useAuthStore } from "../../../store/useAuthStore";

import EditorPanel from "./EditorPanel";
import TestCasePanel from "./TestCasePanel";
import ProblemPanel from "./ProblemPanel";
import HeaderBar from "./HeaderBar";
import SuccessModal from "../../../components/modals/SuccessModal";
import TimeUpModal from "../../../components/modals/TimeUpModal";

const SolveChallenge = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [challenge, setChallenge] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [hints, setHints] = useState<any[]>([]);
  const [testCases, setTestCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [executionResult, setExecutionResult] = useState<any>(null);

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState({ xpEarned: 0, timeTaken: "0:00", attempts: 1, badge: null });

  // Time Up Modal State
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      getChallengeByIdApi(id),
      getChallengeTemplatesApi(id),
      getChallengeHintsApi(id),
      getChallengeTestCasesApi(id)
    ])
      .then(([challengeRes, templateRes, hintsRes, testCasesRes]) => {
        if (challengeRes.isPremium && !user?.is_premium) {
          navigate("/premium");
          return;
        }
        setChallenge(challengeRes);
        setTemplates(templateRes);
        setHints(hintsRes);
        setTestCases(testCasesRes);
      })
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  const handleSuccess = ({ xpEarned, timeTaken, attempts, badge }: any) => {
    // Clear the active timer and global challenge trackers so they aren't stuck locally
    const challengeId = challenge?._id || challenge?.id;
    if (user?.id && challengeId) {
      localStorage.removeItem(`active_challenge_${user.id}`);
      localStorage.removeItem(`challenge_timer_${user.id}_${challengeId}`);
    }

    setSuccessData({ xpEarned, timeTaken, attempts, badge });
    setIsSuccess(true);
    setShowSuccessModal(true);
  };

  const handleRetry = () => {
    setIsTimeUp(false);
    setRetryCount(c => c + 1);
  };

  if (loading) return <div>Loading...</div>;
  if (!challenge) return <div>Challenge not found</div>;

  return (
    <div className="h-screen flex flex-col bg-[#020617] text-white relative">

      {showSuccessModal && (
        <SuccessModal
          onClose={() => setShowSuccessModal(false)}
          xpEarned={successData.xpEarned}
          challengeTitle={challenge.title}
          difficulty={challenge.difficulty}
          timeTaken={successData.timeTaken}
          attempts={successData.attempts}
          badge={successData.badge}
        // nextChallengeId="next-id-here" // todo: implement fetch next challenge
        />
      )}

      {isTimeUp && <TimeUpModal onRetry={handleRetry} />}

      <HeaderBar key={`${challenge._id || challenge.id}-${retryCount}`} challenge={challenge} onTimeUp={() => setIsTimeUp(true)} isSuccess={isSuccess} />

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
            isTimeUp={isTimeUp}
          />
          <TestCasePanel result={executionResult} />
        </div>

      </div>
    </div>
  );
};

export default SolveChallenge;





