import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useProfileContext } from '../context/ProfileContext';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import useAuth from '../hooks/useAuth';

const SettingsModifyProfileImage = () => {
  const {profileImage, updateProfileImage } = useProfileContext();
  const {auth} = useAuth()

  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const [newProfilePhotoCheck, setNewProfilePhotoCheck] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(profileImage ? `data:image/png;base64,${profileImage}` : null);

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

    if (auth.accessToken === undefined) {
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
            Authorization: `Bearer ${auth.accessToken}`,
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

  useEffect(() => {
    if (!photoPreview && profileImage) {
      setPhotoPreview(`data:image/png;base64,${profileImage}`);
    }
  }, [profileImage]);

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
  {/* Obrazek */}
  <div className="flex justify-center">
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
  </div>

  {/* Przyciski */}
  <div className="flex flex-col md:flex-row items-center justify-center gap-4">
    <div
      className="text-center bg-project-blue hover:bg-project-blue-buttons rounded-xl p-2 cursor-pointer w-48"
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

    {newProfilePhotoCheck ? (
      <button
        type="submit"
        className="shadow-lg w-48 p-2 text-sm font-medium rounded-lg border border-project-yellow bg-project-yellow text-black 
                   hover:bg-project-yellow-dark focus:outline-none focus:ring-2 focus:ring-project-yellow"
      >
        Save Changes
      </button>
    ) : (
      <button
        type="submit"
        className="shadow-lg w-48 p-2 text-sm font-medium rounded-lg border border-project-yellow bg-project-dark text-white 
                   hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-project-yellow"
        disabled
      >
        Save Changes
      </button>
    )}
  </div>
</form>
      </div>
    </div>
  );
  
};

export default SettingsModifyProfileImage;
