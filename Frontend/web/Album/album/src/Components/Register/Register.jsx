import {useRef, useState, useEffect} from 'react';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        const result = USER_REGEX.test(user);
        setValidName(result)
    }, [user])

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        // console.log(result)
        // console.log(pwd)
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
        // console.log(user,pwd)
        try {
            const response = await axios.post(RESGISTER_URL,
                {
                    "email": user,
                    "password": pwd
                }
            );
            // console.log(response.data)
            // console.log(response.accessToken)
            // console.log(JSON.stringify(response))
            setSuccess(true)
        } catch (err) {
            if(!err?.response) {
                setErrMsg('No server response')
            }
            else if(err.response?.status === 409){
                setErrMsg('Username taken')
            }
            else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
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
              <p ref={errRef} className={errMsg ? "errmsg text-red-600 text-sm" : "offscreen"} aria-live="assertive">
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
                  {/* <p id="uidnote" className={userFocus && user && !validName ? "instructions text-sm text-gray-600 mt-2" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    4 to 24 characters. <br />
                    Must begin with a letter. <br />
                    Letters, numbers, underscores, hyphens allowed.
                  </p> */}
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
                    {/* <FontAwesomeIcon icon={faInfoCircle} />
                    8 to 24 characters.<br />
                    Must include uppercase and lowercase letters, a number and a special character.<br />
                    Allowed special characters: <span aria-label="exclamation mark">!</span>
                    <span aria-label="at symbol">@</span>
                    <span aria-label="hashtag">#</span>
                    <span aria-label="dollar sign">$</span>
                    <span aria-label="percent">%</span> */}
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
                  {/* <p id="confirmnote" className={matchFocus && !validMatch ? "instructions text-sm text-gray-600 mt-2" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Must match the first password input field.
                  </p> */}
                </div>
      
                <button 
                  disabled={!validName || !validPwd || !validMatch}
                  className="w-full py-2 bg-project-yellow text-black font-semibold rounded-lg hover:bg-project-yellow-buttons focus:outline-none focus:ring-2 focus:ring-yellow-buttons"
                >
                  Sign Up
                </button>
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