import React from 'react'
import loginPhoto from './login-photo.jpg'

const Settings = () => {

    const authData = JSON.parse(localStorage.getItem("auth"));
    
    return (
        <div className="flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md mx-auto bg-project-dark-bg rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <img
                alt="User Avatar"
                src={loginPhoto}
                className="w-16 h-16 rounded-full border-2 border-project-blue"
              />
              <div className="ml-4 text-white text-2xl font-semibold">
                {authData.user}
              </div>
            </div>
            <p className="text-white text-xl font-bold text-center mb-4">
              User Account Settings
            </p>
            <div className="flex flex-col gap-4">
              <a
                className="text-center w-full py-2 px-4 bg-project-yellow text-dark font-semibold rounded-lg hover:bg-project-yellow-buttons focus:outline-none focus:ring-2 focus:ring-project-yellow-buttons"
                href="/settings/modifyprofile"
              >
                Modify Profile
              </a>
              <a
                className="text-center w-full py-2 px-4 bg-project-yellow text-dark font-semibold rounded-lg hover:bg-project-yellow-buttons focus:outline-none focus:ring-2 focus:ring-project-yellow-buttons"
                href="/settings/changepassword"
              >
                Change Password
              </a>
            </div>
          </div>
        </div>
      );      
}

export default Settings