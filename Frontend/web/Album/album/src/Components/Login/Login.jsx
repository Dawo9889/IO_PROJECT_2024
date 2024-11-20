import { useRef, useState, useEffect } from "react"
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
const LOGIN_URL = `${import.meta.env.VITE_API_URL}/identity/login`

const Login = () => {
    const {setAuth} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.pathname || "/admin";

    const userRef = useRef()
    const errRef = useRef()

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('')
    },[user,password])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(LOGIN_URL, 
                {
                    "email": user,
                    "password": password
                }
            );

            const expiryTime = Date.now() + response.data.expiresIn * 1000;

            localStorage.setItem("auth", JSON.stringify({
                user,
                accessToken: response.data.accessToken,
                expiresIn: response.data.expiresIn,
                refreshToken: response.data.refreshToken,
                expiryTime
            }));

            localStorage.setItem('refreshToken', response.data.refreshToken);
            setAuth({ user, accessToken: response.data.accessToken, expiryTime });
            setUser('');
            setPassword('');
            navigate(from, {replace: true});
            navigate(0)

        } catch (err) {
            if(!err?.response){
                setErrMsg('No Server response')
            }
            else if (err.response?.status === 400) {
                setErrMsg('Missing username or password')
            }
            else if (err.response?.status === 401) {
                setErrMsg('Unathorized');
            }
            else {
                setErrMsg('Login Failed')
            }
            errRef.current.focus();
        }
    }

  return (
    <section className="max-w-md mx-auto p-6 bg-project-dark-bg rounded-lg shadow-lg">
    <p ref={errRef} className={errMsg ? "errmsg text-red-600 text-sm" : "offscreen"} aria-live="assertive">{errMsg}</p>
    <h1 className="text-2xl text-white font-bold text-center mb-4">Sign In</h1>
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="username" className="block text-sm font-medium text-white">Email:</label>
            <input 
                type="text" 
                id="username"
                ref={userRef}
                autoComplete="off" 
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-project-blue"
            />
        </div>
        <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">Password:</label>
            <input 
                type="password" 
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-project-blue"
            />
        </div>
        <div className="flex justify-center">
            <button 
                type="submit" 
                className="w-full py-2 bg-project-blue text-white font-semibold rounded-lg hover:bg-project-blue-buttons focus:outline-none focus:ring-2 focus:ring-project-yellow-buttons "
            >
                Sign In
            </button>
        </div>
    </form>
    <p className="mt-4 text-center text-sm text-white">
        Need an Account? <br />
        <span className="line">
            <a href="/register" className="text-project-yellow hover:underline">Sign Up</a>
        </span>
    </p>
</section>

  )
}

export default Login