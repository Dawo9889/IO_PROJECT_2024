import { useEffect, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

const AuthContext = createContext({});
const authData = JSON.parse(localStorage.getItem("auth"));
const accessToken = authData?.accessToken;

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
    const navigate = useNavigate();

    const refreshAccessToken = async () => {
        console.log("hello there")
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/identity/refresh-token`, {
                "refreshToken": auth.refreshToken
            },{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const newExpiryTime = Date.now() + response.data.expiresIn * 1000;
            // const newExpiryTime = Date.now() + 60 * 1000;
            const updatedAuth = {
                ...auth,
                accessToken: response.data.accessToken,
                expiryTime: newExpiryTime,
                refreshToken: response.data.refreshToken
            };
            setAuth(updatedAuth);
            localStorage.setItem("auth", JSON.stringify(updatedAuth));
        } catch (error) {
            console.error("Error refreshing token:", error);
            setAuth({});
            localStorage.removeItem("auth");
        }
        console.log(auth)
    };
    const testBackend = async () => {
        if (localStorage.getItem("auth") !== null) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/wedding`, {
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                    },
                });
                return true; 
            } catch (error) {
                return false; 
            }
        }
        return false;
    };
    
    useEffect(() => {
        const interval = setInterval(async () => {
            const isBackendAvailable = await testBackend();
            if (!isBackendAvailable && localStorage.getItem("auth") !== null) {
                setAuth({})
                localStorage.removeItem("auth");
                navigate("/login")
            }
        }, 10 * 1000); 
    
        return () => clearInterval(interval);
    }, [navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = Date.now();
            if (auth.expiryTime && currentTime > auth.expiryTime - 60 * 1000) {
                refreshAccessToken();
            }
            else{
                console.log("sprawdzam")
            }
        }, 1 * 1000);
        return () => clearInterval(interval);
    }, [auth]);

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;