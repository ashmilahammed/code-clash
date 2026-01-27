import React from "react";
import { Crown, Zap, Lock } from "lucide-react";

const PremiumBanner: React.FC = () => {
  return (
    <div className="mt-10 w-full bg-linear-to-r from-[#1E293B] to-[#020617] rounded-2xl p-6 shadow-lg border border-slate-700">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-yellow-400/10 rounded-full">
          <Crown className="text-yellow-400" size={22} />
        </div>
        <h3 className="text-white text-lg font-semibold">
          Unlock Premium Features
        </h3>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-3 text-slate-300 text-sm">
          <Zap className="text-cyan-400" size={18} />
          <span>Gain XP Faster</span>
        </div>

        <div className="flex items-center gap-3 text-slate-300 text-sm">
          <Lock className="text-purple-400" size={18} />
          <span>Exclusive Domains</span>
        </div>

        <div className="flex items-center gap-3 text-slate-300 text-sm">
          <Crown className="text-yellow-400" size={18} />
          <span>Priority Challenges</span>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-end">
        <button
          className="px-6 py-2 rounded-lg bg-linear-to-r from-purple-500 to-cyan-500
                     text-white font-medium shadow-md hover:opacity-90 transition"
          onClick={() => {
            // later: navigate to pricing / checkout
            console.log("Upgrade clicked");
          }}
        >
          Upgrade to Premium
        </button>
      </div>
    </div>
  );
};

export default PremiumBanner;
