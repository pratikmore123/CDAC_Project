<<<<<<< HEAD
import { Plus } from "lucide-react";
import Dashboard from "../components/Dashboard";
import CategoryList from "../components/CategoryList";
import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import AddCategoryForm from "../components/AddCategoryForm";

const Category = () => {
    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleEditCategory = (categoryToEdit) => {
        setSelectedCategory(categoryToEdit);
        setIsEditing(true);
        setOpenAddCategoryModal(true);
    };

    const handleUpdateCategory = async (updatedCategory) => {
        const {id, name, type, icon} = updatedCategory;
        
        try {
            setIsAdding(true);
            const response = await axiosConfig.put(
                `${API_ENDPOINTS.UPDATE_CATEGORY(id)}`, 
                { name, type, icon }
            );
            
            if(response.status === 200) {
                toast.success("Category updated successfully");
                fetchCategoryDetails();
                setOpenAddCategoryModal(false);
                setSelectedCategory(null);
            }
        } catch(error) {
            console.error("Update error:", error);
            toast.error(error.response?.data?.message || error.message || "Failed to update category");
        } finally {
            setIsAdding(false);
        }
    };

    const handleAddCategory = async (category) => {
        const {name, type, icon} = category;
        
        if(!name.trim()) {
            toast.error("Category Name is required");
            return;
        }

        const isDuplicate = categoryData.some((cat) => {
            return cat.name.toLowerCase() === name.trim().toLowerCase();
        });
        
        if(isDuplicate) {
            toast.error("Category name already exists");
            return;
        }
        
        setIsAdding(true);
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, {
                name,
                type,
                icon
            });

            if(response.status === 201) {
                toast.success("Category added successfully");
                setOpenAddCategoryModal(false);
                fetchCategoryDetails();
            }
        } catch(error) {
            console.error("Error adding category", error);
            toast.error(error.response?.data?.message || error.message || "Failed to add category");
        } finally {
            setIsAdding(false);
        }
    };

    const fetchCategoryDetails = async () => {
        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
            
            // Handle different response structures
            let data = response.data;
            if (data && data.data) { // If data is nested under data property
                data = data.data;
            }
            
            if (Array.isArray(data)) {
                setCategoryData(data);
            } else {
                console.error("Unexpected data format:", data);
                setCategoryData([]);
                toast.error("Unexpected data format received from server");
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error(error.response?.data?.message || error.message || "Failed to fetch categories");
            setCategoryData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryDetails();
    }, []);

    return (
        <Dashboard activeMenu="Category">
            <div className="my-5 mx-auto">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-semibold">All Categories</h2>
                    <button 
                        onClick={() => {
                            setIsEditing(false);
                            setOpenAddCategoryModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        disabled={isAdding}
                    >
                        <Plus size={18} />
                        Add Category
                    </button>
                </div>

                <CategoryList 
                    onEditCategory={handleEditCategory}
                    categories={categoryData} 
                    loading={loading} 
                />

                <Modal
                    title={isEditing ? "Update Category" : "Add Category"}
                    isOpen={openAddCategoryModal}
                    onClose={() => {
                        if (!isAdding) {
                            setOpenAddCategoryModal(false);
                            setSelectedCategory(null);
                            setIsEditing(false);
                        }
                    }}
                    disableClose={isAdding}
                >
                    <AddCategoryForm 
                        initialCategoryData={isEditing ? selectedCategory : null}
                        onAddCategory={isEditing ? handleUpdateCategory : handleAddCategory}
                        isEditing={isEditing}
                        isSubmitting={isAdding}
                    />
                </Modal>
            </div>
        </Dashboard>
    );
};

=======
import Dashboard from "../components/Dashboard";

const Category=()=>{
    return (
         <Dashboard activeMenu="Category">
                This is Category page
            </Dashboard>
    )
}
>>>>>>> 615710988a6ecef8bd4a45833db1a4f5089e5d3f
export default Category;