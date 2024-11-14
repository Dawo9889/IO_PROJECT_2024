import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAuth({ token });
        }
    }, []);

    const login = (token) => {
        setAuth({ token });
        localStorage.setItem('accessToken', token);
    };

    const logout = () => {
        setAuth(null);
        localStorage.removeItem('accessToken');
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};