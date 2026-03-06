import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminChallengesApi,
  toggleChallengeStatusApi,
} from "../../../api/challengeApi";
import ConfirmModal from "../../../components/modals/ConfirmModal";

import type { Challenge } from "../../../types/Challenge";

const ChallengeManagement = () => {
  const navigate = useNavigate();

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [challengeToToggle, setChallengeToToggle] = useState<{ id: string; isActive: boolean } | null>(null);

  // pagination 
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);


  const fetchChallenges = async () => {
    try {
      setLoading(true);

      const res = await getAdminChallengesApi({
        page,
        limit,
      });

      setChallenges(res.data);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error("Failed to load challenges", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [page]);

  const handleToggleClick = (id: string, isActive: boolean) => {
    setChallengeToToggle({ id, isActive });
    setIsConfirmModalOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (!challengeToToggle) return;

    const { id, isActive } = challengeToToggle;

    try {
      setTogglingId(id);
      await toggleChallengeStatusApi(id, !isActive);
      await fetchChallenges();
    } catch (err) {
      console.error("Failed to toggle challenge status", err);
    } finally {
      setTogglingId(null);
      setIsConfirmModalOpen(false);
      setChallengeToToggle(null);
    }
  };

  const cancelToggleStatus = () => {
    setIsConfirmModalOpen(false);
    setChallengeToToggle(null);
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">
          Challenge Management
        </h1>

        <button
          onClick={() => navigate("/admin/challenges/create")}
          className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-700 transition"
        >
          + Create New Challenge
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-xl p-6">
        {loading ? (
          <p className="text-slate-400">Loading challenges…</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-700">
                <th className="pb-3">Title</th>
                <th className="pb-3">Difficulty</th>
                <th className="pb-3">XP</th>
                <th className="pb-3">Premium</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {challenges.map((c) => (
                <tr key={c.id} className="border-b border-slate-800">
                  <td className="py-3 text-white">
                    <div className="font-medium">{c.title}</div>
                    <div className="text-xs text-slate-400 truncate max-w-md">
                      {c.description}
                    </div>
                  </td>

                  <td className="py-3 text-slate-300 capitalize">
                    {c.difficulty}
                  </td>

                  <td className="py-3 text-slate-300">
                    {c.xpReward} XP
                  </td>

                  <td className="py-3">
                    {c.isPremium ? (
                      <span className="text-yellow-400">Premium</span>
                    ) : (
                      <span className="text-slate-400">Free</span>
                    )}
                  </td>

                  <td className="py-3">
                    {c.isActive ? (
                      <span className="text-green-400">Active</span>
                    ) : (
                      <span className="text-red-400">Inactive</span>
                    )}
                  </td>

                  <td className="py-3 text-right space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/challenges/edit/${c.id}`)
                      }
                      className={`px-3 py-1 rounded text-sm transition ${c.status === 'draft'
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                    >
                      {c.status === 'draft' ? "Resume Draft" : "Edit"}
                    </button>

                    <button
                      disabled={togglingId === c.id}
                      onClick={() => handleToggleClick(c.id!, c.isActive)}
                      className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sm disabled:opacity-50"
                    >
                      {c.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}

              {challenges.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 text-center text-slate-400"
                  >
                    No challenges found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-3 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-slate-800 text-white rounded disabled:opacity-40 hover:bg-slate-700 transition"
        >
          Prev
        </button>

        <span className="text-slate-400 text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-slate-800 text-white rounded disabled:opacity-40 hover:bg-slate-700 transition"
        >
          Next
        </button>
      </div>

      <ConfirmModal
        open={isConfirmModalOpen}
        title={challengeToToggle?.isActive ? "Deactivate Challenge" : "Activate Challenge"}
        message={
          challengeToToggle?.isActive
            ? "Are you sure you want to deactivate this challenge? Users will no longer be able to see or attempt it."
            : "Are you sure you want to activate this challenge? It will become visible to all users."
        }
        confirmText={challengeToToggle?.isActive ? "Deactivate" : "Activate"}
        onConfirm={confirmToggleStatus}
        onCancel={cancelToggleStatus}
      />
    </div>
  );
};

export default ChallengeManagement;











