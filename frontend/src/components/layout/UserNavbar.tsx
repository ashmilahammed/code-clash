import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutApi } from "../../api/authApi";
import { useAuthStore } from "../../store/useAuthStore";
import { useSearchStore } from "../../store/useSearchStore";

import {
  Search,
  MessageSquare,
  Award,
  Bell,
  Check,
} from "lucide-react";
import {
  getUserNotificationsApi,
  markAsReadApi,
  markAllAsReadApi,
  clearNotificationsApi
} from "../../api/notificationApi";

import { formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";



function UserNavbar() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logoutUser = useAuthStore((state) => state.logoutUser);
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useSearchStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const isDashboard = location.pathname === "/dashboard";

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {

      // const res = await getUserNotificationsApi(1, 10);
      // setNotifications(res.data.data);
      // setUnreadCount(res.data.data.filter((n: any) => !n.isRead).length);

      const notifications = await getUserNotificationsApi(1, 10);

      setNotifications(notifications);
      setUnreadCount(
        notifications.filter((n: any) => !n.isRead).length
      );

    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsReadApi(id);
      setNotifications((prev: any[]) =>
        prev.map((n: any) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev: number) => Math.max(0, prev - 1));
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadApi();
      setNotifications((prev: any[]) => prev.map((n: any) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  const handleClear = async () => {
    try {
      await clearNotificationsApi();
      setNotifications([]);
      setUnreadCount(0);
      toast.success("Notifications cleared");
    } catch (err) {
      toast.error("Failed to clear notifications");
    }
  };



  const handleLogout = async () => {
    try {
      await logoutApi();

    } catch (err) {
      // even if API fails, we still clear session locally
      console.error("Logout failed", err);
    } finally {
      logoutUser();
      navigate("/login", { replace: true });
    }
  };


  return (
    <nav
      className="
        h-16 px-6
        flex items-center justify-between
        bg-linear-to-r from-[#020617] via-[#020617]/90 to-[#020617]
        backdrop-blur
        text-white
        fixed top-0 left-0 right-0 z-50
      "
    >
      {/* Left: App name */}
      <div
        className="
          font-bold text-lg tracking-wide
          bg-linear-to-r from-purple-400 via-pink-500 to-red-500
          bg-clip-text text-transparent
          transition duration-300
          hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]
          cursor-pointer
        "
        onClick={() => navigate("/dashboard")}
      >
        &lt;CODE-CLASH /&gt;
      </div>

      {/* Center: Search */}
      {isDashboard && (
        <div className="hidden md:flex flex-1 justify-center px-6">
          <div className="relative w-full max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-9 pr-4 py-2
                rounded-full
                bg-slate-800/70
                border border-slate-700
                text-sm text-white
                placeholder:text-slate-400
                focus:outline-none
                focus:ring-2 focus:ring-blue-500/40
              "
            />
          </div>
        </div>
      )}

      {/* Right: Icons + user */}
      <div className="flex items-center gap-4">
        {/* Chat */}
        <button
          className="p-2 rounded-full hover:bg-slate-800 transition"
          title="Chat"
          onClick={() => navigate("/messages")}
        >
          <MessageSquare size={18} />
        </button>

        {/* Badges */}
        <button
          className="p-2 rounded-full hover:bg-slate-800 transition"
          title="Leaderboard"
          onClick={() => navigate("/leaderboard")}
        >
          <Award size={18} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            className="relative p-2 rounded-full hover:bg-slate-800 transition"
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-[#020617]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              {/* Backdrop to close */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />

              <div className="absolute right-0 mt-2 w-80 bg-[#0f172a] border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">
                      {unreadCount} New
                    </span>
                  )}
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-slate-800/50">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-4 hover:bg-slate-800/40 transition cursor-default group relative ${!n.isRead ? 'bg-blue-900/10' : ''}`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                                <h4 className={`text-sm font-medium ${!n.isRead ? 'text-white' : 'text-slate-400'}`}>
                                  {n.title}
                                </h4>
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed">
                                {n.message}
                              </p>
                              <span className="text-[10px] text-slate-600 block pt-1">
                                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                              </span>
                            </div>

                            {!n.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(n.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-700 rounded transition text-blue-400"
                                title="Mark as read"
                              >
                                <Check size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center space-y-2">
                      <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-700">
                        <Bell size={20} />
                      </div>
                      <p className="text-sm text-slate-500">No notifications yet</p>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-900/50 border-t border-slate-800 flex justify-between items-center">
                  <div className="flex gap-3">
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-[11px] text-slate-400 hover:text-white transition"
                    >
                      Mark all as read
                    </button>
                    <span className="text-slate-700">|</span>
                    <button
                      onClick={handleClear}
                      className="text-[11px] text-slate-400 hover:text-red-400 transition"
                    >
                      Clear
                    </button>
                  </div>
                  {/* <button className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition">
                    View all <ExternalLink size={10} />
                  </button> */}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Info */}
        <div
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
          onClick={() => navigate("/profile")}
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=random`}
              alt={user?.username || "User"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Name & Rank */}
          <div className="flex flex-col leading-tight text-right">
            <span className="text-sm font-medium">
              {user?.username}
            </span>
            <span className="text-xs text-slate-400">
              Rank -
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-sm px-3 py-1 rounded bg-red-600 hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );


}

export default UserNavbar;







