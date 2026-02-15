const LevelManagement = () => {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Level Management</h1>

      <table className="w-full border border-slate-700">
        <thead className="bg-slate-800">
          <tr>
            <th className="p-2 border border-slate-700">Level</th>
            <th className="p-2 border border-slate-700">XP Range</th>
            <th className="p-2 border border-slate-700">Title</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="p-2 border border-slate-700 text-center">1</td>
            <td className="p-2 border border-slate-700 text-center">0 – 99</td>
            <td className="p-2 border border-slate-700 text-center">Beginner</td>
          </tr>

          <tr>
            <td className="p-2 border border-slate-700 text-center">2</td>
            <td className="p-2 border border-slate-700 text-center">100 – 249</td>
            <td className="p-2 border border-slate-700 text-center">Explorer</td>
          </tr>

          <tr>
            <td className="p-2 border border-slate-700 text-center">3</td>
            <td className="p-2 border border-slate-700 text-center">250 – 499</td>
            <td className="p-2 border border-slate-700 text-center">
              Intermediate
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LevelManagement;
