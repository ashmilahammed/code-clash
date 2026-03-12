import { useState, useEffect } from "react";
import { 
  Send, 
  History, 
  Users, 
  Search, 
  // Filter, 
  // ChevronRight, 
  // Copy,
  Clock
} from "lucide-react";
import { 
  sendNotificationApi, 
  getAdminNotificationHistoryApi 
} from "../../../api/notificationApi";
import { toast } from "react-hot-toast";

const NotificationManagement = () => {
  const [activeTab, setActiveTab] = useState<"compose" | "history">("compose");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [recipientType, setRecipientType] = useState<"all" | "normal" | "premium">("all");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab, page]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await getAdminNotificationHistoryApi(page, 10);
      setHistory(res.data.data);
      setTotalPages(Math.ceil(res.data.total / 10));
    } catch (err) {
      toast.error("Failed to fetch notification history");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!title || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await sendNotificationApi({ title, message, recipientType });
      toast.success("Notification sent successfully");
      setTitle("");
      setMessage("");
      setRecipientType("all");
    } catch (err) {
      toast.error("Failed to send notification");
    } finally {
      setLoading(false);
    }
  };


  return (
    // <div className="p-6 bg-[#020617] min-h-screen text-slate-200">
    <div className="p-6 bg-[#0B1220] min-h-screen text-slate-200">
      
      <div className="flex items-center gap-4 mb-8">
        <div className="flex bg-slate-900 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("compose")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
              activeTab === "compose" ? "bg-blue-600 text-white" : "hover:bg-slate-800"
            }`}
          >
            <Send size={18} />
            Compose
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
              activeTab === "history" ? "bg-blue-600 text-white" : "hover:bg-slate-800"
            }`}
          >
            <History size={18} />
            History
          </button>
        </div>
      </div>

      {activeTab === "compose" ? (
        <div className="max-w-4xl space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Notification Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter an attention-grabbing title..."
              className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Notification Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Compose your notification message here..."
              rows={6}
              className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Recipients</label>
            <div className="relative">
              <select
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value as any)}
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-10 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">All Users</option>
                <option value="normal">Normal Users</option>
                <option value="premium">Premium Users</option>
              </select>
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition">
              Save Draft
            </button>
            <button
              onClick={handleSend}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition disabled:opacity-50"
            >
              <Send size={18} />
              {loading ? "Sending..." : "Send Notification"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
             <div className="relative w-96">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search notifications..." 
                  className="w-full bg-[#0f172a] border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                />
             </div>
             {/* <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition text-slate-400">
               <Filter size={16} />
               Filter
             </button> */}
          </div>

          <div className="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-slate-800/50 text-slate-400 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Title</th>
                    <th className="px-6 py-4 font-semibold">Recipients</th>
                    <th className="px-6 py-4 font-semibold">Sent</th>
                    {/* <th className="px-6 py-4 font-semibold text-right">Actions</th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-200">{item.title}</div>
                        <div className="text-xs text-slate-500 truncate max-w-xs">{item.message}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-400 capitalize">{item.recipientType} Users</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Clock size={14} />
                          {new Date(item.createdAt).toLocaleString()}
                        </div>
                      </td>
                      {/* <td className="px-6 py-4">
                        <div className="flex justify-end gap-3 text-slate-400">
                          <button className="hover:text-blue-400 transition" title="View details">
                             <ChevronRight size={18} />
                          </button>
                          <button className="hover:text-blue-400 transition" title="Duplicate">
                             <Copy size={16} />
                          </button>
                        </div>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-6">
             <button 
               disabled={page === 1}
               onClick={() => setPage(p => Math.max(1, p - 1))}
               className="px-3 py-1 bg-slate-800 rounded hover:bg-slate-700 disabled:opacity-50"
             >
               &lt;
             </button>
             {[...Array(totalPages)].map((_, i) => (
               <button 
                 key={i}
                 onClick={() => setPage(i + 1)}
                 className={`px-3 py-1 rounded transition ${page === i + 1 ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}
               >
                 {i + 1}
               </button>
             ))}
             <button 
               disabled={page === totalPages}
               onClick={() => setPage(p => Math.min(totalPages, p + 1))}
               className="px-3 py-1 bg-slate-800 rounded hover:bg-slate-700 disabled:opacity-50"
             >
               &gt;
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationManagement;
