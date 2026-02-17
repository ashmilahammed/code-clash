import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { getAllLevels, createLevel, updateLevel, deleteLevel } from "../../../api/levelApi"; 
import { getAllBadges } from "../../../api/badgeApi"; 
import LevelModal from "../../../components/modals/LevelModal"; 
import ConfirmModal from "../../../components/modals/ConfirmModal"; 
import type { Level, Badge } from "../../../types/Level";



const LevelManagement = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [levelToDelete, setLevelToDelete] = useState<string | null>(null);


  const fetchData = async () => {
    try {
      const [levelsData, badgesData] = await Promise.all([
        getAllLevels(),
        getAllBadges(),
      ]);
     
      setLevels(levelsData.data || []);
      setBadges(badgesData.data || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);


  const handleSave = async (data: any) => {
    if (currentLevel) {
      await updateLevel(currentLevel.id, data);
    } else {
      await createLevel(data);
    }
    fetchData(); // Refresh list
    setIsModalOpen(false);
    setCurrentLevel(null);
  };


  const handleEdit = (level: Level) => {
    setCurrentLevel(level);
    setIsModalOpen(true);
  };


  const handleDeleteClick = (id: string) => {
    setLevelToDelete(id);
    setIsDeleteModalOpen(true);
  };


  const handleConfirmDelete = async () => {
    if (levelToDelete) {
      try {
        await deleteLevel(levelToDelete);
        fetchData();
      } catch (error) {
        console.error("Failed to delete level", error);
      }
      setIsDeleteModalOpen(false);
      setLevelToDelete(null);
    }
  };


  const getBadgeName = (badgeId?: string) => {
    if (!badgeId) return "-";
    const badge = badges.find((b) => (b.id === badgeId) || (b._id === badgeId));
    return badge ? badge.name : "Unknown Badge";
  };

  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Level Management</h1>
        <button
          onClick={() => {
            setCurrentLevel(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} />
          Add New Level
        </button>
      </div>

      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
            <tr>
              <th className="p-4">Level</th>
              <th className="p-4">XP Range</th>
              <th className="p-4">Title</th>
              <th className="p-4">Badge</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {levels.map((level) => (
              <tr key={level.id || level.levelNumber} className="hover:bg-slate-800/50 transition">
                <td className="p-4 font-medium text-white">
                  <span className="bg-indigo-500/20 text-indigo-400 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold">
                    {level.levelNumber}
                  </span>
                </td>
                <td className="p-4 text-slate-300">
                  {level.minXp} - {level.maxXp} XP
                </td>
                <td className="p-4 text-slate-300 font-medium">
                  {level.title || "-"}
                </td>
                <td className="p-4 text-slate-300">
                  {getBadgeName(level.badgeId)}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(level)}
                      className="text-slate-400 hover:text-blue-400 transition p-1"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(level.id)}
                      className="text-slate-400 hover:text-red-400 transition p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {levels.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No levels found. Create your first level!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <LevelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={currentLevel}
        badges={badges}
      />

      <ConfirmModal
        open={isDeleteModalOpen}
        title="Delete Level"
        message="Are you sure you want to delete this level? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default LevelManagement;
