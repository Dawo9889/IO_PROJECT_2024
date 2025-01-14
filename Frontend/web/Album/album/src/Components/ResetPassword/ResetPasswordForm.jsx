import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResetPassword = () => {
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  const navigate = useNavigate();

  const [newPwd, setNewPwd] = useState('');
  const [matchPwd, setMatchPwd] = useState('');
  const [validNewPwd, setValidNewPwd] = useState(false);
  const [validMatch, setValidMatch] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [searchParams] = useSearchParams();
  
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validNewPwd || !validMatch) {
      toast.error('Please ensure both passwords are valid and match.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/identity/reset-password`,
        { newPassword: newPwd },
        {
          params: { email, token },
        }
      );
      toast.success('Password has been reset successfully!');
      navigate("/login")
    } catch (err) {
      toast.error('Failed to reset password. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setValidNewPwd(PWD_REGEX.test(newPwd));
    setValidMatch(newPwd === matchPwd);
  }, [newPwd, matchPwd]);

  return (
    <div className='mx-4'>
    <div className="max-w-md mx-auto bg-project-dark-bg rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-white mb-4 text-center">Reset Your Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-white">
            New Password:
          </label>
          <div className="relative">
            <input
              type="password"
              id="newPassword"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-project-blue"
            />
            <span className={validNewPwd ? 'absolute right-2 top-2 text-green-500' : 'hidden'}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={!validNewPwd && newPwd ? 'absolute right-2 top-2 text-red-600' : 'hidden'}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mt-2">
            Confirm New Password:
          </label>
          <div className="relative">
            <input
              type="password"
              id="confirmPassword"
              value={matchPwd}
              onChange={(e) => setMatchPwd(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-project-blue"
            />
            <span className={validMatch && matchPwd ? 'absolute right-2 top-2 text-green-500' : 'hidden'}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={!validMatch && matchPwd ? 'absolute right-2 top-2 text-red-600' : 'hidden'}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 px-4 py-2 bg-project-yellow rounded-lg hover:bg-project-yellow-buttons focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-project-blue"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
    <div className="order-2 my-4 w-full max-w-md mx-auto bg-project-dark-bg rounded-lg shadow-lg p-6">
    <h3 className="text-lg font-semibold text-white mb-4">Password Requirements:</h3>
    <ul className="list-disc pl-5 space-y-2">
        <li className="flex items-center text-white">
            <span className='mr-2'>•</span>
            Minimum 8 characters
        </li>
        <li className="flex items-center text-white">
            <span className='mr-2'>•</span>
            At least 1 special character
        </li>
        <li className="flex items-center text-white">
            <span className='mr-2'>•</span>
            At least 1 numerical digit
        </li>
        <li className="flex items-center text-white">
            <span className='mr-2'>•</span>
            At least 1 lowercase letter
        </li>
        <li className="flex items-center text-white">
            <span className='mr-2'>•</span>
            At least 1 uppercase letter
        </li>
    </ul>
    </div>
    </div>
  );
};

export default ResetPassword;
