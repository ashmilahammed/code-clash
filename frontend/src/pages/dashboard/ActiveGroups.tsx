import React, { useEffect } from "react";
import { Users, Activity } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useNavigate } from "react-router-dom";

const ActiveGroups: React.FC = () => {
  const { conversations, fetchConversations } = useChatStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const groups = conversations.filter((c) => c.type === "group").slice(0, 3);

  return (
    <div className="mt-10 bg-linear-to-br from-[#0F172A] to-[#020617] rounded-2xl p-6 shadow-lg border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-semibold flex items-center gap-2">
          <Users size={20} />
          Active Groups
        </h3>
        <span className="text-xs text-slate-400">
          {groups.length} groups
        </span>
      </div>

      {/* Groups */}
      <div className="space-y-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="flex items-center justify-between
                       bg-slate-900/60 rounded-lg px-4 py-3
                       hover:bg-slate-900 transition cursor-pointer"
            onClick={() => navigate('/messages')}
          >
            <div>
              <p className="text-white font-medium">
                {group.name}
              </p>
              <p className="text-xs text-slate-400">
                {group.participants.length} members
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-green-400">
                <Activity size={14} />
                Active
              </span>
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <p className="text-sm text-slate-500">No active groups joined.</p>
        )}
      </div>

      {/* Footer CTA */}
      <div className="mt-4 text-right">
        <button
          className="text-sm text-cyan-400 hover:text-cyan-300 transition"
          onClick={() => navigate('/messages')}
        >
          View all groups →
        </button>
      </div>
    </div>
  );
};

export default ActiveGroups;
