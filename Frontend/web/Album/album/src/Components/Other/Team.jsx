import { Link } from "react-router-dom"
const Team = () => {
    return (
        <section className="max-w-md mx-auto p-6 bg-project-dark-bg rounded-lg shadow-lg">
            <div>
                <h1 className="text-2xl text-white font-bold text-center mb-4">Meet the team:</h1>
                <h2 className="text-xl text-white font-bold mb-4">Hubert Bojda 
                    <a href="https://github.com/xHub50N" className="text-project-yellow"> Github</a>
                </h2>
                <h2 className="text-xl text-white font-bold mb-4">Dawid Gala
                    <a href="https://github.com/Dawo9889" className="text-project-yellow"> Github</a>
                </h2>
                <h2 className="text-xl text-white font-bold mb-4">Szymon Antonik
                    <a href="https://github.com/szantonik" className="text-project-yellow"> Github</a>
                </h2>
                <h2 className="text-xl text-white font-bold mb-4">Jakub Stachurski
                    <a href="https://github.com/ViegoValentine" className="text-project-yellow"> Github</a>
                </h2>
            </div>
        </section>
    )
}

export default Team