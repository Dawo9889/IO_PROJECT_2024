import { Link } from "react-router-dom"
// import './Navpages.css'
const Admin = () => {
    return (
        <section className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-4">Admins Page</h1>
            <br />
            <p className="mt-4 text-center text-sm text-gray-600">Dashboard</p>
            <div className="flexGrow">
                <Link to="/" className="text-indigo-600 hover:underline">Home</Link>
            </div>
        </section>
    )
}

export default Admin