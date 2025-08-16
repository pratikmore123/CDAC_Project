import { UtensilsCrossed, Trash2, TrendingUp, Loader2 } from "lucide-react";

const TransactionInformationCard = ({ 
    icon, 
    title, 
    date, 
    amount, 
    type,
    onDelete,
    isDeleting
}) => {
    const getAmountStyles = () => type === "income" 
        ? "bg-green-50 text-green-800" 
        : "bg-red-50 text-red-800";

    const formatIndianAmount = (amount) => {
        if (isNaN(amount)) return '₹0.00';
        
        const num = parseFloat(amount);
        const [whole, decimal] = num.toFixed(2).split('.');
        
        let lastThree = whole.substring(whole.length - 3);
        let otherNumbers = whole.substring(0, whole.length - 3);
        
        if (otherNumbers !== '') {
            lastThree = ',' + lastThree;
        }
        
        const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        
        return `₹${formatted}.${decimal}`;
    };

    return (
        <div className="group relative flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100/60 transition-colors">
            <div className="w-10 h-10 flex items-center justify-center text-gray-800 bg-gray-100 rounded-full">
                {icon ? (
                    <img src={icon} alt={title} className="w-5 h-5" />
                ) : ( 
                    <UtensilsCrossed className="text-purple-500 w-5 h-5" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{title}</h3>
                <p className="text-sm text-gray-500">{date}</p>
            </div>
            {onDelete && (
                <button 
                    onClick={() => onDelete()}
                    disabled={isDeleting}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 disabled:opacity-50"
                    aria-label="Delete income"
                >
                    {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Trash2 className="w-4 h-4" />
                    )}
                </button>
            )}
            <div className={`px-3 py-1 rounded-full text-sm ${getAmountStyles()}`}>
                <span className="flex items-center gap-1">
                    <span className="font-medium">
                        {type === "income" ? "+" : "-"}{formatIndianAmount(amount)}
                    </span>
                    <TrendingUp size={15} className="text-green-600" />
                </span>
            </div>
        </div>
    );
};

export default TransactionInformationCard;