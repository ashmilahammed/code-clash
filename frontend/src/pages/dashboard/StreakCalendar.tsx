import React from "react";

interface StreakCalendarProps {
  currentStreak: number;
  longestStreak: number;
  activeDates?: string[]; // ISO date strings
}

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const StreakCalendar: React.FC<StreakCalendarProps> = ({
  currentStreak,
  longestStreak,
  activeDates = [],
}) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const isActiveDay = (day: number) => {
    const dateStr = new Date(year, month, day)
      .toISOString()
      .split("T")[0];

    return activeDates.includes(dateStr);
  };

  return (
    <div className="bg-linear-to-br from-[#0F172A] to-[#020617] rounded-2xl p-6 shadow-lg text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Streak</h3>
        <span className="text-cyan-400 font-bold">
          🔥 {currentStreak} days
        </span>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 text-center text-xs text-slate-400 mb-2">
        {DAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-7 gap-2 text-sm">
        {/* Empty slots */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const active = isActiveDay(day);

          return (
            <div
              key={day}
              className={`w-8 h-8 flex items-center justify-center rounded-full
                ${
                  active
                    ? "bg-cyan-500 text-black font-semibold"
                    : "bg-slate-800 text-slate-400"
                }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between text-xs text-slate-400">
        <span>Longest streak</span>
        <span>{longestStreak} days</span>
      </div>
    </div>
  );
};

export default StreakCalendar;
