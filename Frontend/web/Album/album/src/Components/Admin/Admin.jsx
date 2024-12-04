import { Link } from "react-router-dom"

const Admin = () => {
    return (
        <div className="h-screen">
        <h1 className="text-2xl font-bold text-center mb-4 text-white">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <section className="w-full max-w-md mx-auto p-6 bg-project-dark-bg rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-white text-center mb-4">Create Wedding</h1>
            <br />
            <div className="flexGrow">
                <Link to="/createWedding" className="text-project-blue hover:underline">Create Wedding</Link>
            </div>
        </section>
        <section className="w-full max-w-md mx-auto p-6 bg-project-dark-bg rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-white text-center mb-4">Album Creator</h1>
            <br />
            <div className="flexGrow">
                <Link to="/album" className="text-project-blue hover:underline">Album Creator</Link>
            </div>
        </section>
        <section className="w-full max-w-md mx-auto p-6 bg-project-dark-bg rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-white text-center mb-4">Weddings Managment</h1>
            <br />
            <div className="flexGrow">
                <Link to="/weddings" className="text-project-blue hover:underline">Weddings managment</Link>
            </div>
        </section>
        <section className="w-full max-w-md mx-auto p-6 bg-project-dark-bg rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-white text-center mb-4">Weddings Gallery</h1>
            <br />
            <div className="flexGrow">
                <Link to="/weddingsGallery" className="text-project-blue hover:underline">Weddings Gallery</Link>
            </div>
        </section>
    </div>
    </div>
    )
}

export default Admin