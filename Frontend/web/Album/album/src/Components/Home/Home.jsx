
import logo from "../Navbar/cupidlogo-white.svg"
import useAuth from '../hooks/useAuth';
const Home = () => {
    const { auth } = useAuth();
    return (
        <section className="max-w-md mx-auto p-6 bg-project-dark-bg rounded-lg shadow-2xl">
            <img src = {logo} alt="My Happy SVG"/>
        </section>
    );
}

export default Home;
