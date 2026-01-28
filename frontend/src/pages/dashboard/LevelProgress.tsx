interface LevelProgressProps {
  level: number;
  currentXp: number;
  nextLevelXp: number;
}

const LevelProgress = ({
  level,
  currentXp,
  nextLevelXp,
}: LevelProgressProps) => {
  const progress = Math.min(
    (currentXp / nextLevelXp) * 100,
    100
  );

  return (
    <div className="bg-slate-900 rounded-xl p-6 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 text-sm font-semibold">
            ⚡ Level {level}
          </span>
        </div>
        <span className="text-xs text-slate-400">
          {currentXp} / {nextLevelXp} XP
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Footer */}
      <p className="text-xs text-slate-400 mt-2">
        {nextLevelXp - currentXp} XP to next level
      </p>
    </div>
  );
};

export default LevelProgress;
