
import logo from "../Navbar/cupidlogo-white.svg"
import useAuth from '../hooks/useAuth';
const Home = () => {
    const { auth } = useAuth();
    return (
        <section className="max-w-md mx-auto p-6 bg-project-dark-bg rounded-lg shadow-2xl">
            <img src = {logo} alt="My Happy SVG"/>
            {/* <button
                    className="w-full mt-4 py-2 bg-project-yellow text-project-dark font-semibold rounded-lg hover:bg-project-yellow-buttons focus:outline-none focus:ring-2 focus:ring-yellow-buttons"
                >Learn More</button>
            <div>
            {console.log('refreshtoken: '+ localStorage.getItem('refreshToken'))}
            {auth?.user ? <p className="text-white">Welcome, {auth.user}</p> : <p className="text-white">Please log in</p>}
            </div> */}
        </section>
    );
}

export default Home;
