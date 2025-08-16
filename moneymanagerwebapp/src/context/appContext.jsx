import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    
    const updateUser = (userData) => {
        setUser({
            fullName: userData?.fullName || 
                    `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || 
                    userData?.name ||
                    'User',
            email: userData?.email || '',
            ...userData
        });
    };

    const contextValue = {
        user,
        setUser: updateUser,
        isAuthenticated: !!user
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};