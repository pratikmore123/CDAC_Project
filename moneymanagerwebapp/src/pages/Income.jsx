import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import toast from "react-hot-toast";
import IncomeList from "../components/IncomeList";
import Modal from "../components/Modal";
import { Plus, Loader2 } from "lucide-react";
import AddIncomeForm from "../components/AddIncomeForm";

const Income = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const fetchIncomeDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
      if (response.status === 200 && Array.isArray(response.data)) {
        setIncomeData(response.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Fetch income error:", error);
      const errorMessage = error.response?.data?.message || "Failed to load income data";
      toast.error(errorMessage);
      
      // Only redirect if it's an authentication error
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchIncomeCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await axiosConfig.get(
        API_ENDPOINTS.CATEGORY_BY_TYPE("income")
      );
      
      let categoriesData = [];
      if (Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        categoriesData = response.data.data;
      } else if (response.data?.items && Array.isArray(response.data.items)) {
        categoriesData = response.data.items;
      }
      
      if (categoriesData.length === 0) {
        toast.error("No income categories found. Please create categories first.");
      }
      
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch income categories:", error);
      const errorMessage = error.response?.data?.message || 
        "Failed to fetch income categories. Please try again.";
      toast.error(errorMessage);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleDeleteIncome = async (id) => {
    if (!id) return;
    
    setDeletingId(id);
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));
      toast.success("Income deleted successfully");
      setIncomeData(prev => prev.filter(income => income.id !== id));
    } catch (error) {
      console.error("Delete income error:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete income";
      toast.error(errorMessage);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddIncome = async (income) => {
    const { name, amount, date, icon, categoryId } = income;
    
    // Validation checks
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
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, {
        name,
        amount: Number(amount),
        date,
        icon,
        categoryId: Number(categoryId)
      });
      
      if (response.status === 201) {
        toast.success("Income added successfully");
        setOpenAddIncomeModal(false);
        await fetchIncomeDetails();
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error adding income:", error);
      
      let errorMessage = "Failed to add income";
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
        await fetchIncomeDetails();
        await fetchIncomeCategories();
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Dashboard activeMenu="Income">
      <div className="my-5 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6">
          <div className="flex justify-end">
            <button 
              className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg ${
                categoriesLoading || categories.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => setOpenAddIncomeModal(true)}
              disabled={categoriesLoading || categories.length === 0}
            >
              <Plus size={18} />
              <span className="font-medium">Add Income</span>
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
              No income categories available. Please create categories first.
            </div>
          )}
          
          <IncomeList 
            transactions={incomeData} 
            loading={loading} 
            onDelete={handleDeleteIncome} 
            deletingId={deletingId} 
          />
          
          <Modal 
            isOpen={openAddIncomeModal} 
            onClose={() => setOpenAddIncomeModal(false)} 
            title="Add Income"
          >
            <AddIncomeForm 
              onAddIncome={handleAddIncome} 
              categories={categories} 
              loading={categoriesLoading || loading}
            />
          </Modal>
        </div>
      </div>
    </Dashboard>
  );
};

export default Income;