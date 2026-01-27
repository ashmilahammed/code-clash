import React from "react";

interface LevelProgressProps {
  level: number;
  currentXp: number;
  nextLevelXp: number;
}

const LevelProgress: React.FC<LevelProgressProps> = ({
  level,
  currentXp,
  nextLevelXp,
}) => {
  const progressPercentage = Math.min(
    (currentXp / nextLevelXp) * 100,
    100
  );

  return (
    <div className="w-full bg-linear-to-br from-[#0F172A] to-[#020617] rounded-2xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-white text-lg font-semibold">
            Level {level}
          </h2>
          <p className="text-slate-400 text-sm">
            {currentXp} / {nextLevelXp} XP
          </p>
        </div>

        <div className="text-cyan-400 font-bold text-xl">
          ⚡
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-cyan-400 to-blue-500 transition-all duration-700 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Footer */}
      <div className="mt-3 flex justify-between text-xs text-slate-400">
        <span>Current XP</span>
        <span>{Math.max(nextLevelXp - currentXp, 0)} XP to next level</span>
      </div>
    </div>
  );
};

export default LevelProgress;
