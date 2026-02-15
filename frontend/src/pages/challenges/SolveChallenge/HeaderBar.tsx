// const HeaderBar = ({ challenge }: any) => {
//   return (
//     <div className="px-6 py-3 border-b border-slate-800 bg-[#0f172a]">
//       <h1 className="text-lg font-semibold">
//         {challenge.title}
//       </h1>

//       <div className="text-sm text-slate-400">
//         {challenge.difficulty.toUpperCase()} • XP {challenge.xpReward}
//       </div>
//     </div>
//   );
// };

// export default HeaderBar;



const HeaderBar = ({ challenge }: any) => {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-[#0f172a] border-b border-slate-800">

      {/* LEFT SIDE */}
      <div>
        <h1 className="text-lg font-semibold">
          {challenge.title}
        </h1>
        <div className="text-sm text-slate-400">
          {challenge.difficulty.toUpperCase()} • XP {challenge.xpReward}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6 text-sm text-slate-400">
        <span>👥 215 Solvers</span>
        <span>📊 41% Success</span>

        <button className="bg-indigo-600 hover:bg-indigo-500 transition px-3 py-1 rounded text-white">
          Hint
        </button>
      </div>

    </div>
  );
};

export default HeaderBar;
