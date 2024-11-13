import { Link } from "react-router-dom"
// import './Navpages.css'
const LinkPage = () => {
    return (
        <section className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-4">Links</h1>
            
            <h2 className="text-2xl font-bold text-center mb-5">Public</h2>
            <Link 
                to="/login"
                className="inline-block p-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 m-4"
            >
                Login
            </Link>
            <Link 
                to="/register"
                className="inline-block p-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 m-4"
            >
                Register
            </Link>
            
            <h2 className="text-2xl font-bold text-center mb-5">Private</h2>
            <Link 
                to="/"
                className="inline-block p-4 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 m-4"
            >
                Home
            </Link>
            <Link 
                to="/weddings"
                className="inline-block p-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 m-4"
            >
                Weddings Page
            </Link>
            <Link 
                to="/admin"
                className="inline-block p-4 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 m-4"
            >
                Admin Page
            </Link>
            <Link 
                to="/album"
                className="inline-block p-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 m-4"
            >
                Album Page
            </Link>
        </section>
    )
    
    
}

export default LinkPage