import {useRef, useState, useEffect} from 'react';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import '../Spinner/Spinner.css'
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
                setErrMsg('No server response');
            } else if (err.response?.status === 400) {
                const errors = err.response.data.errors;
        
                if (errors?.DuplicateUserName) {
                    setErrMsg(errors.DuplicateUserName[0]);
                } else if (errors?.InvalidEmail) {
                    setErrMsg(errors.InvalidEmail[0]);
                } else if (errors?.PasswordTooShort ||
                           errors?.PasswordRequiresNonAlphanumeric ||
                           errors?.PasswordRequiresDigit ||
                           errors?.PasswordRequiresLower ||
                           errors?.PasswordRequiresUpper ||
                           errors?.PasswordRequiresUniqueChars) {

                    const passwordErrors = [];
                    if (errors.PasswordTooShort) {
                        passwordErrors.push(errors.PasswordTooShort[0]);
                    }
                    if (errors.PasswordRequiresNonAlphanumeric) {
                        passwordErrors.push(errors.PasswordRequiresNonAlphanumeric[0]);
                    }
                    if (errors.PasswordRequiresDigit) {
                        passwordErrors.push(errors.PasswordRequiresDigit[0]);
                    }
                    if (errors.PasswordRequiresLower) {
                        passwordErrors.push(errors.PasswordRequiresLower[0]);
                    }
                    if (errors.PasswordRequiresUpper) {
                        passwordErrors.push(errors.PasswordRequiresUpper[0]);
                    }
                    if (errors.PasswordRequiresUniqueChars) {
                        passwordErrors.push(errors.PasswordRequiresUniqueChars[0]);
                    }
                    setErrMsg(passwordErrors.join(' '));
                } else {
                    setErrMsg('Invalid input data');
                }
            } else {
                setErrMsg('Registration Failed');
            }
            errRef.current.focus();
            setLoading(false)
        }
    }

    return (
        <>
          { success ? (
            <section className="max-w-md mx-auto p-6 bg-project-dark-bg rounded-lg shadow-lg">
              <h1 className="text-2xl text-white font-bold text-center mb-4">Success!</h1>
              <p className="text-center">
                <a href="/login" className="text-project-blue hover:underline">Sign In</a>
              </p>
            </section>
          ) : (
            <section className="max-w-md mx-auto p-6 bg-project-dark-bg rounded-lg shadow-2xl">
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
                  <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
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
        </>
      );
}

export default Register