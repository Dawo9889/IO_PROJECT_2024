import { useEffect, createContext, useState } from "react";
import axios from 'axios'

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState(() => {
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth) {
            const parsedAuth = JSON.parse(storedAuth);
            const currentTime = Date.now();
            if (parsedAuth.expiryTime && currentTime < parsedAuth.expiryTime) {
                return parsedAuth;
            } else {
                localStorage.removeItem("auth");
                return {};
            }
        }
        return {};
    });

    const refreshAccessToken = async () => {
        console.log(auth.refreshToken)
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/identity/refresh`, {
                "refreshToken": auth.refreshToken
            });
            
            const newExpiryTime = Date.now() + response.data.expiresIn * 1000;
            const updatedAuth = {
                ...auth,
                accessToken: response.data.accessToken,
                expiryTime: newExpiryTime
            };
            console.log("udalo sie")
            setAuth(updatedAuth);
            localStorage.setItem("auth", JSON.stringify(updatedAuth));
        } catch (error) {
            console.error("Error refreshing token:", error);
            setAuth({});
            localStorage.removeItem("auth");
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = Date.now();
            if (auth.expiryTime && currentTime > auth.expiryTime - 60 * 1000) {
                refreshAccessToken();
            }
        }, 5 * 1000);

        return () => clearInterval(interval);
    }, [auth]);

    // console.log("Current Auth:", auth);
    // console.log("Stored Auth in LocalStorage:", localStorage.getItem("auth"));

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;