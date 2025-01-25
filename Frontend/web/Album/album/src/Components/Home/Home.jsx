const Home = () => {
    return (
    <div className="rounded-2xl flex items-center justify-center bg-project-dark">
        <div className='bg-project-dark-bg rounded-2xl shadow-2xl max-w-full lg:max-w-4/5 p-2 h-full overflow-y-auto'>
            <div className="text-white py-4">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold">Welcome to Cupid!</h1>
                    <p className="text-lg mt-2">Create a modern wedding album tailored to the latest technologies.</p>
                </div>
            </div>
            <div className="container mx-auto px-4 py-4">
                <section className="mb-6">
                    <h2 className="text-2xl text-white font-semibold mb-4">Quick Start Guide</h2>
                    <p className="text-white leading-relaxed">After creating an account on our service and confirming it via email, you will gain access to your personal <span className="font-bold">"Wedding Album Creator"</span> space. Here, you can create, configure, and manage your entire wedding album.</p>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">Administrative Panel Pages</h3>
                    <ul className="list-disc list-inside text-white">
                        <li><span className="font-bold">Create Wedding</span> - Create a new wedding on this page.</li>
                        <li><span className="font-bold">Album Creator</span> - Compose your wedding album here.</li>
                        <li><span className="font-bold">Weddings Management</span> - View and configure all your weddings on this page.</li>
                        <li><span className="font-bold">Weddings Gallery</span> - Browse through wedding photos and remove unwanted ones.</li>
                    </ul>
                </section>

                <section className="">
                    <h3 className="text-xl font-semibold mb-2 text-white">Account Management</h3>
                    <p className="leading-relaxed text-white">Manage your account by clicking on your profile picture and selecting <span className="font-bold">Settings</span>. You can easily:</p>
                    <ul className="list-disc list-inside text-white">
                        <li>Change your profile picture</li>
                        <li>Update your email address</li>
                        <li>Reset your password</li>
                    </ul>
                    <p className="text-white leading-relaxed mt-2">If you forget your password, don't worry! You can reset it easily from the login panel.</p>
                </section>
            </div>

            <div className="text-white py-2">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm">&copy; 2025 Cupid. All rights reserved.</p>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Home;
