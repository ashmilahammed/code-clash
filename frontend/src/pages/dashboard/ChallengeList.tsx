import React from "react";
import { Lock } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  duration: number;
  successRate: number;
  isPremium: boolean;
}

const MOCK_CHALLENGES: Challenge[] = [
  {
    id: "1",
    title: "Syntax Labyrinth",
    description: "Navigate through a maze of broken code.",
    difficulty: "easy",
    duration: 20,
    successRate: 64,
    isPremium: false,
  },
  {
    id: "2",
    title: "Syntax Labyrinth",
    description: "Navigate through a maze of broken code.",
    difficulty: "medium",
    duration: 20,
    successRate: 64,
    isPremium: false,
  },
  {
    id: "3",
    title: "Syntax Labyrinth",
    description: "Navigate through a maze of broken code.",
    difficulty: "hard",
    duration: 20,
    successRate: 18,
    isPremium: true,
  },
  {
    id: "4",
    title: "Two Sum",
    description: "Navigate through a maze of Linked List.",
    difficulty: "medium",
    duration: 20,
    successRate: 64,
    isPremium: false,
  },
];

const difficultyStyles = {
  easy: "bg-green-500/10 text-green-400",
  medium: "bg-yellow-500/10 text-yellow-400",
  hard: "bg-red-500/10 text-red-400",
};

const ChallengeList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {MOCK_CHALLENGES.map((challenge) => (
        <div
          key={challenge.id}
          className="relative bg-linear-to-br from-[#0F172A] to-[#020617]
                     rounded-2xl p-5 shadow-lg border border-slate-800"
        >
          {/* Difficulty + Duration */}
          <div className="flex items-center justify-between mb-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium
                ${difficultyStyles[challenge.difficulty]}`}
            >
              {challenge.difficulty.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400">
              {challenge.duration} min
            </span>
          </div>

          {/* Title */}
          <h3 className="text-white font-semibold text-lg mb-1">
            {challenge.title}
          </h3>

          {/* Description */}
          <p className="text-slate-400 text-sm mb-4">
            {challenge.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
            <span>Success rate</span>
            <span>{challenge.successRate}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-cyan-400"
              style={{ width: `${challenge.successRate}%` }}
            />
          </div>

          {/* Action */}
          {challenge.isPremium ? (
            <button
              className="w-full flex items-center justify-center gap-2
                         py-2 rounded-lg bg-slate-800 text-slate-400
                         cursor-not-allowed"
            >
              <Lock size={16} />
              Premium Domain
            </button>
          ) : (
            <button
              className="w-full py-2 rounded-lg bg-linear-to-r
                         from-purple-500 to-cyan-500 text-white
                         font-medium hover:opacity-90 transition"
            >
              Enter Domain
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChallengeList;
