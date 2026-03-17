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

    // Re-fetch templates to unlock the solution
    if (id) {
      getChallengeTemplatesApi(id).then(res => setTemplates(res));
    }
  };

  const handleRetry = () => {
    setIsTimeUp(false);
    setRetryCount(c => c + 1);
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-[#020617] text-white">
        {/* Header Skeleton */}
        <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-[#0B1221]">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-slate-800 rounded-lg animate-pulse"></div>
            <div className="w-32 h-5 bg-slate-800 rounded animate-pulse"></div>
          </div>
          <div className="flex gap-3">
            <div className="w-24 h-8 bg-slate-800 rounded-lg animate-pulse"></div>
            <div className="w-24 h-8 bg-slate-800 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel Skeleton (Problem Description) */}
          <div className="flex-[1.1] min-w-[420px] border-r border-slate-800 p-6 flex flex-col gap-6">
            <div className="w-3/4 h-8 bg-slate-800 rounded-lg animate-pulse"></div>
            <div className="flex gap-3">
              <div className="w-16 h-6 bg-slate-800 rounded-full animate-pulse"></div>
              <div className="w-20 h-6 bg-slate-800 rounded-full animate-pulse"></div>
            </div>
            
            <div className="space-y-4 mt-4">
              <div className="w-full h-4 bg-slate-800 rounded animate-pulse"></div>
              <div className="w-full h-4 bg-slate-800 rounded animate-pulse"></div>
              <div className="w-11/12 h-4 bg-slate-800 rounded animate-pulse"></div>
              <div className="w-4/5 h-4 bg-slate-800 rounded animate-pulse"></div>
              <div className="w-full h-4 bg-slate-800 rounded animate-pulse mt-4"></div>
              <div className="w-5/6 h-4 bg-slate-800 rounded animate-pulse"></div>
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="w-1/3 h-6 bg-slate-800 rounded animate-pulse"></div>
              <div className="w-full h-32 bg-slate-800/50 rounded-xl animate-pulse border border-slate-800"></div>
            </div>
          </div>

          {/* Right Panel Skeleton */}
          <div className="flex-1 flex flex-col min-w-[450px]">
             {/* Editor Area */}
             <div className="flex-2 border-b border-slate-800 flex flex-col">
                <div className="h-12 bg-[#0B1221] border-b border-slate-800 flex items-center px-4 gap-3">
                    <div className="w-28 h-7 bg-slate-800 rounded-md animate-pulse"></div>
                    <div className="w-20 h-7 bg-slate-800 rounded-md animate-pulse"></div>
                    <div className="ml-auto w-8 h-8 bg-slate-800 rounded-md animate-pulse"></div>
                </div>
                <div className="flex-1 p-5">
                   <div className="w-full h-full bg-slate-800/20 rounded-xl animate-pulse border border-slate-800/50"></div>
                </div>
             </div>
             
             {/* Test Cases Area */}
             <div className="flex-1 flex flex-col bg-[#020617]">
                <div className="h-10 bg-[#0B1221] border-b border-slate-800 flex items-center px-4">
                    <div className="w-32 h-5 bg-slate-800 rounded animate-pulse"></div>
                </div>
                <div className="flex-1 p-4 flex gap-4">
                   <div className="w-1/4 h-full bg-slate-800/30 rounded-lg animate-pulse border border-slate-800/50"></div>
                   <div className="flex-1 h-full bg-slate-800/30 rounded-lg animate-pulse border border-slate-800/50"></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }
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
            templates={templates}
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