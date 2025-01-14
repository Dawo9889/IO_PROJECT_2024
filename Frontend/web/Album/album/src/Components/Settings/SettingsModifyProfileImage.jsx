import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import { useProfileContext } from '../context/ProfileContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';

const SettingsModifyProfileImage = () => {
  const { profileImage, updateProfileImage } = useProfileContext();

  const authData = JSON.parse(localStorage.getItem("auth"));
  const accessToken = authData?.accessToken;

  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const [newProfilePhotoCheck, setNewProfilePhotoCheck] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(profileImage ? `data:image/png;base64,${profileImage}` : null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!photoPreview && profileImage) {
      setPhotoPreview(`data:image/png;base64,${profileImage}`);
    }
  }, [profileImage]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setNewProfilePhoto(file); 
        setNewProfilePhotoCheck(true); 
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newProfilePhoto) {
      setError("Please select a file before uploading.");
      return;
    }

    if (!accessToken) {
      setError("Authentication failed. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("file", newProfilePhoto);

    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/identity/upload-profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const binary = new Uint8Array(response.data);
      const binaryString = binary.reduce((data, byte) => data + String.fromCharCode(byte), '');
      const base64Image = btoa(binaryString);
      updateProfileImage(base64Image);
      setNewProfilePhotoCheck(false)
      window.location.reload();
    } catch (err) {
    }
  };

  return (
    <div className="relative p-4">
  
      <a
        className="absolute top-9 left-9 inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg hover:bg-project-dark-bg"
        href="/settings"
      >
        <ArrowLeftIcon className="w-6 h-6 text-white sm:w-8 sm:h-8 md:w-10 md:h-10" />
      </a>
  
      <div className="mt-16 w-full max-w-2xl mx-auto bg-project-dark-bg rounded-lg shadow-lg p-6">
        <h1 className="text-xl md:text-2xl text-white font-bold text-center mb-6">
          Modify Profile Image
        </h1>
  
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="w-full flex flex-col items-center">
            {loading ? (
              <div className="w-60 h-60 rounded-full border-2 border-project-blue shadow-lg">
                <Spinner />
              </div>
            ) : (
              <img
                alt="User Avatar"
                src={
                  photoPreview
                    ? photoPreview
                    : profileImage
                    ? `data:image/png;base64,${profileImage}`
                    : '/login-photo.png'
                }
                className="w-60 h-60 rounded-full border-2 border-project-blue shadow-lg object-cover"
              />
            )}
  
            <div
              className="w-60 text-center mt-4 bg-project-blue hover:bg-project-blue-buttons rounded-xl p-2 cursor-pointer"
              onClick={() => document.getElementById('newProfilePhoto').click()}
            >
              <span className="text-black text-sm font-semibold">Choose Photo</span>
              <input
                type="file"
                id="newProfilePhoto"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          </div>
  
          {newProfilePhotoCheck ? (
            <button
              type="submit"
              className="shadow-lg w-full relative inline-flex items-center justify-center p-2 mb-2 overflow-hidden text-sm font-medium rounded-lg border 
                        border-project-yellow bg-project-yellow text-dark group focus:outline-none focus:ring-2 
                        focus:ring-project-yellow"
            >
              Save Changes
            </button>
          ) : (
            <button
              type="submit"
              className="shadow-lg w-full relative inline-flex items-center justify-center p-2 mb-2 overflow-hidden text-sm font-medium rounded-lg border 
                        border-project-yellow bg-project-dark text-white group focus:outline-none focus:ring-2 
                        focus:ring-project-yellow"
              disabled
            >
              Save Changes
            </button>
          )}
        </form>
      </div>
    </div>
  );
  
};

export default SettingsModifyProfileImage;
