import { useState } from "react"
import { toast } from 'react-toastify';
import axios from 'axios';

const ResetPassword = () => {
    const USER_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const FORGOT_PASSWORD_URL = `${import.meta.env.VITE_API_URL}/identity/forgot-password`;

    const [user, setUser] = useState('');
    const [loading, setLoading] = useState(false);

    const resetPassword = async (e) => {
      e.preventDefault();
      if (!user || user.trim() === "") {
        toast.error("Email address is required");
        return;
    }
    else if(!USER_REGEX.test(user)){
        toast.error("The e-mail address is incorrect");
        return;
    }
    setLoading(true);
    try {
        const response = await axios.post(FORGOT_PASSWORD_URL,
            {
                "email": user
            }
        );
        localStorage.removeItem("auth")
        toast.success(response.data)
      } catch (err) {
        toast.error(err.response.data)
    }
    finally{
        setLoading(false)
    }
    }
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto bg-project-dark-bg rounded-lg shadow-lg p-6">
        <form onSubmit={resetPassword}>
        <p className="text-white text-xl font-bold text-center mb-4">
          Reset Password
        </p>
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-white">Email:</label>
              <input 
                type="text" 
                id="username"
                autoComplete="off" 
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-project-blue"
              />
          </div>
        <button
          className="text-center w-full py-2 px-4 bg-project-yellow text-dark font-semibold rounded-lg hover:bg-project-yellow-buttons focus:outline-none focus:ring-2 focus:ring-project-yellow-buttons"
          type="submit"
        >
          Reset Password
       </button>
      </div>
      </form>
    </div>
  </div>
  )
}

export default ResetPassword