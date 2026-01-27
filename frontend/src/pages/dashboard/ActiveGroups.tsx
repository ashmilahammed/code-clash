import React from "react";
import { Users, Activity } from "lucide-react";

interface Group {
  id: string;
  name: string;
  members: number;
  active: boolean;
}

const MOCK_GROUPS: Group[] = [
  {
    id: "1",
    name: "DSA Warriors",
    members: 24,
    active: true,
  },
  {
    id: "2",
    name: "React Ninjas",
    members: 18,
    active: true,
  },
  {
    id: "3",
    name: "Backend Masters",
    members: 12,
    active: false,
  },
];

const ActiveGroups: React.FC = () => {
  return (
    <div className="mt-10 bg-linear-to-br from-[#0F172A] to-[#020617] rounded-2xl p-6 shadow-lg border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-semibold flex items-center gap-2">
          <Users size={20} />
          Active Groups
        </h3>
        <span className="text-xs text-slate-400">
          {MOCK_GROUPS.length} groups
        </span>
      </div>

      {/* Groups */}
      <div className="space-y-3">
        {MOCK_GROUPS.map((group) => (
          <div
            key={group.id}
            className="flex items-center justify-between
                       bg-slate-900/60 rounded-lg px-4 py-3
                       hover:bg-slate-900 transition"
          >
            <div>
              <p className="text-white font-medium">
                {group.name}
              </p>
              <p className="text-xs text-slate-400">
                {group.members} members
              </p>
            </div>

            <div className="flex items-center gap-2">
              {group.active ? (
                <span className="flex items-center gap-1 text-xs text-green-400">
                  <Activity size={14} />
                  Active
                </span>
              ) : (
                <span className="text-xs text-slate-500">
                  Inactive
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-4 text-right">
        <button
          className="text-sm text-cyan-400 hover:text-cyan-300 transition"
          onClick={() => {
            // later: navigate to groups page
            console.log("View all groups");
          }}
        >
          View all groups →
        </button>
      </div>
    </div>
  );
};

export default ActiveGroups;
