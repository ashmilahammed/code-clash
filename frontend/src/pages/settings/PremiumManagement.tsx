import { useState, useEffect } from "react";
import { CreditCard, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyTransactionsApi, getCurrentPlanApi } from "../../api/transactionApi";
import { cancelPremiumApi } from "../../api/userApi";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

const PremiumManagement = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 5; // Showing 5 per page for settings view

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [planData, historyData] = await Promise.all([
          getCurrentPlanApi(),
          getMyTransactionsApi(page, LIMIT)
        ]);
        setCurrentPlan(planData);
        setHistory(historyData.data);
        setTotalCount(historyData.total);
      } catch (error) {
        console.error("Failed to load premium data", error);
        toast.error("Failed to load premium details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  const totalPages = Math.ceil(totalCount / LIMIT);

  const handleCancelPremium = async () => {
    try {
      setIsCancelling(true);
      await cancelPremiumApi();
      toast.success("Premium membership cancelled successfully");
      updateUser({ is_premium: false, premium_expiry_date: null });
      setCurrentPlan(null); // Clear current plan out
      setShowCancelModal(false);
    } catch (error) {
      console.error("Failed to cancel premium", error);
      toast.error("Failed to cancel premium membership.");
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-4"></div>
        <p>Loading premium details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-slate-200">
      
      {/* Current Plan Card */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
          <CreditCard size={20} className="text-indigo-400" />
          Premium Membership
        </h2>

        {user?.is_premium && user.premium_expiry_date ? (
          <div className="bg-linear-to-br from-indigo-900/40 to-[#1e1b4b] border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
            
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-amber-500/20 rounded-full text-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-amber-500 mb-1">
                    {currentPlan?.plan?.name || "Premium Plan"}
                  </h3>
                  <div className="text-slate-300 text-sm flex items-center gap-2">
                    {currentPlan?.plan?.price ? `${currentPlan.plan.price} Rs / ${currentPlan.plan.duration} days` : "Price not found"} 
                    <span className="w-1 h-1 bg-slate-500 rounded-full"></span> 
                    Active until <span className="font-semibold text-white">{formatDate(user.premium_expiry_date)}</span>
                  </div>
                </div>
              </div>

              {currentPlan?.plan?.features && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {currentPlan.plan.features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 bg-black/20 p-3 rounded-lg border border-white/5">
                      <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-4 mt-6 border-t border-white/10 pt-6">
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-lg text-sm font-medium transition"
                >
                  Cancel Membership
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-emerald-500/20 ml-auto"
                >
                  Upgrade Membership
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-8 text-center">
            <div className="inline-flex p-4 bg-slate-800 rounded-full text-slate-400 mb-4">
              <CreditCard size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Active Subscription</h3>
            <p className="text-slate-400 mb-6 max-w-sm mx-auto">
              Upgrade to premium to unlock exclusive features, unlimited challenges, and performance boosts.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition shadow-lg shadow-indigo-500/20"
            >
              Explore Premium Plans
            </button>
          </div>
        )}
      </div>

      {/* Membership History */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Membership History</h3>
        
        {history.length > 0 ? (
          <div className="space-y-4">
            <div className="bg-[#1E293B] border border-white/5 rounded-2xl overflow-hidden">
              {history.map((tx: any, idx: number) => (
                <div 
                  key={tx.id} 
                  className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${idx !== history.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">{tx.plan?.name || "Premium Plan"}</span>
                      {idx === 0 && page === 1 && user?.is_premium && (
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium">Active</span>
                      )}
                    </div>
                    <div className="text-sm text-slate-400 flex items-center gap-2">
                      <Clock size={14} />
                      {formatDate(tx.date)}
                    </div>
                    {tx.paymentMethod && (
                      <div className="text-xs text-slate-500 mt-2">
                        Order ID: {tx.id.slice(-8)} • <span className="text-emerald-500">✓ pay_{tx.paymentMethod}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="font-medium text-emerald-400">{tx.amount} Rs</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-2">
                <div className="text-sm text-slate-500">
                  Showing <span className="text-slate-300">{(page - 1) * LIMIT + 1}</span> to <span className="text-slate-300">{Math.min(page * LIMIT, totalCount)}</span> of <span className="text-slate-300">{totalCount}</span> results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1 mx-2">
                    <span className="text-sm text-slate-300 font-medium">{page}</span>
                    <span className="text-sm text-slate-500">/</span>
                    <span className="text-sm text-slate-500">{totalPages}</span>
                  </div>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-8 bg-[#1E293B] border border-white/5 rounded-2xl text-slate-500">
            No transaction history found.
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flexItems-center justify-center p-4">
          <div className="bg-[#131B2D] border border-white/10 rounded-2xl max-w-md w-full p-6 mx-auto mt-20 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Cancel Membership?</h3>
            <p className="text-slate-400 mb-6">
              Are you sure you want to cancel your premium membership? You will lose access to all premium features immediately.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 hover:bg-white/5 text-slate-300 rounded-lg transition"
                disabled={isCancelling}
              >
                Keep Premium
              </button>
              <button
                onClick={handleCancelPremium}
                disabled={isCancelling}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition flex items-center gap-2"
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PremiumManagement;
