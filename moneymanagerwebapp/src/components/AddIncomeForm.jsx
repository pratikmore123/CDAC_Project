import { useState, useEffect } from "react";
import EmojiPickerPopUp from "./EmojiPickerPopUp";
import Input from "../components/Input";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const AddIncomeForm = ({ onAddIncome, categories, loading }) => {
  const [income, setIncome] = useState({ 
    name: "", 
    amount: "", 
    date: new Date().toISOString().split('T')[0], 
    icon: "", 
    categoryId: "" 
  });

  const [errors, setErrors] = useState({
    name: false,
    amount: false,
    date: false,
    categoryId: false
  });

  const categoryOptions = categories?.map((category) => ({
    value: category.id.toString(),
    label: category.name,
    icon: category.icon
  })) || [];

  useEffect(() => {
    if (categories && categories.length > 0 && !income.categoryId) {
      // Auto-select first category if none selected
      setIncome(prev => ({ ...prev, categoryId: categories[0].id.toString() }));
    }
  }, [categories]);

  const handleChange = (key, value) => {
    setIncome(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: false }));
    }
  };

  const validateForm = () => {
    if (!categories || categories.length === 0) {
      toast.error("No valid categories available");
      return false;
    }
    
    const newErrors = {
      name: !income.name.trim(),
      amount: !income.amount || isNaN(income.amount) || Number(income.amount) <= 0,
      date: !income.date,
      categoryId: !income.categoryId || !categories.some(cat => 
        cat.id.toString() === income.categoryId.toString()
      )
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(Boolean)) {
      toast.error("Please fix all validation errors");
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onAddIncome(income);
    }
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="p-4 text-center text-red-500">
        No income categories available. Please create categories first.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[70vh] p-4">
      <EmojiPickerPopUp 
        icon={income.icon} 
        onSelect={(selectedIcon) => handleChange('icon', selectedIcon)} 
        disabled={loading}
      />
      
      <Input 
        value={income.name}
        onChange={({ target }) => handleChange('name', target.value)}
        label="Income Source"
        placeholder="e.g., Salary, Freelance, Bonus"
        type="text"
        required
        error={errors.name}
        errorMessage="Name is required"
        disabled={loading}
      />
      
      <Input 
        value={income.categoryId}
        onChange={({ target }) => handleChange('categoryId', target.value)}
        label="Category"
        isSelect={true}
        options={categoryOptions}
        required
        disabled={loading || !categories || categories.length === 0}
        error={errors.categoryId}
        errorMessage="Please select a valid category"
      />
      
      <Input 
        value={income.amount}
        onChange={({ target }) => handleChange('amount', target.value)}
        label="Amount"
        placeholder="Enter amount"
        type="number"
        min="0.01"
        step="0.01"
        required
        error={errors.amount}
        errorMessage="Valid amount is required"
        disabled={loading}
      />
      
      <Input 
        value={income.date}
        onChange={({ target }) => handleChange('date', target.value)}
        label="Date"
        type="date"
        max={new Date().toISOString().split('T')[0]}
        required
        error={errors.date}
        errorMessage="Date is required"
        disabled={loading}
      />
      
      <button 
        type="submit"
        disabled={loading || !categories || categories.length === 0}
        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </div>
        ) : "Add Income"}
      </button>
    </form>
  );
};

export default AddIncomeForm;