import React from 'react'

const Mobile = () => {
  return (
<div className="rounded-2xl flex items-center justify-center bg-project-dark m-4">
<div className='bg-project-dark-bg rounded-2xl shadow-2xl max-w-full lg:max-w-4/5 p-4 h-full overflow-y-auto'>
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white">Download the Mobile App</h1>
            <a href="https://app.cupid.pics/downloads/cupid.apk" className="mt-4 inline-block bg-project-blue px-6 py-2 rounded-lg shadow-md hover:bg-project-blue-buttons">Download the latest version</a>
            <h5 className="text-xs mt-2 font-bold text-white">SHA-256: ee209ee45dfa20bbc30236c5fe1e92a4f67f462df0ffc5bacc653a64e08da36c</h5>
        </div>

        <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">How to use it:</h2>
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-medium text-white">As a wedding creator:</h3>
                    <p className="mt-2 text-white">Log in and manage your wedding directly from the app with simple tools.</p>
                </div>
                <div>
                    <h3 className="text-xl font-medium text-white">As a guest:</h3>
                    <p className="mt-2 text-white">You can continue working within the app as a guest.</p>
                </div>
            </div>
        </div>

        <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Features:</h2>
            <ul className="list-disc pl-5 text-white space-y-2">
                <li>Scan the QR code for your wedding to join the session.</li>
                <li>Take photos and add engaging captions to share the moments as they happen.</li>
            </ul>
        </div>

        <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Administrator Tools:</h2>
            <ul className="list-disc pl-5 text-white space-y-2">
                <li>Browse photos from your weddings.</li>
                <li>Adjust token validity.</li>
                <li>Access additional management features.</li>
            </ul>
        </div>
    </div>
    </div>
  )
}

export default Mobile
