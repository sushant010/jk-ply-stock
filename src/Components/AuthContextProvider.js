import React, { createContext, useState, useContext } from 'react';

// Create context
const AuthContext = createContext();

// AuthProvider component to wrap the app
export const AuthContextProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => {
        // Perform login logic
        setIsAuthenticated(true);
    };

    const logout = () => {
        // Perform logout logic
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to access the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
