import { useRef, useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../Spinner/Spinner";
import useAuth from "../hooks/useAuth";
import axios from "axios";

const LOGIN_URL = `${import.meta.env.VITE_API_URL}/identity/login`
const RESEND_URL = `${import.meta.env.VITE_API_URL}/identity/resend-confirmation-email`

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
    const [loading, setLoading] = useState(false);
    const [resendConfirmationMail, setResendConfirmationMail] = useState(false);

    useEffect(() => {
        // console.clear()
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('')
    },[user,password])

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const response = await axios.post(LOGIN_URL, 
                {
                    "email": user,
                    "password": password
                }
            );
            // const expiryTime = Date.now() + 90 * 1000;
            const expiryTime = Date.now() + response.data.expiresIn * 1000;
            localStorage.setItem("auth", JSON.stringify({
                user,
                accessToken: response.data.accessToken,
                expiresIn: response.data.expiresIn,
                refreshToken: response.data.refreshToken,
                expiryTime
            }));
            setAuth({ user, accessToken: response.data.accessToken, expiryTime });
            setUser('');
            setPassword('');
            navigate(from, {replace: true});
            navigate(0)

        } catch (err) {
            console.log(err)
            if(!err?.response){
                toast.error('No Server response')
                // setErrMsg('No Server response')
            }
            else if (err.response?.status === 400) {
                toast.error('Missing username or password');
            }
            else if (err.response?.status === 401 && err.response?.data === "Email not confirmed.") {
                setResendConfirmationMail(true);
                toast.error('Email not confirmed');
            }
            else if (err.response?.status === 401 && err.response?.data !== "Email not confirmed.") {
                toast.error('Unathorized');
            }
            else {
                toast.error('Login Failed');
            }
            errRef.current.focus();
        }
        finally{
            setLoading(false)
        }
    }

    const resendMail = async () => {
        try {
            const response = await axios.post(RESEND_URL, 
                {
                    "email": user,
                }
            );
            toast.success(response.data)
        } catch (err) {
            toast.error(err)
        }
    }

  return (
    <div className="flex flex-col items-center justify-center mx-4">
    <section className="max-w-md p-6 bg-project-dark-bg rounded-lg shadow-lg w-full">
    <h1 className="text-2xl text-white font-bold text-center mb-4">Sign In</h1>
    <form onSubmit={handleSubmit} className="space-y-4 ">
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
          {loading ? (
            <Spinner />
             ) : (
            <button
              type="submit"
              className="w-full py-2 bg-project-yellow text-black font-semibold rounded-lg hover:bg-project-yellow-buttons focus:outline-none focus:ring-2 focus:ring-project-yellow-buttons"
            >
              Sign In
            </button>
          )}
        </div>
    </form>
    <p className="mt-4 text-center text-sm text-white">
        Need an Account? <br />
        <span className="line">
            <a href="/register" className="text-project-blue hover:underline">Sign Up</a>
        </span>
    </p>
</section>
{resendConfirmationMail && (
    <div className="max-w-md p-6 bg-project-dark-bg rounded-lg shadow-lg m-4 w-full">
        <div className="pb-4 w-full text-white text-xl text-center font-bold">
            Your account wasn't confirmed via e-mail
        </div>
        <button
              onClick={() => resendMail()}
              type="submit"
              className="w-full py-2 bg-project-blue text-black font-semibold rounded-lg hover:bg-project-blue-buttons focus:outline-none focus:ring-2 focus:ring-project-blue-buttons"
            >
              Resend confirmation mail
            </button>
    </div>
)}
</div>
  )
}

export default Login