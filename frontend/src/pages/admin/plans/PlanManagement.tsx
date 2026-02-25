import { useState, useEffect } from "react";
import { CreditCard, IndianRupee, Users } from "lucide-react";
import toast from "react-hot-toast";

import { getPlansApi, getTransactionsApi, createPlanApi, updatePlanApi, deletePlanApi } from "../../../api/planApi";
import type { Plan, Transaction } from "../../../api/planApi";
import PlanTable from "./components/PlanTable";
import TransactionTable from "./components/TransactionTable";
import PlanModal from "./components/PlanModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

const PlanManagement = () => {
    const [activeTab, setActiveTab] = useState<"plans" | "transactions">("plans");
    const [plans, setPlans] = useState<Plan[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [planToEdit, setPlanToEdit] = useState<Plan | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);

    useEffect(() => {
        fetchPlans();
        fetchTransactions();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await getPlansApi();
            setPlans(res.data);
        } catch (error) {
            toast.error("Failed to fetch plans");
        }
    };

    const fetchTransactions = async () => {
        try {
            const res = await getTransactionsApi();
            setTransactions(res.data);
        } catch (error) {
            toast.error("Failed to fetch transactions");
        }
    };

    const handleEditPlan = (plan: Plan) => {
        setPlanToEdit(plan);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (plan: Plan) => {
        setPlanToDelete(plan);
        setIsDeleteModalOpen(true);
    };

    const confirmDeletePlan = async () => {
        if (!planToDelete) return;
        try {
            await deletePlanApi(planToDelete.id);
            toast.success("Plan deleted successfully");
            fetchPlans();
        } catch (error) {
            toast.error("Failed to delete plan");
        } finally {
            setIsDeleteModalOpen(false);
            setPlanToDelete(null);
        }
    };

    const handleSavePlan = async (planData: Partial<Plan>) => {
        try {
            if (planToEdit) {
                await updatePlanApi(planToEdit.id, planData);
                toast.success("Plan updated successfully");
            } else {
                await createPlanApi(planData);
                toast.success("Plan created successfully");
            }
            setIsModalOpen(false);
            fetchPlans();
        } catch (error) {
            toast.error(`Failed to ${planToEdit ? 'update' : 'create'} plan`);
        }
    };

    const calculateTotalRevenue = () => {
        return transactions
            .filter(tx => tx.status === 'Completed')
            .reduce((sum, tx) => sum + tx.amount, 0);
    };

    const calculateSubscribers = () => {
        const activeTx = transactions.filter(tx => tx.status === 'Completed');
        const uniqueUsers = new Set(activeTx.filter(tx => tx.user).map(tx => tx.user!.email));
        return uniqueUsers.size;
    };

    const activePlansCount = plans.filter(p => p.status === 'Active').length;
    const totalRevenue = calculateTotalRevenue();
    const subscribersCount = calculateSubscribers();

    return (
        <div className="p-8 space-y-8 min-h-screen text-white rounded-lg">
            <div className="flex flex-col gap-6">

                {/* Top Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#1a2333] border border-slate-700 p-6 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 font-medium pb-2 text-sm">Active Plans</p>
                            <h3 className="text-3xl font-bold bg-white bg-clip-text text-transparent">{activePlansCount}</h3>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-indigo-900/50 flex flex-col items-center justify-center text-indigo-400">
                            <CreditCard size={24} />
                        </div>
                    </div>

                    <div className="bg-[#1a2333] border border-slate-700 p-6 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 font-medium pb-2 text-sm">Total Revenue</p>
                            <h3 className="text-3xl font-bold flex items-center gap-1">
                                <IndianRupee size={28} className="text-white" />{totalRevenue}
                            </h3>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-blue-900/50 flex flex-col items-center justify-center text-blue-400">
                            <span className="text-2xl font-bold">$</span>
                        </div>
                    </div>

                    <div className="bg-[#1a2333] border border-slate-700 p-6 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 font-medium pb-2 text-sm">Subscribers</p>
                            <h3 className="text-3xl font-bold bg-white bg-clip-text text-transparent">{subscribersCount}</h3>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-fuchsia-900/50 flex flex-col items-center justify-center text-fuchsia-400">
                            <Users size={24} />
                        </div>
                    </div>
                </div>

                {/* Tabs and Actions Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-2">
                    <div className="flex gap-6">
                        <button
                            onClick={() => setActiveTab("plans")}
                            className={`pb-2 px-1 font-medium transition-colors ${activeTab === "plans"
                                ? "text-blue-500 border-b-2 border-blue-500"
                                : "text-slate-400 hover:text-slate-300"
                                }`}
                        >
                            Subscription Plans
                        </button>
                        <button
                            onClick={() => setActiveTab("transactions")}
                            className={`pb-2 px-1 font-medium transition-colors ${activeTab === "transactions"
                                ? "text-blue-500 border-b-2 border-blue-500"
                                : "text-slate-400 hover:text-slate-300"
                                }`}
                        >
                            Transaction History
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            setPlanToEdit(null);
                            setIsModalOpen(true);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
                    >
                        + Add New Plan
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-[#1a2333] border border-slate-800 rounded-xl overflow-hidden min-h-[400px]">
                    {activeTab === "plans" ? (
                        <PlanTable
                            plans={plans}
                            onEdit={handleEditPlan}
                            onDelete={(id) => {
                                const plan = plans.find(p => p.id === id);
                                if (plan) handleDeleteClick(plan);
                            }}
                        />
                    ) : (
                        <TransactionTable transactions={transactions} />
                    )}
                </div>

                {/* Modal */}
                <PlanModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    planToEdit={planToEdit}
                    onSave={handleSavePlan}
                />

                {/* Delete Confirmation Modal */}
                <DeleteConfirmModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDeletePlan}
                    planName={planToDelete?.name || ""}
                />

            </div>
        </div>
    );
};

export default PlanManagement;
