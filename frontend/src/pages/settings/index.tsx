import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Lock, Bell, CreditCard, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import SecuritySettings from "./SecuritySettings";

import PremiumManagement from "./PremiumManagement";

const Settings = () => {
  const navigate = useNavigate();
  const logoutUser = useAuthStore((s) => s.logoutUser);
  const [activeTab, setActiveTab] = useState("security");

  const handleLogout = () => {
    logoutUser();
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-[#0B1221] text-white flex flex-col font-sans">
      
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-white/5 bg-linear-to-r from-blue-900/60 via-indigo-900/40 to-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <button 
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 bg-[#1E293B] hover:bg-[#283548] px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm border border-white/10"
        >
          <ChevronLeft size={16} />
          BACK
        </button>
        <div className="flex items-center gap-3 ml-6 text-xl font-semibold">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          Settings
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-10 flex gap-8">
        
        {/* Sidebar */}
        <div className="w-64 shrink-0 hidden md:block">
          <div className="bg-[#131B2D] border border-white/5 rounded-2xl overflow-hidden p-3 shadow-xl">
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition font-medium ${activeTab === 'security' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-3">
                  <Lock size={18} />
                  Security
                </div>
                {activeTab === 'security' && <ChevronLeft size={16} className="rotate-180" />}
              </button>

              <button 
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition font-medium ${activeTab === 'notifications' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-3">
                  <Bell size={18} />
                  Notifications
                </div>
                {activeTab === 'notifications' && <ChevronLeft size={16} className="rotate-180" />}
              </button>

              <button 
                onClick={() => setActiveTab("premium")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition font-medium ${activeTab === 'premium' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard size={18} />
                  Premium
                </div>
                {activeTab === 'premium' && <ChevronLeft size={16} className="rotate-180" />}
              </button>
            </nav>

            <div className="h-px bg-white/5 my-3"></div>

            <button 
                onClick={handleLogout}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition font-medium text-red-400 hover:bg-white/5`}
              >
                <div className="flex items-center gap-3">
                  <LogOut size={18} />
                  Logout
                </div>
              </button>

          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#131B2D] border border-white/5 rounded-2xl shadow-xl p-8">
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "notifications" && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Bell size={48} className="mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2 text-white">Notifications Settings</h2>
              <p>Coming soon...</p>
            </div>
          )}
          {activeTab === "premium" && <PremiumManagement />}
        </div>

      </div>
    </div>
  );
};

export default Settings;
