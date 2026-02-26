import { useState, useEffect } from "react";
import { Lock, Zap, CreditCard, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPublicPlansApi } from "../../api/planApi";
import { createOrderApi, verifyPaymentApi } from "../../api/transactionApi";
import type { Plan } from "../../api/planApi";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

const UpgradePremium = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await getPublicPlansApi();
            setPlans(res.data);
            if (res.data.length > 0) {
                setSelectedPlanId(res.data[0].id);
            }
        } catch (error) {
            toast.error("Failed to load premium plans");
        } finally {
            setLoading(false);
        }
    };

    const selectedPlan = plans.find((p) => p.id === selectedPlanId);

    const handlePayment = async () => {
        if (!selectedPlan) return;

        try {
            setLoading(true);

            // 1. Create Order
            const orderRes = await createOrderApi(selectedPlan.id);
            const order = orderRes.data;

            // 2. Initialize Razorpay options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Code-Clash Premium",
                description: `Upgrade to ${selectedPlan.name}`,
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await verifyPaymentApi({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            planId: selectedPlan.id
                        });

                        if (verifyRes.data.success) {
                            toast.success("Payment Successful! Welcome to Premium.");
                            // Elevate user state immediately
                            useAuthStore.getState().updateUser({ is_premium: true });
                            // Optionally navigate back to dashboard
                            navigate("/dashboard");
                        }
                    } catch (error: any) {
                        toast.error(error.response?.data?.message || "Payment verification failed.");
                    }
                },
                prefill: {
                    name: user?.username || "",
                    email: user?.email || "",
                },
                theme: {
                    color: "#3399cc"
                }
            };

            // 3. Open Razorpay Window
            const rzp = new window.Razorpay(options);

            rzp.on("payment.failed", function (response: any) {
                toast.error(`Payment failed: ${response.error.description}`);
            });

            rzp.open();

        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to initialize payment");
        } finally {
            setLoading(false);
        }
    };

    if (loading && plans.length === 0) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <p className="text-slate-400 text-sm animate-pulse">Loading Plans...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col items-center relative">

            {/* Back Button */}
            <button
                onClick={() => navigate("/dashboard")}
                className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-20 bg-slate-800/50 hover:bg-slate-800 px-4 py-2 rounded-lg border border-slate-700/50 backdrop-blur-sm"
            >
                <ArrowLeft size={18} />
                <span className="font-semibold text-sm tracking-wide">BACK</span>
            </button>

            {/* Header Banner */}
            <div className="w-full bg-linear-to-b from-indigo-500/20 to-transparent flex flex-col items-center pt-16 pb-32 text-center text-white relative">
                <Lock size={40} className="text-white mb-4" />
                <h1 className="text-4xl font-bold mb-3 tracking-wide">Upgrade to Premium</h1>
                <p className="text-slate-300 text-lg max-w-lg mb-8">
                    Unlock exclusive features and enhance your experience
                </p>
            </div>

            {/* Main Content Card Container */}
            <div className="max-w-5xl w-full -mt-24 px-4 pb-16 z-10 relative">
                <div className="bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col md:flex-row overflow-hidden">

                    {/* Left Column (Plan Selection) */}
                    <div className="md:w-[55%] p-8 border-r border-slate-700/50 flex flex-col gap-8">

                        {/* Payment Selection Overview */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-200 mb-4">Your Premium Selection</h2>
                            <div className="bg-[#0f172a] border border-slate-700 rounded-xl p-4 flex justify-between items-center transition-all hover:bg-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-slate-200 font-semibold text-sm">Payment via Razorpay</h4>
                                        <p className="text-slate-400 text-xs">Secure, fast processing</p>
                                    </div>
                                </div>
                                {selectedPlan && (
                                    <div className="text-right border-l border-slate-700 pl-4 py-1">
                                        <p className="text-[10px] text-slate-400 mb-0.5 uppercase tracking-wider font-semibold">Selected Plan</p>
                                        <p className="text-xl font-bold text-white leading-none">₹{selectedPlan.price}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">/{selectedPlan.duration} days</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Choose Plan Toggle Boxes */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-200 mb-4">Choose Your Plan</h2>
                            <div className="flex gap-4 mb-6">
                                {plans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        onClick={() => setSelectedPlanId(plan.id)}
                                        className={`cursor-pointer rounded-xl flex-1 text-center py-6 px-4 border ${selectedPlanId === plan.id
                                            ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                                            : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600'
                                            } transition-all`}
                                    >
                                        <h3 className="text-slate-300 font-medium mb-2">{plan.name}</h3>
                                        <div className="text-3xl font-bold text-white">₹{plan.price}</div>
                                        <div className="text-xs text-slate-400 mt-2">{plan.duration} days</div>
                                    </div>
                                ))}
                                {plans.length === 0 && (
                                    <div className="text-slate-400 text-sm">No plans available at this time.</div>
                                )}
                            </div>
                        </div>

                        {/* Premium Benefits List */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-200 mb-6">Plan Features</h2>
                            <div className="space-y-6">
                                {selectedPlan?.features && selectedPlan.features.length > 0 ? (
                                    selectedPlan.features.map((feature, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <Zap className="text-indigo-400 mt-0.5 shrink-0" size={20} />
                                            <div>
                                                <h4 className="text-white text-sm font-semibold mb-1">{feature}</h4>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-400 text-sm">No specific features listed for this plan.</p>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Checkout Info) */}
                    <div className="md:w-[45%] bg-[#1a2333] p-8 flex flex-col justify-between">
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-200 border-b border-slate-700/50 pb-4">Checkout Details</h2>

                            {/* User read-only Details */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Full Name</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={user?.username || ""}
                                        className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-300 focus:outline-hidden"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Email Address</label>
                                    <input
                                        type="email"
                                        readOnly
                                        value={user?.email || ""}
                                        className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-300 focus:outline-hidden"
                                    />
                                </div>
                            </div>

                            {/* Payment Method Details */}
                            <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-5 mt-6">
                                <h4 className="text-sm font-semibold text-white mb-2">Payment Method</h4>
                                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                    Secure payment processing via Razorpay. Your transaction is guarded with industry-standard bank-level encryption.
                                </p>
                                <button
                                    onClick={handlePayment}
                                    disabled={!selectedPlan}
                                    className="w-full bg-[#3399cc] hover:bg-[#2884b6] text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition-all shadow-lg shadow-cyan-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CreditCard size={18} /> Pay with Razorpay
                                </button>
                                <div className="flex items-center justify-center gap-2 text-slate-500 mt-4 text-[10px]">
                                    <Lock size={12} /> Secure payment powered by Razorpay
                                </div>
                            </div>

                        </div>

                        {/* Order Summary Float Bottom */}
                        <div className="border-t border-slate-700/50 pt-5 mt-8">
                            <h4 className="text-sm font-semibold text-white mb-4">Order Summary</h4>
                            <div className="flex justify-between items-center text-sm text-slate-400 mb-2">
                                <span>Plan:</span>
                                <span className="text-slate-200">{selectedPlan?.name || "-"}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-slate-400 mb-4">
                                <span>Duration:</span>
                                <span className="text-slate-200">{selectedPlan ? `${selectedPlan.duration} days` : "-"}</span>
                            </div>
                            <div className="flex justify-between items-center font-bold text-lg text-white pt-3 border-t border-slate-700/50">
                                <span>Total:</span>
                                <span>₹{selectedPlan?.price || 0}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpgradePremium;
