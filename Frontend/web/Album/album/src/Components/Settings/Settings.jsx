import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useProfileContext } from '../context/ProfileContext';

const Settings = () => {

    const authData = JSON.parse(localStorage.getItem("auth"));
    const accessToken = authData?.accessToken

    const { profileImage, updateProfileImage } = useProfileContext();

    const [profileImageLoading, setProfileImageLoading] = useState(false);
    const [error, setError] = useState(null);

    const getProfileImage = () => {
      if (!accessToken) return;
      
      setProfileImageLoading(true);
      setError(null);
      axios
        .get(`${import.meta.env.VITE_API_URL}/identity/profile-picture`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: 'arraybuffer',
        })
        .then((response) => {
          const binary = new Uint8Array(response.data);
          const binaryString = binary.reduce((data, byte) => data + String.fromCharCode(byte), '');
          const base64QrCode = btoa(binaryString);
          setProfileImage(base64QrCode);
        })
        .catch((err) => {
          
          if (err.response?.status === 404) {
            setError('Profile Image not found (404).');
          } else {
            setError('Error fetching Profile Image.');
          }
        })
        .finally(() => {
          setProfileImageLoading(false);
        }); 
    }

    useEffect(() => {
      getProfileImage();
    },[])

    return (
        <div className="flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md mx-auto bg-project-dark-bg rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <img
                alt="User Avatar"
                src={profileImage ? `data:image/png;base64,${profileImage}` : '/login-photo.png'}
                className="w-12 h-12 lg:h-16 lg:w-16 rounded-full border-2 border-project-blue"
              />
              <div className="mx-2 text-white text-lg sm:text-lg lg:text-2xl font-semibold">
                {authData.user}
              </div>
            </div>
            <p className="text-white text-xl font-bold text-center mb-4">
              User Account Settings
            </p>
            <div className="flex flex-col gap-4">
              <a
                className="text-center w-full py-2 px-4 bg-project-yellow text-dark font-semibold rounded-lg hover:bg-project-yellow-buttons focus:outline-none focus:ring-2 focus:ring-project-yellow-buttons"
                href="/settings/modifyprofileimage"
              >
                Modify Profile Image
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