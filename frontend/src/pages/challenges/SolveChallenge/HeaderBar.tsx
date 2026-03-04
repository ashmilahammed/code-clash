// const HeaderBar = ({ challenge }: any) => {
//   return (
//     <div className="px-6 py-3 border-b border-slate-800 bg-[#0f172a]">
//       <h1 className="text-lg font-semibold">
//         {challenge.title}
//       </h1>

//       <div className="text-sm text-slate-400">
//         {challenge.difficulty.toUpperCase()} • XP {challenge.xpReward}
//       </div>
//     </div>
//   );
// };

// export default HeaderBar;



import { useState, useEffect } from "react";
import { useAuthStore } from "../../../store/useAuthStore";

const HeaderBar = ({ challenge }: any) => {
  const user = useAuthStore((s) => s.user);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!challenge.timeLimitMinutes || !user?.id) {
      setTimeLeft(0);
      return;
    }

    const timerKey = `challenge_timer_${user.id}_${challenge._id}`;
    const globalActiveKey = `active_challenge_${user.id}`;
    let expiryTime = parseInt(localStorage.getItem(timerKey) || "0", 10);

    if (!expiryTime || expiryTime <= Date.now()) {
      expiryTime = Date.now() + challenge.timeLimitMinutes * 60 * 1000;
      localStorage.setItem(timerKey, expiryTime.toString());
      localStorage.setItem(globalActiveKey, JSON.stringify({
        challengeId: challenge._id,
        expiryTime
      }));
    } else {
      // Ensure global active key is set even if refreshing an existing challenge
      localStorage.setItem(globalActiveKey, JSON.stringify({
        challengeId: challenge._id,
        expiryTime
      }));
    }

    const updateTimer = () => {
      const remaining = Math.floor((expiryTime - Date.now()) / 1000);
      if (remaining <= 0) {
        setTimeLeft(0);
        localStorage.removeItem(timerKey);
        localStorage.removeItem(globalActiveKey);
      } else {
        setTimeLeft(remaining);
      }
    };

    updateTimer(); // Initial call before interval kicks in
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [challenge._id, challenge.timeLimitMinutes, user?.id]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-[#0f172a] border-b border-slate-800">

      {/* LEFT SIDE */}
      <div>
        <h1 className="text-lg font-semibold">
          {challenge.title}
        </h1>
        <div className="text-sm text-slate-400">
          {challenge.difficulty.toUpperCase()} • XP {challenge.xpReward}
        </div>
      </div>

      {/* CENTER - Timer */}
      {challenge.timeLimitMinutes && (
        <div className="text-xl font-mono font-bold text-indigo-400">
          ⏱️ {formatTime(timeLeft)}
        </div>
      )}

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6 text-sm text-slate-400">
        <span>👥 215 Solvers</span>
        <span>📊 41% Success</span>

        {/* <button className="bg-indigo-600 hover:bg-indigo-500 transition px-3 py-1 rounded text-white">
          Hint
        </button> */}
      </div>

    </div>
  );
};

export default HeaderBar;
