import { useRef, useState, useEffect } from "react"
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
// import './Navpages.css'
import axios from "axios";
const LOGIN_URL = 'https://${import.meta.env.VITE_LOCALHOST_IP}:8080/api/identity/login'

const Login = () => {
    const {setAuth} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.pathname || "/";

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
            console.log(response.data.accessToken)
            localStorage.setItem("auth", JSON.stringify({ user, accessToken: response.data.accessToken }));
            localStorage.setItem('refreshToken', response.data.refreshToken);
            // console.log(localStorage.getItem('auth'))
            setAuth({ user, accessToken: response.data.accessToken })
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
    <section className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
    <p ref={errRef} className={errMsg ? "errmsg text-red-600 text-sm" : "offscreen"} aria-live="assertive">{errMsg}</p>
    <h1 className="text-2xl font-bold text-center mb-4">Sign In</h1>
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
            <input 
                type="text" 
                id="username"
                ref={userRef}
                autoComplete="off" 
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>
        <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <input 
                type="password" 
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>
        <div className="flex justify-center">
            <button 
                type="submit" 
                className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                Sign In
            </button>
        </div>
    </form>
    <p className="mt-4 text-center text-sm text-gray-600">
        Need an Account? <br />
        <span className="line">
            <a href="/register" className="text-indigo-600 hover:underline">Sign Up</a>
        </span>
    </p>
</section>

  )
}

export default Login