import { Mail, Download, Loader2, Wallet } from "lucide-react";
import TransactionInformationCard from "./TransactionInformationCard";
import moment from "moment";

const IncomeList = ({ transactions, loading, onDelete, deletingId }) => {
    return (
        <div className="w-full p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-gray-800">Income Sources</h3>
                
                <div key="action-buttons" className="flex flex-col space-y-3">
                    <button className="relative overflow-hidden flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-indigo-400/90 to-violet-500/90 text-white font-medium shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/60 transition-all duration-300 hover:scale-[1.02] active:scale-95 w-full min-w-[180px]">
                        <Mail className="w-5 h-5 group-hover:animate-pulse" />
                        <span>Email</span>
                    </button>

                    <button className="relative overflow-hidden flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-amber-400/90 to-orange-500/90 text-white font-medium shadow-lg shadow-amber-200/50 hover:shadow-amber-300/60 transition-all duration-300 hover:scale-[1.02] active:scale-95 w-full min-w-[180px]">
                        <Download className="w-5 h-5 group-hover:animate-pulse" />
                        <span>Download</span>
                    </button>
                </div>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
            ) : transactions?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {transactions.map((income) => (
                        <TransactionInformationCard
                            key={income.id}
                            title={income.name || income.title}
                            date={moment(income.date).format("Do MMM YYYY")}
                            amount={income.amount}
                            type="income"
                            onDelete={() => onDelete(income.id)}
                            isDeleting={deletingId === income.id}
                        />
                    ))}
                </div>
            ) : (
                <div className="col-span-full py-12 text-center">
                    <Wallet className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No income records found</h3>
                </div>
            )}
        </div>
    );
};

export default IncomeList;