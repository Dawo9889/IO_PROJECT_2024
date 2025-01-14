import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';

const SettingsModifyProfileImage = () => {

    const userRef = useRef();
        
    const USER_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const authData = JSON.parse(localStorage.getItem("auth"));
    const accessToken = authData?.accessToken;

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [validName, setValidName] = useState(false);
    const [user, setUser] = useState('');

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const v1 = USER_REGEX.test(user);
    
        if (!v1) {
            setErrMsg("Invalid entry");
            return;
        }
    
        setLoading(true);
    
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/identity/change-email`,
                {
                    newEmail: user,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            toast.success(response.data);    
            setTimeout(() => {
              localStorage.removeItem("auth");
              navigate("/");
              window.location.reload();
            }, 5000);
            toast.info("Session cleared. Please log in again.");
        } catch (err) {
            const errorMsg =
                err.response?.data;
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
            const result = USER_REGEX.test(user);
            setValidName(result)
        }, [user])

        return (
            <div className="relative p-4">
          
              <a
                className="absolute top-4 left-4 inline-flex items-center justify-center p-0.5 mb-2 text-sm font-medium rounded-lg hover:bg-project-dark-bg"
                href="/settings"
              >
                <ArrowLeftIcon className="w-6 h-6 text-white sm:w-8 sm:h-8 md:w-10 md:h-10" />
              </a>
          
              <div className="mt-16 my-4 w-full text-white text-center text-xl max-w-xl mx-auto bg-project-dark-bg rounded-lg shadow-lg p-6">
                After clicking 'Save Changes' button, you will be logout!
              </div>
          
              <div className="w-full max-w-xl mx-auto bg-project-dark-bg rounded-lg shadow-lg p-6">
                <h1 className="text-xl md:text-2xl text-white font-bold text-center mb-6">
                  Modify Email Address
                </h1>
          
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="flex flex-col items-center">
                    <div className="w-full">
                      <label htmlFor="username" className="block text-sm font-medium text-white">
                        Email:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="username"
                          ref={userRef}
                          autoComplete="off"
                          onChange={(e) => setUser(e.target.value)}
                          required
                          aria-describedby="uidnote"
                          className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-project-blue"
                        />
                      </div>
                    </div>
                  </div>
          
                  {validName ? (
                    <button
                      type="submit"
                      className="shadow-lg w-full relative inline-flex items-center justify-center p-2 mb-2 overflow-hidden text-sm font-medium rounded-lg border 
                                border-project-yellow bg-project-yellow text-dark group focus:outline-none focus:ring-2 
                                focus:ring-project-yellow"
                    >
                      Save Changes
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="shadow-lg w-full relative inline-flex items-center justify-center p-2 mb-2 overflow-hidden text-sm font-medium rounded-lg border 
                                border-project-yellow bg-project-dark text-white group focus:outline-none focus:ring-2 
                                focus:ring-project-yellow"
                      disabled
                    >
                      Save Changes
                    </button>
                  )}
                </form>
              </div>
            </div>
          );
};

export default SettingsModifyProfileImage;
