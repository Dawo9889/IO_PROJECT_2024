import {useRef, useState, useEffect} from 'react';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import Spinner from '../Spinner/Spinner';
import axios from "axios";
const USER_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
const RESGISTER_URL = `${import.meta.env.VITE_API_URL}/identity/register`;

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        const result = USER_REGEX.test(user);
        setValidName(result)
    }, [user])

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result)
        const match = pwd === matchPwd;
        setValidMatch(match)
    }, [pwd, matchPwd]) 

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd)

        if(!v1 || !v2){
            setErrMsg("Invalid entry");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(RESGISTER_URL,
                {
                    "email": user,
                    "password": pwd
                }
            );
            setSuccess(true)
          } catch (err) {
            console.log(err);
        
            if (!err?.response) {
              toast.error('No server response');
          } else if (err.response?.status === 400) {
              const errors = err.response.data;
          
              if (Array.isArray(errors)) {
                  const errorMessages = errors.map(error => {
                      if (error.code === 'DuplicateUserName') {
                          return error.description;
                      } else if (error.code === 'InvalidEmail') {
                          return error.description;
                      } else if (
                          error.code === 'PasswordTooShort' ||
                          error.code === 'PasswordRequiresNonAlphanumeric' ||
                          error.code === 'PasswordRequiresDigit' ||
                          error.code === 'PasswordRequiresLower' ||
                          error.code === 'PasswordRequiresUpper' ||
                          error.code === 'PasswordRequiresUniqueChars'
                      ) {
                          return error.description;
                      }
                      return null;
                  }).filter(msg => msg !== null);
          
                  if (errorMessages.length > 0) {
                    toast.error(errorMessages.join(' '));
                      // setErrMsg(errorMessages.join(' '));
                  } else {
                    toast.error('Invalid input data');
                  }
              } else {
                toast.error('Invalid input data');
              }
          } else {
            toast.error('Registration Failed');
          }
            errRef.current.focus();
          }
        finally{
            setLoading(false)
        }
    }

    return (
      <div className="flex flex-col items-center justify-center ml-4 mr-4">
          { success ? (
            <section className="max-w-md mx-auto p-6 bg-project-dark-bg rounded-lg shadow-lg">
              <h1 className="text-2xl text-white font-bold text-center mb-4">Success!</h1>
              <h1 className="text-xl text-white font-bold text-center mb-4">Please check your mailbox to verify your account.</h1>
              <p className="text-center">
                <a href="/login" className="text-project-blue hover:underline">Sign In</a>
              </p>
            </section>
          ) : (
            <section className="max-w-md p-6 bg-project-dark-bg rounded-lg shadow-lg ml-4 mr-4 w-full">
              <p ref={errRef} className={errMsg ? "errmsg text-red-600 text-sm text-center mb-2" : "offscreen"} aria-live="assertive">
                {errMsg}
              </p>
              <h1 className="text-2xl text-white font-bold text-center mb-4">Register</h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-white">Email:</label>
                  <div className="relative">
                    <input 
                      type="text"
                      id="username"
                      ref={userRef}
                      autoComplete="off"
                      onChange={(e) => setUser(e.target.value)}
                      required
                      aria-invalid={validName ? "false" : "true"}
                      aria-describedby="uidnote"
                      onFocus={() => setUserFocus(true)}
                      onBlur={() => setUserFocus(false)}
                      className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-project-blue"
                    />
                    <span className={validName ? "absolute right-2 top-2 text-green-500" : "hidden"}>
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validName || !user ? "hidden" : "absolute right-2 top-2 text-red-600"}>
                      <FontAwesomeIcon icon={faTimes} />
                    </span>
                  </div>
                </div>
      
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white">Password:</label>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      onChange={(e) => setPwd(e.target.value)}
                      value={pwd}
                      required
                      aria-invalid={validPwd ? "false" : "true"}
                      aria-describedby="pwdnote"
                      onFocus={() => setPwdFocus(true)}
                      onBlur={() => setPwdFocus(false)}
                      className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-project-blue"
                    />
                    <span className={validPwd ? "absolute right-2 top-2 text-green-500" : "hidden"}>
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validPwd || !pwd ? "hidden" : "absolute right-2 top-2 text-red-600"}>
                      <FontAwesomeIcon icon={faTimes} />
                    </span>
                  </div>
                  <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions text-sm text-gray-600 mt-2" : "offscreen"}>
                  </p>
                </div>
      
                <div>
                  <label htmlFor="confirm_pwd" className="block text-sm font-medium text-white">Confirm Password:</label>
                  <div className="relative">
                    <input
                      type="password"
                      id="confirm_pwd"
                      onChange={(e) => setMatchPwd(e.target.value)}
                      value={matchPwd}
                      required
                      aria-invalid={validMatch ? "false" : "true"}
                      aria-describedby="confirmnote"
                      onFocus={() => setMatchFocus(true)}
                      onBlur={() => setMatchFocus(false)}
                      className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-project-blue"
                    />
                    <span className={validMatch && matchPwd ? "absolute right-2 top-2 text-green-500" : "hidden"}>
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validMatch || !matchPwd ? "hidden" : "absolute right-2 top-2 text-red-600"}>
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
                      disabled={!validName || !validPwd || !validMatch}
                      className={`w-full relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium rounded-lg border 
                        ${validName && validPwd && validMatch 
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
      
              <p className="mt-4 text-center text-sm text-white">
                Already registered?<br />
                <span className="line">
                  <a href="/login" className="text-project-blue hover:underline">Sign In</a>
                </span>
              </p>
            </section>
          )}
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
}

export default Register