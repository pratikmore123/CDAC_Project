import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

const RecentTransactionCard = ({ transaction }) => {
  const isIncome = transaction.type === "income";
  
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };
  
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {isIncome ? (
            <ArrowDownLeft className="w-5 h-5" />
          ) : (
            <ArrowUpRight className="w-5 h-5" />
          )}
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{transaction.name}</h4>
          <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
        </div>
      </div>
      <div className={`font-medium ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
        {isIncome ? '+' : '-'}{formatAmount(transaction.amount)}
      </div>
    </div>
  );
};

export default RecentTransactionCard;