import { useEffect, useState } from "react";
import Input from "./Input";
import EmojiPickerPopUp from "./EmojiPickerPopUp";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const AddCategoryForm = ({ onAddCategory, initialCategoryData, isEditing, isSubmitting }) => {
    const [category, setCategory] = useState({
        name: "",
        type: "",
        icon: ""
    });

    useEffect(() => {
        if(isEditing && initialCategoryData) {
            setCategory(initialCategoryData);
        } else {
            setCategory({name: "", type: "", icon: ""});
        }
    }, [isEditing, initialCategoryData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!category.name.trim()) {
            toast.error("Category Name is required");
            return;
        }
        
        if (!category.type) {
            toast.error("Category Type is required");
            return;
        }

        await onAddCategory(category);
    };

    const categoryTypeOptions = [
        { value: "income", label: "Income" },
        { value: "expense", label: "Expense" },
    ];

    const handleChange = (key, value) => {
        setCategory(prev => ({ ...prev, [key]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <EmojiPickerPopUp
                icon={category.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
                disabled={isSubmitting}
            />

            <Input
                value={category.name}
                onChange={({ target }) => handleChange("name", target.value)}
                label="Category Name"
                placeholder="e.g., Freelance, Salary, Groceries"
                type="text"
                required
                disabled={isSubmitting}
            />

            <Input
                label="Category Type"
                value={category.type}
                onChange={({ target }) => handleChange("type", target.value)}
                isSelect={true}
                options={categoryTypeOptions}
                required
                disabled={isSubmitting}
            />

            <div className="flex justify-end mt-6">
                <button
                    type="submit"
                    disabled={isSubmitting || !category.name.trim() || !category.type}
                    className={`flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                        isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {isEditing ? "Updating..." : "Adding..."}
                        </>
                    ) : (
                        isEditing ? "Update Category" : "Add Category"
                    )}
                </button>
            </div>
        </form>
    );
};

export default AddCategoryForm;