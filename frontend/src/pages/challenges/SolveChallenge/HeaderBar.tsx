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

const HeaderBar = ({ challenge, onTimeUp, isSuccess }: any) => {
  const user = useAuthStore((s) => s.user);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // @ts-ignore
    const userId = user?.id || user?._id;
    if (!challenge.timeLimitMinutes || !userId) {
      setTimeLeft(0);
      return;
    }

    const challengeId = challenge.id || challenge._id;
    const timerKey = `challenge_timer_${userId}_${challengeId}`;
    const globalActiveKey = `active_challenge_${userId}`;
    let expiryTime = parseInt(localStorage.getItem(timerKey) || "0", 10);

    if (!expiryTime || expiryTime <= Date.now()) {
      expiryTime = Date.now() + challenge.timeLimitMinutes * 60 * 1000;
      localStorage.setItem(timerKey, expiryTime.toString());
      localStorage.setItem(globalActiveKey, JSON.stringify({
        challengeId: challengeId,
        expiryTime
      }));
    } else {
      // Ensure global active key is set even if refreshing an existing challenge
      localStorage.setItem(globalActiveKey, JSON.stringify({
        challengeId: challengeId,
        expiryTime
      }));
    }

    let interval: ReturnType<typeof setInterval>;

    const updateTimer = () => {
      const remaining = Math.floor((expiryTime - Date.now()) / 1000);
      if (remaining <= 0) {
        setTimeLeft(0);
        localStorage.removeItem(timerKey);
        localStorage.removeItem(globalActiveKey);
        if (onTimeUp) onTimeUp();
        if (interval) clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    };

    updateTimer(); // Initial call before interval kicks in

    if (isSuccess) {
      localStorage.removeItem(timerKey);
      localStorage.removeItem(globalActiveKey);
    } else {
      interval = setInterval(updateTimer, 1000);
    }

    // @ts-ignore
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [challenge.id, challenge._id, challenge.timeLimitMinutes, user?.id, (user as any)?._id, isSuccess]);

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