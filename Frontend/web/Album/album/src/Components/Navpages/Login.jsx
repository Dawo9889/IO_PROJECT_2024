import { useRef, useState, useEffect } from "react"
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import './Navpages.css'
import axios from "axios";
const LOGIN_URL = 'https://localhost:7017/api/identity/login'

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
            // console.log(response.data.accessToken)
            setAuth({user,password})
            setUser('');
            setPassword('');
            navigate(from, {replace: true});

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
    <section>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input 
                type="text" 
                id="username"
                ref={userRef}
                autoComplete="off" 
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
            />
            <label htmlFor="password">Password:</label>
            <input 
                type="password" 
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
            />
            <button>Sign In</button>
        </form>
        <p>
            Need an Account? <br />
            <span className="line">
                <a href="#">Sign Up</a>
            </span>
        </p>
    </section>
  )
}

export default Login