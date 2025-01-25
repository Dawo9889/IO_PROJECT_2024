import { useRef, useState, useEffect } from 'react';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import axios from "axios";
import useAuth from '../hooks/useAuth';

const SettingsChangePassword = () => {
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    const CHANGE_PASSWORD_URL = `${import.meta.env.VITE_API_URL}/identity/change-password`;

    const {auth} = useAuth()
    const errRef = useRef();
    const navigate = useNavigate()
    
    const [oldPwd, setOldPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [matchPwd, setMatchPwd] = useState('');
    const [validNewPwd, setValidNewPwd] = useState(false);
    const [validMatch, setValidMatch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validPwd = PWD_REGEX.test(newPwd);
        if (!validPwd || newPwd !== matchPwd) {
            setErrMsg("Invalid password or passwords do not match");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(CHANGE_PASSWORD_URL, {
                oldPassword: oldPwd,
                newPassword: newPwd
            },{
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`
                }
            });
            toast.success("Password changed successfully");
            navigate("/admin");
        } catch (err) {
            if (!err?.response) {
                toast.error("No server response");
            } else if (err.response?.status === 400) {
                const errors = err.response.data.errors;
                toast.error(errors[0]);
            } else {
                toast.error("Password change failed");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const result = PWD_REGEX.test(newPwd);
        setValidNewPwd(result);
        setValidMatch(newPwd === matchPwd);
    }, [newPwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [oldPwd, newPwd, matchPwd]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            <div className="p-4 order-1 md:order-1 w-full max-w-md justify-items-end">
                <a 
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium rounded-lg hover:bg-project-dark-bg sm:p-2 sm:mb-3" 
                    href="/settings"
                >
                    <ArrowLeftIcon className="w-6 h-6 text-white sm:w-8 sm:h-8 md:w-10 md:h-10" />
                </a>
            </div>
            <div className='order-2 md:order-2'>
                <div className="w-full max-w-md mx-auto bg-project-dark-bg rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl text-white font-bold text-center mb-4">Change Password</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="oldPassword" className="block text-sm font-medium text-white">Old Password:</label>
                        <input
                            type="password"
                            id="oldPassword"
                            value={oldPwd}
                            onChange={(e) => setOldPwd(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-project-blue"
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-white">New Password:</label>
                        <div className="relative">
                            <input
                                type="password"
                                id="newPassword"
                                value={newPwd}
                                onChange={(e) => setNewPwd(e.target.value)}
                                required
                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-project-blue"
                            />
                            <span className={validNewPwd ? "absolute right-2 top-2 text-green-500" : "hidden"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={!validNewPwd && newPwd ? "absolute right-2 top-2 text-red-600" : "hidden"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">Confirm New Password:</label>
                        <div className="relative">
                            <input
                                type="password"
                                id="confirmPassword"
                                value={matchPwd}
                                onChange={(e) => setMatchPwd(e.target.value)}
                                required
                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-project-blue"
                            />
                            <span className={validMatch && matchPwd ? "absolute right-2 top-2 text-green-500" : "hidden"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={!validMatch && matchPwd ? "absolute right-2 top-2 text-red-600" : "hidden"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        {loading ? (
                            <Spinner />
                        ) : (
                            <button
                                type="submit"
                                disabled={!oldPwd || !validNewPwd || !validMatch}
                                className={`w-full relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium rounded-lg border 
                                    ${oldPwd && validNewPwd && validMatch 
                                        ? 'border-project-yellow bg-project-yellow text-dark group focus:ring-project-yellow' 
                                        : 'border-project-yellow bg-project-dark text-white group focus:ring-project-yellow'}`}
                            >
                                <span className="relative py-2.5 px-5 transition-all ease-in duration-200">
                                    Submit
                                </span>
                            </button>
                        )}
                    </div>
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
    </div>
    );
};

export default SettingsChangePassword;
