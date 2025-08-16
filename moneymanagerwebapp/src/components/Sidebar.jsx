import { useContext } from "react";
import { AppContext } from "../context/appContext";
import { User, LogOut } from "lucide-react";
import { SIDE_BAR_DATA } from "../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
    const { user, isAuthenticated, logout } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveMenu = () => {
        const currentItem = SIDE_BAR_DATA.find(item => 
            location.pathname === item.path || 
            location.pathname.startsWith(item.path + '/')
        );
        return currentItem ? currentItem.label : '';
    };

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.setItem("token", null); // Clear the token
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
            // Optionally show error to user
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20 flex flex-col">
            {/* User Profile Section */}
            <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
                {user?.profileImageUrl ? (
                    <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full object-cover bg-gray-200"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="text-gray-500 w-12 h-12" />
                    </div>
                )}
                {user && (
                    <div className="text-center">
                        <p className="font-medium text-gray-800">
                            {user.fullName || 'User'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            {user.email || ''}
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation Menu */}
            <div className="space-y-1 flex-1">
                {SIDE_BAR_DATA.map((item) => {
                    const isActive = getActiveMenu() === item.label;
                    return (
                        <button 
                            onClick={() => navigate(item.path)}
                            key={item.id}
                            className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-1 transition-colors ${
                                isActive
                                    ? "text-white bg-purple-800 font-medium shadow-md" 
                                    : "hover:bg-gray-100 text-gray-700 hover:text-purple-800"
                            }`}
                        >
                            <item.icon className={`text-lg ${isActive ? "text-white" : "text-current"}`} />
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* Logout Button */}
            <div className="mt-auto pt-4 border-t border-gray-200">
                <button 
                    onClick={()=>{  
                        localStorage.setItem("token", null); 
                        navigate("/login")}}
                    
                    className="w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-1 transition-colors hover:bg-gray-100 text-gray-700 hover:text-red-600"
                >
                    <LogOut className="text-lg" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;