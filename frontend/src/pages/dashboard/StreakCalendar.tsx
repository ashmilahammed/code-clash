import React from "react";


interface StreakCalendarProps {
  currentStreak: number;
  longestStreak: number;
  activeDates?: string[]; // ISO strings
}

const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const StreakCalendar: React.FC<StreakCalendarProps> = ({
  currentStreak,
  longestStreak,
  activeDates = [],
}) => {
  const { days, firstDay } = getMonthDays();
  const activeSet = new Set(activeDates);

  return (
    <div className="bg-linear-to-br from-[#0F172A] to-[#020617] rounded-2xl p-6 shadow-lg text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg"> Streak</h3>
        <span className="text-cyan-400 font-bold">
          {currentStreak} days
        </span>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 text-center text-xs text-slate-400 mb-2">
        {WEEK_DAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 text-sm">
        {/* Empty slots before month starts */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Days */}
        {days.map(({ date, day }) => {
          const isActive = activeSet.has(date);

          return (
            <div
              key={date}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition
                ${
                  isActive
                    ? "bg-cyan-500 text-black font-semibold shadow-md"
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




const getMonthDays = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);
    return {
      day: i + 1,
      date: date.toISOString().split("T")[0],
    };
  });

  return { days, firstDay };
};


export default StreakCalendar;



