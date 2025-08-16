<<<<<<< HEAD
import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import toast from "react-hot-toast";
import { TrendingUp, TrendingDown, Wallet, Loader2 } from "lucide-react";
import RecentTransactionCard from "../components/RecentTransactionCard";

const Home = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosConfig.get(API_ENDPOINTS.DASHBOARD_DATA);
      
      if (response.status === 200 && response.data) {
        setDashboardData(response.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error(error.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Dashboard activeMenu="Dashboard">
      <div className="my-5 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Balance */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Balance</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">
                      {dashboardData?.totalBalance ? formatCurrency(dashboardData.totalBalance) : '₹0.00'}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                    <Wallet className="w-6 h-6" />
                  </div>
                </div>
              </div>
              
              {/* Total Income */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Income</p>
                    <p className="mt-1 text-3xl font-semibold text-green-600">
                      {dashboardData?.totalIncome ? formatCurrency(dashboardData.totalIncome) : '₹0.00'}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-100 text-green-600">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
              </div>
              
              {/* Total Expense */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Expense</p>
                    <p className="mt-1 text-3xl font-semibold text-red-600">
                      {dashboardData?.totalExpense ? formatCurrency(dashboardData.totalExpense) : '₹0.00'}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-100 text-red-600">
                    <TrendingDown className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-medium mb-6">Recent Transactions</h3>
              
              {dashboardData?.recentTransactions?.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentTransactions.map((transaction) => (
                    <RecentTransactionCard 
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No recent transactions found</p>
                </div>
              )}
            </div>
            
            {/* Recent Incomes & Expenses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Incomes */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-medium mb-6">Recent Incomes</h3>
                
                {dashboardData?.recent5Incomes?.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recent5Incomes.map((income) => (
                      <RecentTransactionCard 
                        key={income.id}
                        transaction={income}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No recent incomes found</p>
                  </div>
                )}
              </div>
              
              {/* Recent Expenses */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-medium mb-6">Recent Expenses</h3>
                
                {dashboardData?.recent5Expenses?.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recent5Expenses.map((expense) => (
                      <RecentTransactionCard 
                        key={expense.id}
                        transaction={expense}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No recent expenses found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Dashboard>
  );
};

=======
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";

const Home=()=>{
    useUser();
    return (
        <div>
            <Dashboard activeMenu="Dashboard">
                This is home page
            </Dashboard>
        </div>
    )
}
>>>>>>> 615710988a6ecef8bd4a45833db1a4f5089e5d3f
export default Home;