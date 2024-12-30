const Missing = () => {
    return (
<div className="w-full flex justify-center items-center">
    <div className="min-w-[250px] w-1/2 min-h-[220px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[400px] mt-8 text-white flex flex-col justify-center items-center bg-project-dark-bg rounded-lg shadow-2xl gap-4">
        <h1 className="text-3xl my-2">Oops!</h1>
        <p className="text-xl">Page Not Found</p>
        <a href="/" className="mt-8 p-2 bg-project-blue text-black font-semibold rounded-lg hover:bg-project-blue-buttons focus:outline-none focus:ring-2 focus:ring-project-blue-buttons"
            >Go to the Home page!</a>
    </div>
</div>

    )
}

export default Missing