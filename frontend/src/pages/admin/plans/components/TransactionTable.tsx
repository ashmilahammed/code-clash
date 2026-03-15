import React, { useState } from "react";
import type { Transaction } from "../../../../api/transactionApi";

interface TransactionTableProps {
    transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(transactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTransactions = transactions.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="flex flex-col w-full">
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-700/50 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-800/20">
                            <th className="p-4">User</th>
                            <th className="p-4">Plan</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Payment Method</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {currentTransactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="p-4">
                                    {tx.user ? (
                                        <div>
                                            <div className="font-semibold text-white">{tx.user.name}</div>
                                            <div className="text-xs text-slate-400 mt-1">{tx.user.email}</div>
                                        </div>
                                    ) : (
                                        <span className="text-slate-500 italic">Unknown User</span>
                                    )}
                                </td>
                                <td className="p-4 text-slate-300">
                                    {tx.plan ? tx.plan.name : <span className="text-slate-500 italic">-</span>}
                                </td>
                                <td className="p-4 text-emerald-400 font-medium">
                                    ₹{tx.amount}
                                </td>
                                <td className="p-4 text-slate-400">
                                    {tx.paymentMethod}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${tx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                        tx.status === 'Failed' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                            'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                        }`}>
                                        {tx.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right text-sm text-slate-400">
                                    {new Date(tx.date).toLocaleDateString('en-GB')}
                                </td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-500">
                                    No transactions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700/50">
                    <div className="text-sm text-slate-400">
                        Showing <span className="font-medium text-slate-300">{startIndex + 1}</span> to <span className="font-medium text-slate-300">{Math.min(startIndex + itemsPerPage, transactions.length)}</span> of <span className="font-medium text-slate-300">{transactions.length}</span> results
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-300 border border-slate-700 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <div className="px-2 text-sm text-slate-400">
                            Page {currentPage} of {totalPages}
                        </div>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-300 border border-slate-700 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionTable;
