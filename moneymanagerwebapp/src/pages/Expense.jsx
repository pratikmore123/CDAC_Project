<<<<<<< HEAD
import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import toast from "react-hot-toast";
import TransactionInformationCard from "../components/TransactionInformationCard";
import Modal from "../components/Modal";
import { Plus, Loader2 } from "lucide-react";
import AddExpenseForm from "../components/AddExpenseForm";

const Expense = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const fetchExpenseDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);
      if (response.status === 200 && Array.isArray(response.data)) {
        setExpenseData(response.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Fetch expense error:", error);
      const errorMessage = error.response?.data?.message || "Failed to load expense data";
      toast.error(errorMessage);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenseCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await axiosConfig.get(
        API_ENDPOINTS.CATEGORY_BY_TYPE("expense")
      );
      
      let categoriesData = [];
      if (Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        categoriesData = response.data.data;
      }
      
      if (categoriesData.length === 0) {
        toast.error("No expense categories found. Please create categories first.");
      }
      
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch expense categories:", error);
      const errorMessage = error.response?.data?.message || 
        "Failed to fetch expense categories. Please try again.";
      toast.error(errorMessage);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!id) return;
    
    setDeletingId(id);
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));
      toast.success("Expense deleted successfully");
      setExpenseData(prev => prev.filter(expense => expense.id !== id));
    } catch (error) {
      console.error("Delete expense error:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete expense";
      toast.error(errorMessage);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddExpense = async (expense) => {
    const { name, amount, date, icon, categoryId } = expense;
    
    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }
    
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0");
      return;
    }
    
    if (!date) {
      toast.error("Please select date");
      return;
    }
    
    const today = new Date().toISOString().split("T")[0];
    if (date > today) {
      toast.error("Date cannot be future");
      return;
    }
    
    if (!categoryId || !categories.some(cat => cat.id.toString() === categoryId.toString())) {
      toast.error("Please select a valid category");
      return;
    }

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, {
        name,
        amount: Number(amount),
        date,
        icon,
        categoryId: Number(categoryId)
      });
      
      if (response.status === 201) {
        toast.success("Expense added successfully");
        setOpenAddExpenseModal(false);
        await fetchExpenseDetails();
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      
      let errorMessage = "Failed to add expense";
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data?.message || "Invalid request data";
        } else if (error.response.status === 401 || error.response.status === 403) {
          errorMessage = "Session expired. Please login again.";
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else if (error.response.data?.message?.includes("foreign key constraint")) {
          errorMessage = "Invalid category selected";
        } else {
          errorMessage = error.response.data?.message || "Server error";
        }
      }
      
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (isMounted) {
        await fetchExpenseDetails();
        await fetchExpenseCategories();
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Dashboard activeMenu="Expense">
      <div className="my-5 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6">
          <div className="flex justify-end">
            <button 
              className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg ${
                categoriesLoading || categories.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => setOpenAddExpenseModal(true)}
              disabled={categoriesLoading || categories.length === 0}
            >
              <Plus size={18} />
              <span className="font-medium">Add Expense</span>
            </button>
          </div>
          
          {categoriesLoading && (
            <div className="text-center py-4">
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              <p>Loading categories...</p>
            </div>
          )}
          
          {!categoriesLoading && categories.length === 0 && (
            <div className="text-center py-4 text-red-500">
              No expense categories available. Please create categories first.
            </div>
          )}
          
          <div className="w-full p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : expenseData?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {expenseData.map((expense) => (
                  <TransactionInformationCard
                    key={expense.id}
                    title={expense.name || expense.title}
                    date={new Date(expense.date).toLocaleDateString()}
                    amount={expense.amount}
                    type="expense"
                    onDelete={() => handleDeleteExpense(expense.id)}
                    isDeleting={deletingId === expense.id}
                  />
                ))}
              </div>
            ) : (
              <div className="col-span-full py-12 text-center">
                <div className="mx-auto h-12 w-12 text-gray-400">💰</div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No expense records found</h3>
              </div>
            )}
          </div>
          
          <Modal 
            isOpen={openAddExpenseModal} 
            onClose={() => setOpenAddExpenseModal(false)} 
            title="Add Expense"
          >
            <AddExpenseForm 
              onAddExpense={handleAddExpense} 
              categories={categories} 
              loading={categoriesLoading || loading}
            />
          </Modal>
        </div>
      </div>
    </Dashboard>
  );
};

=======
import Dashboard from "../components/Dashboard";

const Expense=()=>{
    return (
         <Dashboard activeMenu="Expense">
                This is expense page
         </Dashboard>
    )
}
>>>>>>> 615710988a6ecef8bd4a45833db1a4f5089e5d3f
export default Expense;