
import { useNavigate } from "react-router-dom";
import type { ChallengeDifficulty } from "../../types/Challenge";

interface MockChallenge {
    id: string;
    title: string;
    description: string;
    difficulty: ChallengeDifficulty;
    xpReward: number;
}

const difficultyColor: Record<ChallengeDifficulty, string> = {
    easy: "text-green-400",
    medium: "text-yellow-400",
    hard: "text-red-400",
};

// Static mock data
const MOCK_CHALLENGES: MockChallenge[] = [
    {
        id: "1",
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        difficulty: "easy",
        xpReward: 50,
    },
    {
        id: "2",
        title: "Reverse Linked List",
        description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
        difficulty: "easy",
        xpReward: 50,
    },
    {
        id: "3",
        title: "Longest Substring Without Repeating Characters",
        description: "Given a string s, find the length of the longest substring without repeating characters.",
        difficulty: "medium",
        xpReward: 100,
    },
    {
        id: "4",
        title: "Median of Two Sorted Arrays",
        description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
        difficulty: "hard",
        xpReward: 150,
    }
];

const LandingChallengeList = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#020617] rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">
                Available Challenges
            </h2>

            {MOCK_CHALLENGES.map((challenge) => (
                <div
                    key={challenge.id}
                    className="p-4 rounded-lg bg-[#0F172A] border border-slate-800 hover:border-slate-700 transition"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-white">
                            {challenge.title}
                        </h3>

                        <span
                            className={`text-xs font-semibold uppercase ${difficultyColor[challenge.difficulty]
                                }`}
                        >
                            {challenge.difficulty}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                        {challenge.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>XP: {challenge.xpReward}</span>

                        <button
                            onClick={() => navigate("/auth/login")}
                            className="px-3 py-1 rounded bg-cyan-600 text-black hover:bg-cyan-500 transition"
                        >
                            Open
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LandingChallengeList;
