import { useEffect, useState } from 'react';
import { ShieldCheck, Eye, Ban, X, Loader2, MessageSquare } from 'lucide-react';
import { getAllReports, banUser, dismissReport, getReportedMessage } from '../../../api/reportApi';
import toast from 'react-hot-toast';

interface Report {
    id: string;
    reportedUserId: { id: string, username: string };
    reportedById: { id: string, username: string };
    reason: string;
    messageId: string;
    createdAt: string;
    status: 'pending' | 'dismissed' | 'resolved';
}

const ReportManagement = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [showBanModal, setShowBanModal] = useState(false);
    const [userToBan, setUserToBan] = useState<{ id: string, reportId: string } | null>(null);
    const [banDuration, setBanDuration] = useState(1);
    const [banReason, setBanReason] = useState('Spam in chat');
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Pagination and Filter State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReports, setTotalReports] = useState(0);
    const [statusFilter, setStatusFilter] = useState('all');
    const LIMIT = 8;

    useEffect(() => {
        fetchReports();
    }, [currentPage, statusFilter]);

    const fetchReports = async () => {
        try {
            setIsLoading(true);
            const res = await getAllReports({
                page: currentPage,
                limit: LIMIT,
                // status: statusFilter 
                status: statusFilter === "all" ? undefined : statusFilter
            });


            // setReports(res.data);
            // setTotalPages(res.totalPages);
            // setTotalReports(res.total);

            setReports(res.data || []);
            setTotalPages(Math.ceil((res.total || 0) / LIMIT) || 1);
            setTotalReports(res.total || 0);

        } catch (error) {
            toast.error("Failed to fetch reports");
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewMessage = async (messageId: string) => {
        try {
            setIsActionLoading(true);
            const message = await getReportedMessage(messageId);
            setSelectedMessage(message);
        } catch (error) {
            toast.error("Failed to fetch message details");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDismissReport = async (reportId: string) => {
        try {
            setIsActionLoading(true);
            await dismissReport(reportId);
            toast.success("Report dismissed");
            fetchReports();
        } catch (error) {
            toast.error("Failed to dismiss report");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleBanUser = async () => {
        if (!userToBan) return;
        try {
            setIsActionLoading(true);
            await banUser({
                userId: userToBan.id,
                days: banDuration,
                reason: banReason,
                reportId: userToBan.reportId
            });
            toast.success("User banned successfully");
            setShowBanModal(false);
            fetchReports();
        } catch (error) {
            toast.error("Failed to ban user");
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <div className="p-8 bg-[#0B1220] min-h-screen text-slate-200">
            <div className="mb-8 flex items-center justify-between">
                <p className="text-slate-400 mt-1">
                    Total Reports: {totalReports}
                </p>
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <ShieldCheck className="text-blue-500" />
                        Report Management
                    </h1>
                    <p className="text-slate-400 mt-1">Manage user reports and enforce community guidelines</p>
                </div>
                <div className="flex items-center gap-2 bg-[#141C2F] p-1 rounded-lg border border-slate-800">
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="bg-transparent border-none text-sm text-slate-300 focus:ring-0 cursor-pointer px-3"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                        <option value="dismissed">Dismissed</option>
                    </select>
                </div>
            </div>

            <div className="bg-[#141C2F] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Report ID</th>
                                <th className="px-6 py-4">Reported User</th>
                                <th className="px-6 py-4">Reported By</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        <Loader2 className="animate-spin mx-auto mb-2 text-blue-500" />
                                        Loading reports...
                                    </td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        No reports found
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report: Report) => (
                                    <tr key={report.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-400">#RID{report.id.slice(-4).toUpperCase()}</td>
                                        <td className="px-6 py-4 font-medium text-slate-200">{report.reportedUserId?.username || 'Unknown'}</td>
                                        <td className="px-6 py-4 text-slate-400">{report.reportedById?.username || 'Unknown'}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase rounded-md border border-yellow-500/20">
                                                {report.reason}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md border ${report.status === 'pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                                report.status === 'resolved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                }`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleViewMessage(report.messageId)}
                                                    className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                                    title="View Message"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                {report.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setUserToBan({ id: report.reportedUserId.id, reportId: report.id });
                                                                setShowBanModal(true);
                                                            }}
                                                            className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                            title="Ban User"
                                                        >
                                                            <Ban size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDismissReport(report.id)}
                                                            className="p-1.5 text-slate-400 hover:bg-slate-400/10 rounded-lg transition-colors"
                                                            title="Dismiss Report"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-slate-800 flex items-center justify-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-50 hover:bg-slate-700 transition"
                        >
                            Previous
                        </button>
                        <span className="text-slate-400 text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-50 hover:bg-slate-700 transition"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* View Message Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#141C2F] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#1A2338]">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <MessageSquare size={18} className="text-blue-500" />
                                Message Content
                            </h3>
                            <button onClick={() => setSelectedMessage(null)} className="text-slate-400 hover:text-white transition">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="bg-[#0B1220] p-4 rounded-xl border border-slate-800 text-slate-300 text-sm leading-relaxed mb-6">
                                {selectedMessage.messageType === 'image' && selectedMessage.mediaUrl ? (
                                    <div className="flex flex-col gap-4">
                                        <img src={selectedMessage.mediaUrl} alt="Reported content" className="max-w-full h-auto rounded-lg border border-slate-800 shadow-lg" />
                                        <p className="text-slate-500 italic">Caption/Content: {selectedMessage.content}</p>
                                    </div>
                                ) : (
                                    selectedMessage.content
                                )}
                            </div>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="w-full px-4 py-2.5 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Ban Modal */}
            {showBanModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#141C2F] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#1A2338]">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Ban size={18} className="text-red-500" />
                                Ban User
                            </h3>
                            <button onClick={() => setShowBanModal(false)} className="text-slate-400 hover:text-white transition">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Duration</label>
                                    <select
                                        value={banDuration}
                                        onChange={(e) => setBanDuration(Number(e.target.value))}
                                        className="w-full bg-[#0B1220] border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    >
                                        <option value={1}>1 Day</option>
                                        <option value={3}>3 Days</option>
                                        <option value={7}>7 Days</option>
                                        <option value={30}>30 Days</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Reason</label>
                                    <textarea
                                        value={banReason}
                                        onChange={(e) => setBanReason(e.target.value)}
                                        className="w-full bg-[#0B1220] border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none h-24 resize-none"
                                        placeholder="e.g. Spamming in chat..."
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowBanModal(false)}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBanUser}
                                    disabled={isActionLoading}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
                                >
                                    {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Ban'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportManagement;
