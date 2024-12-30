import { Link } from "react-router-dom"
const Team = () => {
    return (
        <div className="w-full flex justify-center items-center"> 
        <section className="sm:w-4/5 lg:w-1/3 ml-4 mr-4 p-6 bg-project-dark-bg rounded-lg shadow-lg">
            <div>
                <h1 className="text-2xl text-white font-bold text-center mb-4">Meet the team:</h1>
                <h2 className="text-xl text-white font-bold mb-4 text-center">Hubert Bojda 
                    <a href="https://github.com/xHub50N" className="text-project-yellow"> Github</a>
                </h2>
                <h2 className="text-xl text-white font-bold mb-4 text-center">Dawid Gala
                    <a href="https://github.com/Dawo9889" className="text-project-yellow"> Github</a>
                </h2>
                <h2 className="text-xl text-white font-bold mb-4 text-center">Szymon Antonik
                    <a href="https://github.com/szantonik" className="text-project-yellow"> Github</a>
                </h2>
                <h2 className="text-xl text-white font-bold mb-4 text-center">Jakub Stachurski
                    <a href="https://github.com/ViegoValentine" className="text-project-yellow"> Github</a>
                </h2>
            </div>
        </section>
        </div>
    )
}

export default Team