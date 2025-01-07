import { Link } from "react-router-dom"

const Admin = () => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    return (
        <div className="h-screen bg-project-dark">
        <h1 className="text-2xl font-bold text-center mb-4 text-white">Welcome {authData.user}</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <section className="text-center w-full max-w-md mx-auto p-6 bg-project-dark-bg rounded-lg shadow-lg">
            <div className="flexGrow">
                <Link to="/createWedding" className="text-2xl font-bold text-white text-center mb-4 hover:underline">Create Wedding</Link>
            </div>
        </section>
        <section className="text-center w-full max-w-md mx-auto p-6 bg-project-dark-bg rounded-lg shadow-lg">
            <div className="flexGrow">
                <Link to="/album" className="text-2xl font-bold text-white text-center mb-4 hover:underline">Album Creator</Link>
            </div>
        </section>
        <section className="text-center w-full max-w-md mx-auto p-6 bg-project-dark-bg rounded-lg shadow-lg">
            <div className="flexGrow">
                <Link to="/weddings" className="text-2xl font-bold text-white text-center mb-4 hover:underline">Weddings Managment</Link>
            </div>
        </section>
        <section className="text-center w-full max-w-md mx-auto p-6 bg-project-dark-bg rounded-lg shadow-lg">
            <div className="flexGrow">
                <Link to="/weddingsGallery" className="text-2xl font-bold text-white text-center mb-4 hover:underline">Weddings Gallery</Link>
            </div>
        </section>
    </div>
    </div>
    )
}

export default Admin