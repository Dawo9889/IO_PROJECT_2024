import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import logo from "../Navbar/cupidlogo.svg"
const Home = () => {
    // const { setAuth } = useContext(AuthContext);
    // const navigate = useNavigate();

    // const logout = async () => {
    //     setAuth({});
    //     navigate('/linkpage');
    // }

    return (
        <section className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <img src = {logo} alt="My Happy SVG"/>
            <button
                    className="w-full mt-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >Learn More</button>
            {/* <h1 className="text-2xl font-bold text-center mb-4">Home</h1>
            <p className="text-lg mb-4">You are logged in!</p>
            <Link 
                to="/album" 
                className="text-indigo-600 hover:underline"
            >
                Go to the Album Creator
            </Link>
            <div className="mt-4">
                <button 
                    onClick={logout} 
                    className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Sign Out
                </button>
            </div> */}
        </section>
    );
}

export default Home;
