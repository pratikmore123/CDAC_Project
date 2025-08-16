// CategoryList.jsx
import { Pencil } from "lucide-react";

const CategoryList = ({ categories = [], loading, onEditCategory }) => {
    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                <span className="ml-2">Loading categories...</span>
            </div>
        );
    }

    if (!Array.isArray(categories) || categories.length === 0) {
        return (
            <div className="text-center p-8">
                <p className="text-gray-500 mb-2">No categories found</p>
                <p className="text-sm text-gray-400">
                    Add categories to get started
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
                <div 
                    key={category.id}
                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 relative"
                >
                    <button 
                        onClick={() => onEditCategory(category)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-blue-500 transition-colors"
                        title="Edit category"
                    >
                        <Pencil size={16} />
                    </button>
                    
                    <div className="flex justify-between items-start mb-3">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50">
                            {category.icon ? (
                                <img 
                                    src={category.icon} 
                                    alt={category.name} 
                                    className="w-6 h-6"
                                />
                            ) : (
                                <Pencil className="text-blue-500" size={20} />
                            )}
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="font-medium text-lg">{category.name}</h3>
                        <p className="text-sm text-gray-500">
                            Type: <span className="capitalize">{category.type || 'Not specified'}</span>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CategoryList;