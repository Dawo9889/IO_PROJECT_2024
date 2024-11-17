import { Link } from "react-router-dom"
const Admin = () => {
    return (
        <>
        <h1 className="text-2xl font-bold text-center mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <section className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-4">Weddings Managment</h1>
            <br />
            <div className="flexGrow">
                <Link to="/createWedding" className="text-indigo-600 hover:underline">Create Wedding</Link>
            </div>
            <div className="flexGrow">
                <Link to="/album" className="text-indigo-600 hover:underline">Album Creator</Link>
            </div>
            <div className="flexGrow">
                <Link to="/weddings" className="text-indigo-600 hover:underline">Weddings managment</Link>
            </div>
        </section>
        <section className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">User Page</h1>
        <br />
        <div className="flexGrow">
            <Link to="/" className="text-indigo-600 hover:underline">Home</Link>
        </div>
        <div className="flexGrow">
            <Link to="/album" className="text-indigo-600 hover:underline">Album Creator</Link>
        </div>
        <div className="flexGrow">
            <Link to="/linkpage" className="text-indigo-600 hover:underline">Link page</Link>
        </div>
        <div className="flexGrow">
            <Link to="/weddings" className="text-indigo-600 hover:underline">Weddings managment</Link>
        </div>
        </section>
        <section className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Lorem ipsum</h1>
        <br />
        <div className="flexGrow">
            <Link to="/" className="text-indigo-600 hover:underline">Home</Link>
        </div>
        <div className="flexGrow">
            <Link to="/album" className="text-indigo-600 hover:underline">Album Creator</Link>
        </div>
        <div className="flexGrow">
            <Link to="/linkpage" className="text-indigo-600 hover:underline">Link page</Link>
        </div>
        <div className="flexGrow">
            <Link to="/weddings" className="text-indigo-600 hover:underline">Weddings managment</Link>
        </div>
        </section>
    </div>
    </>
    )
}

export default Admin